import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiHeart, FiLock, FiUser } from 'react-icons/fi'
import Background from '../components/layout/Background'
import PageLoader from '../components/ui/PageLoader'
import Sticker from '../components/ui/Sticker'
import Sparkle from '../components/ui/Sparkle'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { session, profile, loading, signIn } = useAuth()
    const location = useLocation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [fails, setFails] = useState(0)
    const [lockedUntil, setLockedUntil] = useState(0)

    const from = location.state?.from?.pathname ?? '/'

    if (session && profile) return <Navigate to={from} replace />
    if (loading) return <PageLoader />

    const submit = async (e) => {
        e.preventDefault()
        if (busy) return
        if (Date.now() < lockedUntil) {
            setError('Espera unos segundos antes de intentar otra vez.')
            return
        }
        setBusy(true)
        setError('')
        const res = await signIn(username, password)
        setBusy(false)
        if (res.ok) return // la redirección ocurre sola al cargar la sesión
        const n = fails + 1
        setError(res.message)
        setPassword('')
        if (n >= 5) {
            setLockedUntil(Date.now() + 30000)
            setFails(0)
        } else {
            setFails(n)
        }
    }

    const field =
        'w-full rounded-2xl border-2 border-kw-sky-deep/40 bg-white py-3 pl-11 pr-4 text-base outline-none transition focus:border-kw-pink'

    return (
        <>
            <Background />
            <main className="relative grid min-h-dvh place-items-center px-4 py-10">
                <Sparkle className="absolute left-[12%] top-[14%] size-6 animate-twinkle text-kw-butter-deep" />
                <Sparkle className="absolute right-[14%] top-[22%] size-8 animate-twinkle text-kw-pink [animation-delay:0.8s]" />

                <motion.form
                    onSubmit={submit}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 16 }}
                    className="relative w-full max-w-sm rounded-4xl border-2 border-dashed border-kw-pink/70 bg-white/90 p-6 pt-20 text-center shadow-2xl backdrop-blur-md"
                >
                    <Sticker
                        name="characters/cinnamoroll"
                        float
                        className="absolute -top-16 left-1/2 w-32 -translate-x-1/2"
                    />
                    <h1 className="font-title text-4xl">Entrar</h1>
                    <p className="mt-1 text-sm font-semibold text-kw-ink/70">Un lugar solo para nosotros dos</p>

                    <div className="relative mt-5">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-kw-ink/50" />
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="Usuario"
                            aria-label="Usuario"
                            className={field}
                        />
                    </div>

                    <div className="relative mt-3">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-kw-ink/50" />
                        <input
                            type={show ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="Contraseña"
                            aria-label="Contraseña"
                            className={`${field} pr-12`}
                        />
                        <button
                            type="button"
                            onClick={() => setShow((s) => !s)}
                            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-kw-ink/60 transition active:scale-90"
                        >
                            {show ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {error && (
                        <motion.p
                            key={error + fails}
                            animate={{ x: [0, -8, 8, -5, 5, 0] }}
                            className="mt-3 text-sm font-bold text-rose-500"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={busy || !username || !password}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-kw-pink px-6 py-3.5 text-lg font-extrabold text-white shadow-lg shadow-pink-300/60 disabled:opacity-50"
                    >
                        <FiHeart className={busy ? 'animate-heartbeat' : ''} />
                        {busy ? 'Entrando...' : 'Entrar'}
                    </motion.button>
                </motion.form>
            </main>
        </>
    )
}