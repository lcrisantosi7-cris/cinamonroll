import { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import PageLoader from '../components/ui/PageLoader'
import Sparkle from '../components/ui/Sparkle'
import Sticker from '../components/ui/Sticker'
import { Papa, Camote } from '../components/ui/Mascots'
import { fetchMessages } from '../lib/content'
import { heartBurst } from '../utils/confettiHearts'

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

// Cada mensaje sale en un papelito de color distinto
const TONES = [
    { paper: 'from-pink-50 to-kw-pink-soft border-kw-pink/70 shadow-pink-200/70', line: '#ffd9e6', washi: '#ffd1e3' },
    { paper: 'from-white to-sky-100 border-kw-sky-deep/60 shadow-sky-200/70', line: '#cfeaff', washi: '#cfeaff' },
    { paper: 'from-white to-kw-butter border-kw-butter-deep shadow-amber-200/70', line: '#ffe9a0', washi: '#fff1b8' },
]

export default function Messages() {
    const { data, isPending } = useQuery({ queryKey: ['messages'], queryFn: fetchMessages })
    const messages = useMemo(() => (data ?? []).map((m) => m.body), [data])
    const bag = useRef([])
    const [current, setCurrent] = useState(null)
    const [count, setCount] = useState(0)

    const draw = () => {
        if (!messages.length) return
        if (bag.current.length === 0) bag.current = shuffle(messages)
        setCurrent(bag.current.pop())
        setCount((c) => c + 1)
        heartBurst({ particleCount: 30, spread: 60, origin: { y: 0.6 }, scalar: 1 })
    }

    if (isPending) return <PageLoader />

    const tone = TONES[Math.max(count - 1, 0) % TONES.length]
    const tilt = count % 2 ? -1.5 : 1.5

    return (
        <section className="mx-auto max-w-xl px-4 pb-12 pt-8 text-center sm:pt-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-kw-pink-deep shadow-sm">
                <FiHeart className="fill-current" /> Para cuando lo necesites
            </span>

            <div className="relative mt-3 inline-block">
                <Sparkle className="absolute -left-8 -top-2 size-5 animate-twinkle text-kw-butter-deep" />
                <h1 className="font-title text-5xl leading-none sm:text-6xl">Mensajes sorpresa</h1>
                <Sparkle className="absolute -right-7 top-1 size-6 animate-twinkle text-kw-pink [animation-delay:1s]" />
            </div>
            <p className="mt-3 font-semibold text-kw-ink/80">Abre uno cuando necesites una sonrisa</p>

            <div className="mt-10 grid min-h-[20rem] place-items-center">
                <AnimatePresence mode="wait">
                    {current ? (
                        <motion.article
                            key={count}
                            initial={{ opacity: 0, y: 40, rotate: tilt * 3, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
                            exit={{ opacity: 0, y: -24, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 16, stiffness: 140 }}
                            className={`relative w-full max-w-md rounded-4xl border-2 border-dashed bg-linear-to-br px-7 pb-10 pt-12 shadow-xl ${tone.paper}`}
                        >
                            {/* cinta washi */}
                            <span
                                aria-hidden
                                className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 opacity-90 shadow-sm"
                                style={{
                                    backgroundImage: `repeating-linear-gradient(45deg, ${tone.washi} 0 8px, #ffffff 8px 16px)`,
                                }}
                            />
                            {/* renglones del papel */}
                            <span
                                aria-hidden
                                className="absolute inset-x-6 bottom-9 top-12 opacity-80"
                                style={{
                                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 35px, ${tone.line} 35px, ${tone.line} 36px)`,
                                }}
                            />
                            <span aria-hidden className="absolute left-5 top-3 font-title text-6xl leading-none text-kw-pink/40">
                                “
                            </span>

                            <p
                                className={`relative text-balance font-title leading-9 text-kw-ink ${current.length > 110 ? 'text-2xl' : 'text-3xl'}`}
                            >
                                {current}
                            </p>

                            <FiHeart aria-hidden className="absolute bottom-4 right-5 fill-current text-kw-pink/70" />
                            <Sparkle className="absolute -left-3 top-1/2 size-4 animate-twinkle text-kw-butter-deep" />
                            <Sparkle className="absolute -right-3 top-1/3 size-5 animate-twinkle text-kw-pink [animation-delay:1.2s]" />
                        </motion.article>
                    ) : (
                        <motion.button
                            key="closed"
                            type="button"
                            onClick={draw}
                            disabled={!messages.length}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Abrir un mensaje"
                            className="relative mx-auto block w-64 cursor-pointer pt-6 disabled:opacity-60 sm:w-72"
                        >
                            <span className="relative block">
                                <span aria-hidden className="absolute inset-0 -rotate-6 rounded-3xl bg-white/70 shadow" />
                                <span aria-hidden className="absolute inset-0 rotate-3 rounded-3xl bg-pink-100 shadow" />
                                <span className="relative grid aspect-[4/3] place-items-center rounded-3xl border-2 border-dashed border-kw-pink bg-linear-to-br from-pink-50 to-kw-pink-soft shadow-xl shadow-pink-200/60">
                                    <span className="grid place-items-center gap-3">
                                        <span className="grid size-16 animate-heartbeat place-items-center rounded-full bg-kw-pink text-3xl text-white shadow-lg shadow-pink-300/70">
                                            <FiHeart className="fill-current" />
                                        </span>
                                        <span className="font-title text-2xl text-kw-ink">Toca para abrir</span>
                                    </span>
                                </span>
                            </span>
                            <Sticker name="decor/bow" float className="absolute left-1/2 top-0 w-14 -translate-x-1/2" />
                            <Sparkle className="absolute -left-2 top-16 size-5 animate-twinkle text-kw-butter-deep" />
                            <Sparkle className="absolute -right-2 bottom-6 size-6 animate-twinkle text-kw-pink [animation-delay:1s]" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {current && (
                <motion.button
                    type="button"
                    onClick={draw}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    className="mt-10 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-kw-pink to-kw-pink-deep px-8 py-3.5 text-lg font-bold text-white shadow-lg shadow-pink-300/60 ring-4 ring-white/60"
                >
                    <FiHeart className="fill-current" /> Otro mensaje
                </motion.button>
            )}

            {messages.length === 0 && (
                <p className="mt-3 text-sm font-semibold text-kw-ink/60">Todavía no hay mensajes.</p>
            )}
            {count > 0 && (
                <p className="mt-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1 text-sm font-bold text-kw-ink/80 shadow-sm">
                        <FiHeart className="fill-current text-kw-pink" /> Mensajes abiertos: {count}
                    </span>
                </p>
            )}

            <div className="mt-10 flex items-end justify-center gap-3">
                <Papa className="w-20" />
                <Camote className="w-24" />
            </div>
        </section>
    )
}