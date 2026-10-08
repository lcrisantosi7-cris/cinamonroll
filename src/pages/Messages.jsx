import { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { FiGift, FiHeart } from 'react-icons/fi'
import Card from '../components/ui/Card'
import PageLoader from '../components/ui/PageLoader'
import { Papa, Camote } from '../components/ui/Mascots'
import { fetchMessages } from '../lib/content'
import { heartBurst } from '../utils/confettiHearts'

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

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

    return (
        <section className="mx-auto max-w-xl px-4 pb-10 pt-8 text-center sm:pt-12">
            <h1 className="font-title text-4xl">
                Mensajes sorpresa <FiHeart className="inline text-kw-pink" />
            </h1>
            <p className="mt-1 text-kw-ink/80">Abre uno cuando necesites una sonrisa</p>

            <div className="mt-8 min-h-56">
                <AnimatePresence mode="wait">
                    {current ? (
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, rotateX: -70, y: 20 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            style={{ perspective: 800 }}
                        >
                            <Card tone="pink" className="py-10">
                                <p className="font-title text-3xl leading-snug">{current}</p>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="gift"
                            animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="grid place-items-center pt-6"
                        >
                            <FiGift className="size-28 text-kw-pink" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.button
                type="button"
                onClick={draw}
                disabled={!messages.length}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-kw-pink px-8 py-3 text-lg font-bold text-white shadow-lg shadow-pink-300/60 disabled:opacity-50"
            >
                <FiHeart /> {current ? 'Otro mensaje' : 'Abrir mensaje'}
            </motion.button>

            {messages.length === 0 && (
                <p className="mt-3 text-sm font-semibold text-kw-ink/60">Todavía no hay mensajes.</p>
            )}
            {count > 0 && (
                <p className="mt-3 text-sm font-semibold text-kw-ink/70">Mensajes abiertos: {count}</p>
            )}

            <div className="mt-8 flex items-end justify-center gap-2">
                <Papa className="w-20" />
                <Camote className="w-24" />
            </div>
        </section>
    )
}