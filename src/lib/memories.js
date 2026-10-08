import { supabase } from './supabase'
import { BUCKET } from './storage'
import { extOf, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, processImage, processVideo } from './imageTools'

export const MAX_FILES = 12
const VIDEO_EXT = { 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' }

export function validateFile(file) {
    if (file.type.startsWith('image/')) {
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
    if (m.includes('mime')) return 'Uno de los archivos tiene un formato no permitido.'
    if (m.includes('row-level security') || m.includes('policy')) {
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

// Prepara y sube los archivos; devuelve las filas listas para guardar en "media"
async function uploadFiles({ userId, memoryId, files, startPosition = 0, onProgress }) {
    const total = files.length

    const prepared = []
    for (let i = 0; i < total; i++) {
        onProgress?.({ phase: 'prepare', done: i, total })
        const f = files[i]
        prepared.push(f.type.startsWith('video/') ? await processVideo(f) : await processImage(f))
    }

    const rows = []
    for (let i = 0; i < total; i++) {
        onProgress?.({ phase: 'upload', done: i, total })
        const p = prepared[i]
        const mediaId = crypto.randomUUID()
        const base = `${userId}/${memoryId}/${mediaId}`
        const position = startPosition + i

        if (p.kind === 'image') {
            const ext = extOf(p.full)
            rows.push({
                memory_id: memoryId,
                kind: 'image',
                path_thumb: await upload(`${base}-thumb.${ext}`, p.thumb, p.thumb.type),
                path_medium: await upload(`${base}-medium.${ext}`, p.medium, p.medium.type),
                path_full: await upload(`${base}-full.${ext}`, p.full, p.full.type),
                width: p.width,
                height: p.height,
                bytes: p.full.size,
                blur: p.blur,
                position,
            })
        } else {
            const file = files[i]
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