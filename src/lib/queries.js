import { supabase } from './supabase'

const AUTHOR = 'author:profiles!memories_created_by_fkey(display_name)'
const MEDIA =
    'media(id, kind, path_thumb, path_medium, path_full, width, height, duration_s, blur, position, is_active)'
const COLUMNS = `id, title, description, memory_date, in_gallery, in_timeline, in_surprise, icon, is_active, created_by, created_at, ${AUTHOR}, ${MEDIA}`

export const PAGE_SIZE = 12

const withMedia = (m, onlyActive = true) => ({
    ...m,
    media: (m.media ?? [])
        .filter((x) => !onlyActive || x.is_active)
        .sort((a, b) => a.position - b.position),
})

export async function fetchGalleryPage(page) {
    const from = page * PAGE_SIZE
    const { data, error } = await supabase
        .from('memories')
        .select(COLUMNS)
        .eq('is_active', true)
        .eq('in_gallery', true)
        .order('memory_date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    return {
        items: data.map((m) => withMedia(m)).filter((m) => m.media.length > 0),
        hasMore: data.length === PAGE_SIZE,
    }
}

export async function fetchTimeline() {
    const { data, error } = await supabase
        .from('memories')
        .select(COLUMNS)
        .eq('is_active', true)
        .eq('in_timeline', true)
        .order('memory_date', { ascending: true })
        .order('created_at', { ascending: true })
    if (error) throw error
    return data.map((m) => withMedia(m))
}

// Para el panel: tus recuerdos (también los desactivados) y los activos del otro
export async function fetchPanelList() {
    const { data, error } = await supabase
        .from('memories')
        .select(COLUMNS)
        .order('memory_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100)
    if (error) throw error
    return data.map((m) => withMedia(m, false))
}