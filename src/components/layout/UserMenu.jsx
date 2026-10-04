import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiEdit3, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function UserMenu() {
    const { profile, signOut } = useAuth()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        const onDown = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false)
        }
        const onKey = (e) => e.key === 'Escape' && setOpen(false)
        document.addEventListener('pointerdown', onDown)
        window.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onDown)
            window.removeEventListener('keydown', onKey)
        }
    }, [open])

    if (!profile) return null

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Menú de tu cuenta"
                className="grid size-10 place-items-center rounded-full bg-linear-to-br from-kw-pink to-kw-butter-deep font-title text-lg text-white shadow transition active:scale-90"
            >
                {profile.display_name.slice(0, 1).toUpperCase()}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        className="absolute right-0 top-12 z-50 w-56 origin-top-right rounded-3xl border-2 border-white/80 bg-white/95 p-2 shadow-2xl backdrop-blur-md"
                    >
                        <p className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-kw-ink/50">
                            Sesión de {profile.display_name}
                        </p>
                        <Link
                            to="/panel"
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold transition hover:bg-kw-pink-soft"
                        >
                            <FiEdit3 /> Editar contenido
                        </Link>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={signOut}
                            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-bold transition hover:bg-kw-pink-soft"
                        >
                            <FiLogOut /> Cerrar sesión
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}