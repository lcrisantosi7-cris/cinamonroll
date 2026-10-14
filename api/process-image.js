import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const MAX_BYTES = 40 * 1024 * 1024
const MAX_PIXELS = 40_000_000
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif'])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function reply(res, status, payload) {
    return res.status(status).json(payload)
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return reply(res, 405, { error: 'Método no permitido.' })
    }

    const authorization = req.headers.authorization || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    if (!token) return reply(res, 401, { error: 'Inicia sesión para procesar la imagen.' })

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !anonKey || !serviceKey) {
        console.error('Missing server environment variables for image processing.')
        return reply(res, 500, { error: 'El procesamiento de imágenes no está configurado en el servidor.' })
    }

    const admin = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    })

    try {
        const { data: authData, error: authError } = await admin.auth.getUser(token)
        const user = authData?.user
        if (authError || !user) return reply(res, 401, { error: 'La sesión no es válida. Vuelve a iniciar sesión.' })

        const { sourcePath, memoryId, mediaId } = req.body || {}
        if (!UUID.test(memoryId || '') || !UUID.test(mediaId || '') || typeof sourcePath !== 'string') {
            return reply(res, 400, { error: 'Solicitud de procesamiento no válida.' })
        }

        const segments = sourcePath.split('/')
        if (segments.length !== 3 || segments[0] !== user.id || segments[1] !== memoryId) {
            return reply(res, 403, { error: 'No puedes procesar archivos de otra cuenta.' })
        }
        const filename = segments[2]
        const extension = filename.split('.').pop()?.toLowerCase()
        if (filename !== `${mediaId}.${extension}` || !IMAGE_EXTENSIONS.has(extension)) {
            return reply(res, 400, { error: 'Formato de imagen no permitido.' })
        }

        const [{ data: roleRow, error: roleError }, membership] = await Promise.all([
            admin.from('app_roles').select('role').eq('user_id', user.id).maybeSingle(),
            (async () => {
                const userClient = createClient(supabaseUrl, anonKey, {
                    global: { headers: { Authorization: `Bearer ${token}` } },
                    auth: { persistSession: false, autoRefreshToken: false },
                })
                return userClient.rpc('is_member')
            })(),
        ])

        if (roleError) throw roleError
        const role = roleRow?.role || 'member'
        const isAllowedRole = role === 'admin' || role === 'photo_uploader'
        if (!isAllowedRole || (role !== 'admin' && (membership.error || membership.data !== true))) {
            return reply(res, 403, { error: 'Tu cuenta no tiene permiso para procesar imágenes.' })
        }

        const { data: sourceBlob, error: downloadError } = await admin.storage
            .from('image-staging')
            .download(sourcePath)
        if (downloadError || !sourceBlob) {
            return reply(res, 400, { error: 'No se encontró la imagen temporal. Vuelve a seleccionarla.' })
        }

        const source = Buffer.from(await sourceBlob.arrayBuffer())
        if (!source.length || source.length > MAX_BYTES) {
            await admin.storage.from('image-staging').remove([sourcePath])
            return reply(res, 413, { error: 'La imagen supera el límite de 40 MB.' })
        }

        const base = `${user.id}/${memoryId}/${mediaId}`
        const uploadedPaths = []
        try {
            const input = sharp(source, { limitInputPixels: MAX_PIXELS, failOn: 'error' })
            const metadata = await input.metadata()
            if (!metadata.width || !metadata.height || metadata.width * metadata.height > MAX_PIXELS) {
                return reply(res, 400, { error: 'La imagen tiene dimensiones demasiado grandes.' })
            }
            if (!['jpeg', 'png', 'webp', 'avif'].includes(metadata.format)) {
                return reply(res, 415, { error: 'Formato no admitido. Usa JPG, PNG, WebP o AVIF.' })
            }

            const variants = [
                { key: 'thumb', max: 480, quality: 72 },
                { key: 'medium', max: 1280, quality: 80 },
                { key: 'full', max: 2200, quality: 84 },
            ]
            const outputs = await Promise.all(variants.map(async ({ key, max, quality }) => {
                const result = await sharp(source, { limitInputPixels: MAX_PIXELS, failOn: 'error' })
                    .rotate()
                    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
                    .webp({ quality, effort: 4 })
                    .toBuffer({ resolveWithObject: true })
                return { key, buffer: result.data, width: result.info.width, height: result.info.height }
            }))

            const paths = {}
            for (const output of outputs) {
                const path = `${base}-${output.key}.webp`
                const { error: uploadError } = await admin.storage.from('media').upload(path, output.buffer, {
                    contentType: 'image/webp',
                    cacheControl: '31536000',
                    upsert: false,
                })
                if (uploadError) throw uploadError
                uploadedPaths.push(path)
                paths[output.key] = path
            }

            const full = outputs.find((item) => item.key === 'full')
            return reply(res, 200, {
                kind: 'image',
                path_thumb: paths.thumb,
                path_medium: paths.medium,
                path_full: paths.full,
                width: full.width,
                height: full.height,
                bytes: outputs.find((item) => item.key === 'full').buffer.length,
                contentType: 'image/webp',
            })
        } catch (error) {
            if (uploadedPaths.length) {
                await admin.storage.from('media').remove(uploadedPaths).catch(() => {})
            }
            console.error('Image processing failed:', error?.message || error)
            return reply(res, 422, { error: 'No se pudo validar o procesar la imagen. Prueba con JPG, PNG o WebP.' })
        } finally {
            await admin.storage.from('image-staging').remove([sourcePath]).catch(() => {})
        }
    } catch (error) {
        console.error('Image processing request failed:', error?.message || error)
        return reply(res, 500, { error: 'No se pudo procesar la imagen en este momento.' })
    }
}
