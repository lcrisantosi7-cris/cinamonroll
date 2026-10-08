// Requiere ffmpeg (Windows: winget install ffmpeg). Baja cada canción a 96 kbps.
import { readdir, mkdir, copyFile, rename, unlink, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const DIR = 'src/assets/audio'
const BACKUP = 'originals-backup/audio'
await mkdir(DIR, { recursive: true })
await mkdir(BACKUP, { recursive: true })

const bitrate = (f) =>
    Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=bit_rate', '-of', 'csv=p=0', f]).stdout?.toString().trim()) || Infinity

const isMp3 = (n) => /\.mp3$/i.test(n)
const names = new Set([...(await readdir(DIR)).filter(isMp3), ...(await readdir(BACKUP)).filter(isMp3)])

for (const name of names) {
    const file = path.join(DIR, name)
    const backup = path.join(BACKUP, name)
    if (existsSync(file) && existsSync(backup)) continue
    if (existsSync(file) && bitrate(file) <= 100_000) continue
    if (!existsSync(backup)) await copyFile(file, backup)

    const tmp = `${file}.tmp.mp3`
    const r = spawnSync(
        'ffmpeg',
        ['-y', '-loglevel', 'error', '-i', backup, '-vn', '-map_metadata', '-1', '-ac', '2', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '96k', tmp],
        { stdio: 'inherit' }
    )
    if (r.status !== 0) {
        if (existsSync(tmp)) await unlink(tmp)
        console.error(`Falló ${name}: ¿está instalado ffmpeg?`)
        process.exit(1)
    }
    await rename(tmp, file)
    console.log(`${name}: ${((await stat(backup)).size / 1048576).toFixed(1)} MB -> ${((await stat(file)).size / 1048576).toFixed(1)} MB`)
}