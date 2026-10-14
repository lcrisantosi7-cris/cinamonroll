import { supabase } from './supabase'

export const BUCKET = 'media'
const TTL_SECONDS = 60 * 60
const MARGIN_MS = 5 * 60 * 1000
const SESSION_KEY = 'signed-urls-v2'
const LEGACY_KEY = 'signed-urls-v1'

const load = () => {
    try {
        const raw = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}')
        const now = Date.now()
        return new Map(Object.entries(raw).filter(([, v]) => v?.exp > now + MARGIN_MS))
    } catch {
        return new Map()
    }
}
const cache = load()

let saveTimer = null
const save = () => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(Object.fromEntries(cache)))
        } catch {
            /* sin almacenamiento o lleno: se ignora */
        }
    }, 300)
}

export async function signPaths(paths) {
    const wanted = [...new Set(paths.filter(Boolean))]
    const now = Date.now()
    const missing = wanted.filter((p) => !(cache.get(p)?.exp > now + MARGIN_MS))

    if (missing.length) {
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(missing, TTL_SECONDS)
        if (error) throw error
        for (const row of data) {
            if (row.signedUrl) cache.set(row.path, { url: row.signedUrl, exp: now + TTL_SECONDS * 1000 })
        }
        save()
    }
    return Object.fromEntries(wanted.map((p) => [p, cache.get(p)?.url ?? null]))
}

export const clearSigned = () => {
    clearTimeout(saveTimer)
    cache.clear()
    try {
        sessionStorage.removeItem(SESSION_KEY)
        // Borra la caché antigua que guardaba URLs firmadas en localStorage.
        localStorage.removeItem(LEGACY_KEY)
    } catch {
        /* nada que borrar */
    }
}
