import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function ReauthDialog({ onCancel }) {
    const { confirmEdit, profile } = useAuth()
    const [password, setPassword] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onCancel()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onCancel])

    const submit = async (e) => {
        e.preventDefault()
        if (busy || !password) return
        setBusy(true)
        setError('')
        const res = await confirmEdit(password)
        setBusy(false)
        if (!res.ok) {
            setError(res.message)
            setPassword('')
        }
    }

    return (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-kw-ink/40 p-4 backdrop-blur-sm">
            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 16 }}
                className="w-full max-w-sm rounded-4xl border-2 border-dashed border-kw-pink/70 bg-white p-6 text-center shadow-2xl"
            >
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-kw-pink-soft text-2xl text-kw-pink-deep">
                    <FiLock />
                </span>
                <h2 className="mt-3 font-title text-3xl">Confirma tu contraseña</h2>
                <p className="mt-1 text-sm font-semibold text-kw-ink/70">
                    {profile?.display_name}, por seguridad pedimos tu contraseña otra vez para editar.
                </p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    autoFocus
                    placeholder="Tu contraseña"
                    className="mt-4 w-full rounded-2xl border-2 border-kw-sky-deep/40 bg-white px-4 py-3 text-base outline-none transition focus:border-kw-pink"
                />

                {error && (
                    <motion.p
                        key={error}
                        animate={{ x: [0, -8, 8, -5, 5, 0] }}
                        className="mt-3 text-sm font-bold text-rose-500"
                    >
                        {error}
                    </motion.p>
                )}

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-full bg-kw-pink-soft px-4 py-2.5 font-bold text-kw-ink transition active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={busy || !password}
                        className="flex-1 rounded-full bg-kw-pink px-4 py-2.5 font-bold text-white shadow-lg transition active:scale-95 disabled:opacity-50"
                    >
                        {busy ? 'Verificando...' : 'Entrar'}
                    </button>
                </div>
            </motion.form>
        </div>
    )
}