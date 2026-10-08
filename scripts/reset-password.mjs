import { createClient } from '@supabase/supabase-js'
import { askHidden } from './_prompt.mjs'

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env
const [username] = process.argv.slice(2)

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !username) {
    console.error('Uso: node --env-file=.env.admin scripts/reset-password.mjs <usuario>')
    process.exit(1)
}

const password = await askHidden('Nueva contraseña (mínimo 8 caracteres): ')
if (password.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.')
    process.exit(1)
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
})

const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()
if (!profile) {
    console.error('Ese usuario no existe.')
    process.exit(1)
}

const { error } = await admin.auth.admin.updateUserById(profile.id, { password })
if (error) {
    console.error('No se pudo cambiar:', error.message)
    process.exit(1)
}
console.log(`Contraseña de "${username}" actualizada.`)