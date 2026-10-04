import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, toEmail } from '../lib/supabase'

const AuthContext = createContext(null)
const EDIT_WINDOW_MS = 15 * 60 * 1000

const friendly = (error) => {
    const msg = (error?.message ?? '').toLowerCase()
    if (error?.status === 429 || msg.includes('rate limit')) {
        return 'Demasiados intentos. Espera unos minutos y vuelve a probar.'
    }
    if (msg.includes('invalid login') || msg.includes('invalid credentials')) {
        return 'Usuario o contraseña incorrectos.'
    }
    if (msg.includes('fetch') || msg.includes('network')) {
        return 'No hay conexión. Revisa tu internet.'
    }
    return 'No se pudo iniciar sesión. Inténtalo de nuevo.'
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editUntil, setEditUntil] = useState(0)
    const [, tick] = useState(0)

    useEffect(() => {
        let alive = true
        supabase.auth.getSession().then(({ data }) => {
            if (!alive) return
            setSession(data.session)
            if (!data.session) setLoading(false)
        })
        const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s)
            if (!s) {
                setProfile(null)
                setEditUntil(0)
                setLoading(false)
            }
        })
        return () => {
            alive = false
            sub.subscription.unsubscribe()
        }
    }, [])

    const uid = session?.user?.id
    useEffect(() => {
        if (!uid) return
        let alive = true
        supabase
            .from('profiles')
            .select('id, username, display_name')
            .eq('id', uid)
            .maybeSingle()
            .then(({ data, error }) => {
                if (!alive) return
                // Una cuenta sin perfil no es miembro: se cierra la sesión
                if (error || !data) supabase.auth.signOut()
                else setProfile(data)
                setLoading(false)
            })
        return () => {
            alive = false
        }
    }, [uid])

    useEffect(() => {
        const left = editUntil - Date.now()
        if (left <= 0) return
        const id = setTimeout(() => tick((n) => n + 1), left + 50)
        return () => clearTimeout(id)
    }, [editUntil])

    const signIn = useCallback(async (username, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: toEmail(username),
            password,
        })
        return error ? { ok: false, message: friendly(error) } : { ok: true }
    }, [])

    const signOut = useCallback(async () => {
        await supabase.auth.signOut()
    }, [])

    // Vuelve a pedir la contraseña para entrar al panel de edición (15 minutos)
    const confirmEdit = useCallback(
        async (password) => {
            if (!session?.user?.email) return { ok: false, message: 'No hay sesión.' }
            const { error } = await supabase.auth.signInWithPassword({
                email: session.user.email,
                password,
            })
            if (error) return { ok: false, message: friendly(error) }
            setEditUntil(Date.now() + EDIT_WINDOW_MS)
            return { ok: true }
        },
        [session]
    )

    const lockEdit = useCallback(() => setEditUntil(0), [])

    const value = useMemo(
        () => ({
            session,
            profile,
            loading,
            editUntil,
            canEdit: editUntil > Date.now(),
            signIn,
            signOut,
            confirmEdit,
            lockEdit,
        }),
        [session, profile, loading, editUntil, signIn, signOut, confirmEdit, lockEdit]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)