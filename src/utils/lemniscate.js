// Lemniscata (símbolo de infinito). Devuelve el path SVG y una función at(f)
// que da el punto situado a la fracción f (0 a 1) de la longitud de la curva.
export function lemniscate({ width, height, vertical = false, stretch = 1, samples = 720 }) {
    const majorHalf = (vertical ? height : width) / 2
    const minorHalf = (vertical ? width : height) / 2
    const s = Math.min(majorHalf * 0.9, (minorHalf / (0.3536 * stretch)) * 0.9)
    const cx = width / 2
    const cy = height / 2

    const pts = Array.from({ length: samples + 1 }, (_, i) => {
        const t = (i / samples) * Math.PI * 2
        const d = 1 + Math.sin(t) ** 2
        const major = (Math.cos(t) / d) * s
        const minor = ((Math.sin(t) * Math.cos(t)) / d) * s * stretch
        return vertical ? { x: cx + minor, y: cy + major } : { x: cx + major, y: cy + minor }
    })

    const cum = [0]
    for (let i = 1; i < pts.length; i++) {
        cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
    }
    const total = cum[cum.length - 1]

    const at = (f) => {
        const target = (((f % 1) + 1) % 1) * total
        let lo = 0
        let hi = cum.length - 1
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1
            if (cum[mid] <= target) lo = mid
            else hi = mid
        }
        const seg = cum[hi] - cum[lo] || 1
        const k = (target - cum[lo]) / seg
        return {
            x: pts[lo].x + (pts[hi].x - pts[lo].x) * k,
            y: pts[lo].y + (pts[hi].y - pts[lo].y) * k,
        }
    }

    const path = `${pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')}Z`

    return { path, at, pts, total }
}