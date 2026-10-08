import { readdir, stat, unlink, mkdir, rename } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = 'src/assets/images'
const BACKUP = 'originals-backup/images'

const RULES = [
    { match: 'characters/', width: 640, quality: 82 },
    { match: 'decor/', width: 512, quality: 82 },
    { match: 'icons/', width: 192, quality: 84 },
    { match: 'surprise/medal', width: 256, quality: 84 },
    { match: 'surprise/coupon', width: 384, quality: 82 },
    { match: 'gallery/', width: 1400, quality: 78 },
]

async function* walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name)
        if (e.isDirectory()) yield* walk(p)
        else yield p
    }
}

let before = 0
let after = 0

for await (const file of walk(ROOT)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue
    const rel = path.relative(ROOT, file).split(path.sep).join('/')
    const rule = RULES.find((r) => rel.startsWith(r.match)) ?? { width: 800, quality: 80 }
    const out = file.replace(/\.(png|jpe?g)$/i, '.webp')

    before += (await stat(file)).size
    await sharp(file)
        .resize({ width: rule.width, withoutEnlargement: true })
        .webp({ quality: rule.quality, effort: 6, alphaQuality: 90 })
        .toFile(out)
    after += (await stat(out)).size
    console.log(`${rel} -> ${(await stat(out)).size >> 10} KB`)

    const dest = path.join(BACKUP, rel)
    await mkdir(path.dirname(dest), { recursive: true })
    if (!existsSync(dest)) await rename(file, dest)
    else await unlink(file)
}

// Favicon: de ~1 MB a 256 px, más el icono de iPhone
const FAV = 'public/favicon.png'
if (existsSync(FAV) && (await stat(FAV)).size > 100 * 1024) {
    await mkdir('originals-backup', { recursive: true })
    await rename(FAV, 'originals-backup/favicon.png')
    await sharp('originals-backup/favicon.png')
        .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ palette: true, compressionLevel: 9 })
        .toFile(FAV)
    await sharp('originals-backup/favicon.png')
        .resize(180, 180, { fit: 'contain', background: '#e6f4ff' })
        .flatten({ background: '#e6f4ff' })
        .png({ palette: true })
        .toFile('public/apple-touch-icon.png')
    console.log('favicon listo')
}

console.log(`\nTotal: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`)