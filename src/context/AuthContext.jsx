import { clearSigned } from '../lib/storage'
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
    const [canEdit, setCanEdit] = useState(false)

    useEffect(() => {
        let alive = true
        supabase.auth
            .getSession()
            .then(({ data }) => {
                if (!alive) return
                setSession(data.session)
                if (!data.session) setLoading(false)
            })
            .catch(() => {
                if (alive) setLoading(false)
            })
        const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s)
            if (!s) {
                clearSigned()
                setProfile(null)
                setEditUntil(0)
                setCanEdit(false)
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
                // Error de red: no cerramos la sesión, solo dejamos de cargar
                if (error) {
                    setLoading(false)
                    return
                }
                // Una cuenta sin perfil no es miembro: se cierra la sesión
                if (!data) supabase.auth.signOut()
                else setProfile(data)
                setLoading(false)
            })
            .catch(() => {
                if (alive) setLoading(false)
            })
        return () => {
            alive = false
        }
    }, [uid])

    // Al vencer los 15 minutos, se vuelve a bloquear la edición
    useEffect(() => {
        if (editUntil <= 0) return
        const id = setTimeout(() => setCanEdit(false), Math.max(editUntil - Date.now(), 0))
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
            setCanEdit(true)
            return { ok: true }
        },
        [session]
    )

    const lockEdit = useCallback(() => {
        setEditUntil(0)
        setCanEdit(false)
    }, [])

    const value = useMemo(
        () => ({
            session,
            profile,
            loading,
            editUntil,
            canEdit,
            signIn,
            signOut,
            confirmEdit,
            lockEdit,
        }),
        [session, profile, loading, editUntil, canEdit, signIn, signOut, confirmEdit, lockEdit]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)