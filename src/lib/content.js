import { supabase } from './supabase'
import { queryClient } from './queryClient'

const must = ({ data, error }) => {
    if (error) throw error
    return data
}

// ---------- Lectura ----------
export const fetchReasons = async () =>
    must(
        await supabase
            .from('reasons')
            .select('id, body')
            .eq('is_active', true)
            .order('position')
            .order('created_at')
    )

export const fetchMessages = async () =>
    must(
        await supabase
            .from('messages')
            .select('id, body')
            .eq('is_active', true)
            .order('position')
            .order('created_at')
    )

export const fetchSettings = async () => {
    const row = must(
        await supabase.from('site_content').select('value').eq('key', 'settings').maybeSingle()
    )
    return row?.value ?? {}
}

export const fetchSurprise = async () => {
    const row = must(
        await supabase.from('site_content').select('value').eq('key', 'surprise').maybeSingle()
    )
    return row?.value ?? null
}

const toMeta = (l) => ({
    id: l.id,
    label: l.label,
    title: l.title,
    tone: l.tone,
    date: l.letter_date,
    unlockAt: l.unlock_at,
})

export const fetchLetters = async () =>
    must(
        await supabase
            .from('letters')
            .select('id, label, title, tone, letter_date, unlock_at')
            .eq('is_active', true)
            .order('position')
            .order('created_at')
    ).map(toMeta)

// La base solo entrega el texto si la carta ya se puede abrir
export const fetchLetterBody = async (id) =>
    must(
        await supabase
            .from('letter_bodies')
            .select('greeting, paragraphs, closing, signature, ps')
            .eq('letter_id', id)
            .maybeSingle()
    )

export const fetchCoupons = async () =>
    must(
        await supabase
            .from('coupons')
            .select('id, title, body, icon')
            .eq('is_active', true)
            .order('position')
            .order('created_at')
    )

export const fetchRedemptions = async () =>
    must(await supabase.from('coupon_redemptions').select('coupon_id, redeemed_by, redeemed_at, fulfilled_at'))

export async function fetchSurpriseMedia() {
    const data = must(
        await supabase
            .from('memories')
            .select(
                'id, title, memory_date, media(id, kind, path_thumb, path_medium, path_full, blur, position, is_active)'
            )
            .eq('in_surprise', true)
            .eq('is_active', true)
            .order('memory_date', { ascending: true })
    )
    return data.flatMap((m) =>
        (m.media ?? []).filter((x) => x.is_active).sort((a, b) => a.position - b.position)
    )
}

// ---------- Progreso personal ----------
export async function fetchProgress() {
    const [games, state, reads] = await Promise.all([
        supabase.from('game_progress').select('game_id'),
        supabase.from('user_state').select('gift_opened').maybeSingle(),
        supabase.from('letter_reads').select('letter_id'),
    ])
    for (const r of [games, state, reads]) if (r.error) throw r.error
    return {
        completed: Object.fromEntries((games.data ?? []).map((g) => [g.game_id, true])),
        giftOpened: state.data?.gift_opened ?? false,
        lettersRead: Object.fromEntries((reads.data ?? []).map((r) => [r.letter_id, true])),
    }
}

export async function completeGame(id) {
    const { error } = await supabase
        .from('game_progress')
        .upsert({ game_id: id }, { onConflict: 'user_id,game_id', ignoreDuplicates: true })
    if (error) throw error
    await queryClient.invalidateQueries({ queryKey: ['progress'] })
}

export async function openGift() {
    const { error } = await supabase
        .from('user_state')
        .upsert({ gift_opened: true }, { onConflict: 'user_id' })
    if (error) throw error
    await queryClient.invalidateQueries({ queryKey: ['progress'] })
}

export async function markLetterRead(id) {
    if (queryClient.getQueryData(['progress'])?.lettersRead?.[id]) return
    queryClient.setQueryData(['progress'], (old) =>
        old ? { ...old, lettersRead: { ...old.lettersRead, [id]: true } } : old
    )
    const { error } = await supabase
        .from('letter_reads')
        .upsert({ letter_id: id }, { onConflict: 'user_id,letter_id', ignoreDuplicates: true })
    if (error) queryClient.invalidateQueries({ queryKey: ['progress'] })
}

export async function redeemCoupon(id) {
    queryClient.setQueryData(['redemptions'], (old) => [...(old ?? []), { coupon_id: id }])
    const { error } = await supabase.from('coupon_redemptions').insert({ coupon_id: id })
    await queryClient.invalidateQueries({ queryKey: ['redemptions'] })
    if (error) throw error
}