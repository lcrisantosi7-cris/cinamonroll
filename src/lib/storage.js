import { supabase } from './supabase'

export const BUCKET = 'media'
const TTL_SECONDS = 60 * 60 * 12
const MARGIN_MS = 10 * 60 * 1000
const LS_KEY = 'signed-urls-v1'

const load = () => {
    try {
        const raw = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}')
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
            localStorage.setItem(LS_KEY, JSON.stringify(Object.fromEntries(cache)))
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
    cache.clear()
    try {
        localStorage.removeItem(LS_KEY)
    } catch {
        /* nada que borrar */
    }
}