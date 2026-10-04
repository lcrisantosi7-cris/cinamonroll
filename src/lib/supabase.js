import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const domain = import.meta.env.VITE_AUTH_DOMAIN || 'example.com'

if (!url || !key) {
    throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local')
}

export const supabase = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
})

// El login pide "usuario": por dentro es un correo con formato usuario@dominio
export const toEmail = (username) => {
    const u = username.trim().toLowerCase()
    return u.includes('@') ? u : `${u}@${domain}`
}