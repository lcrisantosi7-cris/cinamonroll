import { readdir, mkdir, rename, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const DIR = 'src/assets/audio'
const BACKUP = 'originals-backup/audio'
await mkdir(BACKUP, { recursive: true })

for (const name of await readdir(DIR)) {
    if (!/\.mp3$/i.test(name)) continue
    const file = path.join(DIR, name)
    const backup = path.join(BACKUP, name)
    if (existsSync(backup)) continue
    await rename(file, backup)
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', backup, '-vn', '-map_metadata', '-1', '-ac', '2', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '96k', file], { stdio: 'inherit' })
    if (r.status !== 0) {
        await rename(backup, file)
        console.error(`Falló ${name}: ¿está instalado ffmpeg?`)
        process.exit(1)
    }
    console.log(`${name}: ${((await stat(backup)).size / 1048576).toFixed(1)} MB -> ${((await stat(file)).size / 1048576).toFixed(1)} MB`)
}