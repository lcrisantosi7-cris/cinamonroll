import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { argv, env, exit } from 'node:process'
import { COUPONS, LETTERS, MESSAGES, REASONS, SETTINGS, SURPRISE } from './seed/content.mjs'

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = env
const asIdx = argv.indexOf('--as')
const username = asIdx > -1 ? argv[asIdx + 1] : 'luis'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY. Usa: node --env-file=.env.admin ...')
    exit(1)
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
})

const { data: author } = await admin.from('profiles').select('id').eq('username', username).maybeSingle()
if (!author) {
    console.error(`No existe el usuario "${username}".`)
    exit(1)
}
const created_by = author.id

const clean = (t) =>
    String(t).replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, '').replace(/\s{2,}/g, ' ').trim()
const keyOf = (prefix, text) =>
    `${prefix}:${createHash('sha1').update(text).digest('hex').slice(0, 10)}`

// Inserta solo lo que falta: no duplica ni pisa lo que ya editaste en el panel
async function insertMissing(table, rows, conflict = 'seed_key') {
    if (!rows.length) return []
    const { data, error } = await admin
        .from(table)
        .upsert(rows, { onConflict: conflict, ignoreDuplicates: true })
        .select()
    if (error) {
        console.error(`Error en ${table}:`, error.message)
        exit(1)
    }
    return data
}

const reasons = REASONS.map(clean).filter(Boolean)
const messages = MESSAGES.map(clean).filter(Boolean)

const added = {
    razones: await insertMissing('reasons', reasons.map((body, i) => ({
        seed_key: keyOf('r', body), body, position: i * 10, created_by,
    }))),
    mensajes: await insertMissing('messages', messages.map((body, i) => ({
        seed_key: keyOf('m', body), body, position: i * 10, created_by,
    }))),
    cupones: await insertMissing('coupons', COUPONS.map((c, i) => ({
        seed_key: `c:${c.key}`, title: c.title, body: c.body, icon: c.icon ?? null, position: i * 10, created_by,
    }))),
    cartas: await insertMissing('letters', LETTERS.map((l, i) => ({
        seed_key: `l:${l.id}`,
        label: l.label,
        title: l.title,
        tone: l.tone ?? 'pink',
        letter_date: l.date ?? null,
        unlock_at: l.unlockAt ?? null,
        position: i * 10,
        created_by,
    }))),
}

// Cuerpo de cada carta (se carga solo para las cartas que acaban de crearse)
const { data: letterRows } = await admin
    .from('letters')
    .select('id, seed_key')
    .in('seed_key', LETTERS.map((l) => `l:${l.id}`))
const idByKey = Object.fromEntries((letterRows ?? []).map((r) => [r.seed_key, r.id]))

await insertMissing(
    'letter_bodies',
    LETTERS.filter((l) => idByKey[`l:${l.id}`]).map((l) => ({
        letter_id: idByKey[`l:${l.id}`],
        greeting: l.greeting ?? '',
        paragraphs: l.paragraphs ?? [],
        closing: l.closing ?? '',
        signature: l.signature ?? '',
        ps: l.ps ?? null,
    })),
    'letter_id'
)

await insertMissing(
    'site_content',
    [
        { key: 'settings', value: SETTINGS, created_by },
        { key: 'surprise', value: SURPRISE, created_by },
    ],
    'key'
)

for (const [name, rows] of Object.entries(added)) {
    console.log(`${name}: ${rows.length} nuevos`)
}
console.log('Listo. Puedes volver a correrlo cuando agregues contenido nuevo a los archivos.')