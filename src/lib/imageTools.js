const SIZES = {
    thumb: { max: 480, q: 0.72 },
    medium: { max: 1280, q: 0.8 },
    full: { max: 2200, q: 0.84 },
}

export const MAX_IMAGE_BYTES = 40 * 1024 * 1024
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024

export const todayISO = () => new Date().toLocaleDateString('en-CA')
export const extOf = (blob) => (blob.type === 'image/webp' ? 'webp' : 'jpg')

function drawScaled(source, sw, sh, max) {
    const scale = Math.min(1, max / Math.max(sw, sh))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sw * scale))
    canvas.height = Math.max(1, Math.round(sh * scale))
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
    return canvas
}

// WebP si el navegador puede; si no (algunos iPhone), JPG
function encode(canvas, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob && blob.type === 'image/webp') return resolve(blob)
                canvas.toBlob(
                    (jpg) => (jpg ? resolve(jpg) : reject(new Error('No se pudo comprimir la imagen.'))),
                    'image/jpeg',
                    quality
                )
            },
            'image/webp',
            quality
        )
    })
}

const waitFor = (el, event, ms) =>
    new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('tiempo agotado')), ms)
        el.addEventListener(event, () => { clearTimeout(timer); resolve() }, { once: true })
        el.addEventListener('error', () => { clearTimeout(timer); reject(new Error('error de lectura')) }, { once: true })
    })

export async function processImage(file) {
    let bitmap
    try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
        try {
            bitmap = await createImageBitmap(file)
        } catch {
            throw new Error(`No se pudo leer "${file.name}". Prueba con una foto JPG, PNG o WebP.`)
        }
    }

    const { width, height } = bitmap
    const out = {}
    for (const [key, { max, q }] of Object.entries(SIZES)) {
        out[key] = await encode(drawScaled(bitmap, width, height, max), q)
    }
    const blur = drawScaled(bitmap, width, height, 16).toDataURL('image/jpeg', 0.5)
    bitmap.close?.()

    const k = Math.min(1, SIZES.full.max / Math.max(width, height))
    return {
        kind: 'image',
        ...out,
        blur,
        width: Math.round(width * k),
        height: Math.round(height * k),
    }
}

export async function processVideo(file) {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = url

    let thumb = null
    let blur = null
    let width = null
    let height = null
    let duration = null

    try {
        await waitFor(video, 'loadeddata', 12000)
        width = video.videoWidth
        height = video.videoHeight
        duration = Number.isFinite(video.duration) ? video.duration : null
        video.currentTime = Math.min(0.5, (duration ?? 1) / 2)
        await waitFor(video, 'seeked', 3000).catch(() => { })
        thumb = await encode(drawScaled(video, width, height, SIZES.thumb.max), SIZES.thumb.q)
        blur = drawScaled(video, width, height, 16).toDataURL('image/jpeg', 0.5)
    } catch {
        /* sin póster: el video se sube igual */
    } finally {
        URL.revokeObjectURL(url)
        video.removeAttribute('src')
        video.load()
    }

    return { kind: 'video', file, thumb, blur, width, height, duration }
}

// Fecha en que se tomó la foto (si el archivo la trae)
export async function readExifDate(file) {
    if (!file.type.startsWith('image/')) return null
    try {
        const { default: exifr } = await import('exifr')
        const meta = await exifr.parse(file, ['DateTimeOriginal', 'CreateDate'])
        const d = meta?.DateTimeOriginal ?? meta?.CreateDate
        if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null
        return d.toLocaleDateString('en-CA')
    } catch {
        return null
    }
}