import { createClient } from '@supabase/supabase-js'
import { askHidden } from './_prompt.mjs'

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, AUTH_DOMAIN = 'example.com' } = process.env
const [username, displayName] = process.argv.slice(2)

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY. Usa: node --env-file=.env.admin ...')
    process.exit(1)
}
if (!username || !displayName || !/^[a-z0-9_]{3,20}$/.test(username)) {
    console.error('Uso: node --env-file=.env.admin scripts/create-user.mjs <usuario> "<Nombre>"')
    console.error('El usuario: 3 a 20 caracteres, minúsculas, números o guion bajo.')
    process.exit(1)
}

const password = await askHidden('Contraseña (mínimo 8 caracteres): ')
const again = await askHidden('Repite la contraseña: ')
if (password !== again) {
    console.error('Las contraseñas no coinciden.')
    process.exit(1)
}
if (password.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.')
    process.exit(1)
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await admin.auth.admin.createUser({
    email: `${username}@${AUTH_DOMAIN}`,
    password,
    email_confirm: true,
})
if (error) {
    console.error('No se pudo crear el usuario:', error.message)
    process.exit(1)
}

const { error: profileError } = await admin
    .from('profiles')
    .insert({ id: data.user.id, username, display_name: displayName })
if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id)
    console.error('No se pudo crear el perfil:', profileError.message)
    process.exit(1)
}

console.log(`Listo: ${displayName} puede entrar con el usuario "${username}".`)