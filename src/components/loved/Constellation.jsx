import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiShuffle } from 'react-icons/fi'
import useMedia from '../../hooks/useMedia'
import { lemniscate } from '../../utils/lemniscate'
import { heartBurst } from '../../utils/confettiHearts'

const SPARK = 'M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z'

function StarNode({ x, y, size, index, selected, seen, onPick }) {
    const color = selected ? '#ffffff' : seen ? '#ffb3d1' : '#fff3b8'

    return (
        <g
            transform={`translate(${x} ${y})`}
            role="button"
            tabIndex={0}
            aria-label={`Razón ${index + 1}`}
            className="cursor-pointer"
            onClick={(e) => onPick(index, e)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onPick(index)
            }}
        >
            <circle r="22" fill="transparent" />
            <circle r={size * 2.6} fill={color} opacity={selected ? 0.35 : 0.14} />
            {selected && (
                <motion.circle
                    r={size * 2}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 2.4, opacity: 0 }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                />
            )}
            <g transform={`scale(${(selected ? size * 1.5 : size) / 12})`}>
                <g
                    className="animate-twinkle"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${(index % 7) * 0.4}s` }}
                >
                    <path d={SPARK} transform="translate(-12 -12)" fill={color} />
                </g>
            </g>
        </g>
    )
}

function Ctrl({ onClick, label, children, className = '' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 active:scale-95 ${className}`}
        >
            {children}
        </button>
    )
}

export default function Constellation({ reasons }) {
    const wide = useMedia('(min-width: 768px)')
    const w = wide ? 1000 : 400
    const h = wide ? 440 : 720
    const stretch = wide ? 1.3 : 1.7

    const curve = useMemo(
        () => lemniscate({ width: w, height: h, vertical: !wide, stretch }),
        [w, h, wide, stretch]
    )
    const stars = useMemo(
        () =>
            reasons.map((_, i) => ({
                ...curve.at((i + 0.37) / reasons.length),
                size: 5 + ((i * 7) % 5),
            })),
        [curve, reasons]
    )

    const [sel, setSel] = useState(null)
    const [seen, setSeen] = useState(() => new Set())
    const [tour, setTour] = useState(false)

    useEffect(() => {
        if (sel === null) return
        setSeen((prev) => (prev.has(sel) ? prev : new Set(prev).add(sel)))
    }, [sel])

    useEffect(() => {
        if (!tour) return
        const id = setInterval(() => setSel((s) => (s === null ? 0 : (s + 1) % reasons.length)), 3800)
        return () => clearInterval(id)
    }, [tour, reasons.length])

    const pick = (i, e) => {
        setSel(i)
        setTour(false)
        if (e?.clientX != null) {
            heartBurst({
                particleCount: 8,
                spread: 40,
                startVelocity: 14,
                scalar: 0.9,
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            })
        }
    }

    const go = (d) => {
        setTour(false)
        setSel((s) => (s === null ? 0 : (s + d + reasons.length) % reasons.length))
    }

    const random = () => {
        setTour(false)
        let n = Math.floor(Math.random() * reasons.length)
        if (reasons.length > 1 && n === sel) n = (n + 1) % reasons.length
        setSel(n)
    }

    const all = seen.size === reasons.length

    return (
        <section className="mt-16 text-center">
            <h2 className="font-title text-3xl sm:text-4xl">Cada estrella es una razón</h2>
            <p className="mt-1 text-indigo-100/80">Toca una estrella del infinito</p>

            <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto mt-4 w-full max-w-sm md:max-w-4xl">
                <defs>
                    <linearGradient id="conGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
                        <stop offset="0" stopColor="#ffc2da" />
                        <stop offset="0.5" stopColor="#ffe27a" />
                        <stop offset="1" stopColor="#9ad7ff" />
                    </linearGradient>
                </defs>
                <path
                    d={curve.path}
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2"
                    strokeDasharray="2 10"
                    strokeLinecap="round"
                />
                <motion.path
                    d={curve.path}
                    fill="none"
                    stroke="url(#conGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.55"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 2.6, ease: 'easeInOut' }}
                />
                {stars.map((s, i) => (
                    <StarNode
                        key={i}
                        x={s.x}
                        y={s.y}
                        size={s.size}
                        index={i}
                        selected={sel === i}
                        seen={seen.has(i)}
                        onPick={pick}
                    />
                ))}
            </svg>

            <div className="mx-auto mt-4 max-w-xl rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                <div className="grid min-h-28 place-items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={sel ?? 'none'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            {sel === null ? (
                                <p className="font-title text-2xl text-indigo-100/90">Elige una estrella para descubrirla</p>
                            ) : (
                                <>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-amber-200">
                                        Razón {sel + 1}
                                    </p>
                                    <p className="mt-2 font-title text-[clamp(1.6rem,5vw,2.2rem)] leading-snug">
                                        {reasons[sel]}
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <Ctrl onClick={() => go(-1)} label="Anterior" className="px-3">
                        <FiChevronLeft />
                    </Ctrl>
                    <Ctrl onClick={() => setTour((t) => !t)} label="Recorrido automático">
                        {tour ? <FiPause /> : <FiPlay />} {tour ? 'Pausar' : 'Recorrido'}
                    </Ctrl>
                    <Ctrl onClick={random} label="Razón al azar">
                        <FiShuffle /> Al azar
                    </Ctrl>
                    <Ctrl onClick={() => go(1)} label="Siguiente" className="px-3">
                        <FiChevronRight />
                    </Ctrl>
                </div>

                <p className="mt-4 text-sm font-bold text-indigo-100/80">
                    Descubiertas {seen.size} de {reasons.length}
                    {all && ' · y aun así hay más'}
                </p>
                <div className="mx-auto mt-2 h-2 max-w-xs overflow-hidden rounded-full bg-white/15">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-pink-300 via-amber-200 to-sky-300 transition-all duration-500"
                        style={{ width: `${(seen.size / reasons.length) * 100}%` }}
                    />
                </div>
            </div>
        </section>
    )
}