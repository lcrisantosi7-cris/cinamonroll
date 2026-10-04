import { supabase } from './supabase'

export const BUCKET = 'media'
const TTL_SECONDS = 60 * 60 * 12 // los enlaces duran 12 horas
const cache = new Map() // ruta -> { url, exp }

export async function signPaths(paths) {
    const wanted = [...new Set(paths.filter(Boolean))]
    const now = Date.now()
    const missing = wanted.filter((p) => !(cache.get(p)?.exp > now + 60_000))

    if (missing.length) {
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(missing, TTL_SECONDS)
        if (error) throw error
        for (const row of data) {
            if (row.signedUrl) cache.set(row.path, { url: row.signedUrl, exp: now + TTL_SECONDS * 1000 })
        }
    }
    return Object.fromEntries(wanted.map((p) => [p, cache.get(p)?.url ?? null]))
}

export const clearSigned = () => cache.clear()