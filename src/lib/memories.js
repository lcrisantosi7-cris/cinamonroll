import { supabase } from './supabase'
import { BUCKET } from './storage'
import { extOf, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, processVideo } from './imageTools'

export const MAX_FILES = 12
const VIDEO_EXT = { 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' }
const IMAGE_EXT = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
}
const STAGING_BUCKET = 'image-staging'

export function validateFile(file) {
    if (file.type.startsWith('image/')) {
        if (!IMAGE_EXT[file.type]) return `"${file.name}" tiene un formato no compatible. Usa JPG, PNG, WebP o AVIF.`
        return file.size <= MAX_IMAGE_BYTES ? null : `"${file.name}" pesa demasiado (máximo 40 MB).`
    }
    if (VIDEO_EXT[file.type]) {
        return file.size <= MAX_VIDEO_BYTES
            ? null
            : `"${file.name}" pesa ${(file.size / 1048576).toFixed(0)} MB y el máximo para videos es 50 MB. Prueba con un clip más corto.`
    }
    return `"${file.name}" no es una foto ni un video compatible.`
}

export function friendlyError(e) {
    const m = (e?.message ?? '').toLowerCase()
    if (m.includes('exceeded') || m.includes('too large') || m.includes('payload')) {
        return 'Un archivo supera el tamaño máximo permitido (50 MB).'
    }
    if (m.includes('mime') || m.includes('format')) return 'Uno de los archivos tiene un formato no permitido.'
    if (m.includes('row-level security') || m.includes('policy') || m.includes('permission')) {
        return 'No tienes permiso para hacer esto. Cierra sesión y vuelve a entrar.'
    }
    if (m.includes('fetch') || m.includes('network')) {
        return 'Se cortó la conexión. Revisa tu internet e inténtalo otra vez.'
    }
    return e?.message || 'Algo salió mal. Inténtalo otra vez.'
}

async function upload(path, blob, contentType) {
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType, cacheControl: '31536000', upsert: false })
    if (error) throw error
    return path
}

async function uploadImageThroughServer(file, { userId, memoryId, mediaId }) {
    const extension = IMAGE_EXT[file.type]
    if (!extension) throw new Error('Formato no admitido. Usa JPG, PNG, WebP o AVIF.')
    const sourcePath = `${userId}/${memoryId}/${mediaId}.${extension}`

    const { error: stageError } = await supabase.storage
        .from(STAGING_BUCKET)
        .upload(sourcePath, file, { contentType: file.type, cacheControl: '60', upsert: false })
    if (stageError) throw stageError

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session?.access_token) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')

        const response = await fetch('/api/process-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ sourcePath, memoryId, mediaId }),
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'El servidor no pudo procesar la imagen.')
        return result
    } catch (error) {
        // La función también intenta borrar el original temporal; esta es una segunda limpieza.
        await supabase.storage.from(STAGING_BUCKET).remove([sourcePath]).catch(() => {})
        throw error
    }
}

// Prepara y sube los archivos; las imágenes finales se recodifican obligatoriamente en Vercel.
async function uploadFiles({ userId, memoryId, files, startPosition = 0, onProgress }) {
    const total = files.length
    const rows = []

    for (let i = 0; i < total; i++) {
        onProgress?.({ phase: 'prepare', done: i, total })
        const file = files[i]
        const mediaId = crypto.randomUUID()
        const base = `${userId}/${memoryId}/${mediaId}`
        const position = startPosition + i

        if (file.type.startsWith('image/')) {
            const processed = await uploadImageThroughServer(file, { userId, memoryId, mediaId })
            rows.push({
                memory_id: memoryId,
                kind: 'image',
                path_thumb: processed.path_thumb,
                path_medium: processed.path_medium,
                path_full: processed.path_full,
                width: processed.width,
                height: processed.height,
                bytes: processed.bytes,
                blur: processed.blur,
                position,
            })
        } else {
            const p = await processVideo(file)
            onProgress?.({ phase: 'upload', done: i, total })
            rows.push({
                memory_id: memoryId,
                kind: 'video',
                path_thumb: p.thumb ? await upload(`${base}-poster.${extOf(p.thumb)}`, p.thumb, p.thumb.type) : null,
                path_full: await upload(`${base}.${VIDEO_EXT[file.type]}`, file, file.type),
                width: p.width,
                height: p.height,
                duration_s: p.duration,
                bytes: file.size,
                blur: p.blur,
                position,
            })
        }
        onProgress?.({ phase: 'upload', done: i + 1, total })
    }
    return rows
}

export async function createMemory({
    userId, title, description, date, inGallery, inTimeline, inSurprise = false, icon, files, onProgress,
}) {
    const memoryId = crypto.randomUUID()
    const rows = await uploadFiles({ userId, memoryId, files, onProgress })

    onProgress?.({ phase: 'save', done: files.length, total: files.length })
    const { error: memError } = await supabase.from('memories').insert({
        id: memoryId,
        title,
        description,
        memory_date: date,
        in_gallery: inGallery,
        in_timeline: inTimeline,
        in_surprise: inSurprise,
        icon,
    })
    if (memError) throw memError

    if (rows.length) {
        const { error: mediaError } = await supabase.from('media').insert(rows)
        if (mediaError) {
            await supabase.from('memories').update({ is_active: false }).eq('id', memoryId)
            throw mediaError
        }
    }
    return memoryId
}

export async function addMedia({ userId, memoryId, files, startPosition, onProgress }) {
    const rows = await uploadFiles({ userId, memoryId, files, startPosition, onProgress })
    if (!rows.length) return
    const { error } = await supabase.from('media').insert(rows)
    if (error) throw error
}
