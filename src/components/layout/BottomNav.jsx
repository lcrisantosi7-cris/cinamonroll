import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
    FiGrid, FiLock, FiPause, FiPlay, FiSkipBack, FiSkipForward, FiX,
} from 'react-icons/fi'
import { NAV } from '../../data/config'
import { GAMES } from '../../data/games'
import { getProgress } from '../../utils/progress'
import { usePlayer } from '../../context/AudioContext'
import AssetIcon from '../ui/AssetIcon'

const TONES = {
    pink: 'from-pink-50 to-pink-200 border-pink-200 text-pink-500',
    sky: 'from-sky-50 to-sky-200 border-sky-200 text-sky-500',
    rose: 'from-rose-50 to-rose-200 border-rose-200 text-rose-500',
    blue: 'from-blue-50 to-blue-200 border-blue-200 text-blue-500',
    purple: 'from-purple-50 to-purple-200 border-purple-200 text-purple-500',
}

const status = () => {
    const p = getProgress()
    const done = GAMES.every((g) => p.completed[g.id])
    return { locked: !done, ready: done && !p.opened }
}

function MoreTile({ item, locked }) {
    const Icon = item.icon
    return (
        <li>
            <NavLink
                to={item.to}
                className="flex flex-col items-center gap-1.5 rounded-2xl p-2 text-center transition active:scale-95"
            >
                <span
                    className={`relative grid size-14 place-items-center rounded-2xl border-2 bg-linear-to-br shadow-md ${TONES[item.tone] ?? TONES.pink
                        }`}
                >
                    <AssetIcon name={item.asset} fallback={Icon} className="text-2xl" imgClassName="size-9 object-contain" />
                    {locked && (
                        <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-white text-[10px] text-kw-ink shadow">
                            <FiLock />
                        </span>
                    )}
                </span>
                <span className="text-[11px] font-bold leading-tight">{item.label}</span>
            </NavLink>
        </li>
    )
}

function MiniPlayer() {
    const player = usePlayer()
    if (!player?.has) return null
    const { track, playing, progress, toggle, next, prev } = player

    return (
        <div className="mt-3 rounded-3xl bg-kw-pink-soft/70 p-3">
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-kw-ink/60">Nuestra canción</p>
                    <p className="truncate font-title text-lg leading-tight">{track.title}</p>
                </div>
                <button type="button" onClick={prev} aria-label="Anterior" className="grid size-9 place-items-center rounded-full text-kw-ink/70 active:scale-90">
                    <FiSkipBack />
                </button>
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={playing ? 'Pausar' : 'Reproducir'}
                    className="grid size-11 place-items-center rounded-full bg-kw-pink text-lg text-white shadow-lg active:scale-90"
                >
                    {playing ? <FiPause /> : <FiPlay className="translate-x-px" />}
                </button>
                <button type="button" onClick={next} aria-label="Siguiente" className="grid size-9 place-items-center rounded-full text-kw-ink/70 active:scale-90">
                    <FiSkipForward />
                </button>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-kw-pink transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
        </div>
    )
}

export default function BottomNav() {
    const { pathname } = useLocation()
    const [open, setOpen] = useState(false)
    const [state, setState] = useState(status)

    const bar = NAV.filter((n) => n.bar)
    const more = NAV.filter((n) => !n.bar)
    const moreActive = more.some((n) => pathname.startsWith(n.to))

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    useEffect(() => {
        if (!open) return
        setState(status())
        const onKey = (e) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const pill = (id) => (
        <motion.span
            layoutId="bottom-pill"
            className="absolute inset-0 rounded-full bg-kw-pink-soft"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            key={id}
        />
    )

    return (
        <>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.button
                            key="scrim"
                            type="button"
                            aria-label="Cerrar"
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[44] bg-kw-ink/35 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            key="sheet"
                            role="dialog"
                            aria-label="Más secciones"
                            initial={{ y: 40, opacity: 0, scale: 0.96 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 40, opacity: 0, scale: 0.96 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.6 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 70) setOpen(false)
                            }}
                            className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[45] rounded-4xl border-2 border-white/80 bg-white/95 p-4 shadow-2xl backdrop-blur-md lg:hidden"
                        >
                            <span aria-hidden className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-kw-ink/20" />
                            <ul className="grid grid-cols-4 gap-1">
                                {more.map((item) => (
                                    <MoreTile key={item.to} item={item} locked={item.to === '/sorpresa' && state.locked} />
                                ))}
                            </ul>
                            <MiniPlayer />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <nav
                aria-label="Navegación principal"
                className="fixed inset-x-3 bottom-3 z-[46] pb-[env(safe-area-inset-bottom)] lg:hidden"
            >
                <ul className="flex items-center justify-around rounded-full border-2 border-white/80 bg-white/85 p-1.5 shadow-xl shadow-sky-300/40 backdrop-blur-md">
                    {bar.map(({ to, label, icon: Icon }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={to === '/'}
                                className={({ isActive }) =>
                                    `relative flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition-colors ${isActive ? 'text-kw-pink-deep' : 'text-kw-ink/70'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && pill(to)}
                                        <motion.span whileTap={{ scale: 0.8 }} className="relative z-10 flex flex-col items-center gap-0.5">
                                            <Icon className="text-lg" />
                                            {label}
                                        </motion.span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}

                    <li>
                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            aria-label="Más secciones"
                            className={`relative flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition-colors ${moreActive || open ? 'text-kw-pink-deep' : 'text-kw-ink/70'
                                }`}
                        >
                            {moreActive && pill('more')}
                            <motion.span whileTap={{ scale: 0.8 }} className="relative z-10 flex flex-col items-center gap-0.5">
                                <motion.span animate={{ rotate: open ? 90 : 0 }} className="text-lg">
                                    {open ? <FiX /> : <FiGrid />}
                                </motion.span>
                                Más
                            </motion.span>
                            {state.ready && !open && (
                                <span aria-hidden className="absolute right-2 top-0.5 z-10 grid size-3 place-items-center">
                                    <span className="absolute size-3 animate-ping rounded-full bg-kw-pink" />
                                    <span className="relative size-2 rounded-full bg-kw-pink-deep" />
                                </span>
                            )}
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    )
}