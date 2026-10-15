import { createClient } from '@supabase/supabase-js'
import { askHidden } from './_prompt.mjs'

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, AUTH_DOMAIN = 'example.com' } = process.env
const [username, displayName] = process.argv.slice(2)

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY. Usa: node --env-file=.env.admin ...')
    process.exit(1)
}
if (!username || !displayName || !/^[a-z0-9_]{3,20}$/.test(username)) {
    console.error('Uso: node --env-file=.env.admin scripts/create-uploader-user.mjs <usuario> "<Nombre>"')
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

// 1. Crear el usuario en Auth
const { data, error } = await admin.auth.admin.createUser({
    email: `${username}@${AUTH_DOMAIN}`,
    password,
    email_confirm: true,
})
if (error) {
    console.error('No se pudo crear el usuario:', error.message)
    process.exit(1)
}

const userId = data.user.id

// 2. Crear el registro en la tabla profiles
const { error: profileError } = await admin
    .from('profiles')
    .insert({ id: userId, username, display_name: displayName })

if (profileError) {
    await admin.auth.admin.deleteUser(userId)
    console.error('No se pudo crear el perfil:', profileError.message)
    process.exit(1)
}

// 3. Asignar el rol de 'photo_uploader' en app_roles
const { error: roleError } = await admin
    .from('app_roles')
    .insert({ user_id: userId, role: 'photo_uploader' })

if (roleError) {
    // Si falla asignar el rol, hacemos rollback eliminando el perfil y el usuario
    await admin.from('profiles').delete().eq('id', userId)
    await admin.auth.admin.deleteUser(userId)
    console.error('No se pudo asignar el rol de photo_uploader:', roleError.message)
    process.exit(1)
}

console.log(`\n¡Éxito! ${displayName} (${username}) ha sido creada con el rol 'photo_uploader'.`)