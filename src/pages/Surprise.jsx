import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import GiftBox from '../components/surprise/GiftBox'
import LockedView from '../components/surprise/LockedView'
import Orbit from '../components/surprise/Orbit'
import RevealView from '../components/surprise/RevealView'
import Celebration from '../components/surprise/Celebration'
import PageLoader from '../components/ui/PageLoader'
import useProgress from '../hooks/useProgress'
import { GAMES } from '../data/games'
import { fetchSettings, openGift } from '../lib/content'
import { heartBurst, starBurst } from '../utils/confettiHearts'

const NEEDED = 3
const HINTS = ['Toca el regalo para abrirlo', 'Algo se mueve...', 'Ya casi...', 'Ahí viene...']
const ALL_DONE = Object.fromEntries(GAMES.map((g) => [g.id, true]))

const fade = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
}

function SurpriseFlow({ completed, giftOpened, requireGames, force }) {
    const unlocked = !requireGames || force || GAMES.every((g) => completed[g.id])

    const [stage, setStage] = useState(() =>
        !unlocked ? 'locked' : giftOpened ? 'reveal' : 'unlock'
    ) // locked | unlock | gift | reveal
    const [taps, setTaps] = useState(0)
    const [opening, setOpening] = useState(false)
    const [flash, setFlash] = useState(false)
    const timer = useRef(null)

    useEffect(() => {
        if (stage !== 'unlock') return
        const t1 = setTimeout(() => starBurst({ particleCount: 60, spread: 100, origin: { y: 0.55 } }), 1500)
        const t2 = setTimeout(() => setStage('gift'), 2800)
        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }
    }, [stage])

    useEffect(() => () => clearTimeout(timer.current), [])

    const onTap = () => {
        if (opening) return
        const next = taps + 1
        setTaps(next)
        navigator.vibrate?.(next >= NEEDED ? [40, 30, 90] : 25)
        heartBurst({ particleCount: 12 + next * 6, spread: 60, startVelocity: 25, origin: { y: 0.55 } })
        starBurst({ particleCount: 8 + next * 6, spread: 70, startVelocity: 22, origin: { y: 0.55 } })

        if (next >= NEEDED) {
            setOpening(true)
            setFlash(true)
            openGift().catch(() => { })
            setTimeout(() => {
                heartBurst({ particleCount: 140, spread: 130, startVelocity: 50, origin: { y: 0.55 } })
                starBurst({ particleCount: 100, spread: 130, startVelocity: 45, origin: { y: 0.55 } })
            }, 350)
            timer.current = setTimeout(() => setStage('reveal'), 1500)
        }
    }

    const replay = () => {
        setTaps(0)
        setOpening(false)
        setStage('gift')
    }

    const magic = stage === 'gift' || stage === 'reveal'

    return (
        <>
            {magic && <Celebration />}

            <section className="mx-auto max-w-3xl px-4 pb-10 pt-8 text-center sm:pt-12">
                <AnimatePresence mode="wait">
                    {stage === 'locked' && (
                        <motion.div key="locked" {...fade}>
                            <LockedView games={GAMES} completed={completed} />
                        </motion.div>
                    )}

                    {stage === 'unlock' && (
                        <motion.div key="unlock" {...fade}>
                            <h1 className="font-title text-4xl sm:text-5xl">¡Lo lograste!</h1>
                            <p className="mt-1 font-semibold text-kw-ink/80">Completaste todos los juegos</p>
                            <div className="mt-6">
                                <Orbit games={GAMES} completed={ALL_DONE} unlocking />
                            </div>
                        </motion.div>
                    )}

                    {stage === 'gift' && (
                        <motion.div key="gift" {...fade}>
                            <h1 className="font-title text-4xl sm:text-5xl">Sorpresa final</h1>
                            <p className="mt-1 font-semibold text-kw-ink/80">Es tu momento. Ábrelo.</p>

                            <div className="mt-8">
                                <GiftBox taps={taps} needed={NEEDED} opened={opening} onTap={onTap} />
                            </div>

                            <div className="mt-6 flex justify-center gap-2">
                                {Array.from({ length: NEEDED }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`size-3 rounded-full transition-colors ${i < taps ? 'bg-kw-pink' : 'bg-white/80'}`}
                                    />
                                ))}
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={taps}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3 font-title text-2xl"
                                >
                                    {HINTS[Math.min(taps, HINTS.length - 1)]}
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {stage === 'reveal' && (
                        <motion.div key="reveal" {...fade}>
                            <RevealView onReplay={replay} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <AnimatePresence>
                {flash && (
                    <motion.div
                        key="flash"
                        aria-hidden
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.1, times: [0, 0.35, 1] }}
                        onAnimationComplete={() => setFlash(false)}
                        className="pointer-events-none fixed inset-0 z-[90] bg-white"
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default function Surprise() {
    const { search } = useLocation()
    const progress = useProgress()
    const settings = useQuery({ queryKey: ['settings'], queryFn: fetchSettings })
    // En desarrollo, ?abrir salta el bloqueo visual (la base igual protege los datos)
    const force = import.meta.env.DEV && new URLSearchParams(search).has('abrir')

    if (progress.isPending || settings.isPending) return <PageLoader />

    const requireGames = settings.data?.require_games ?? true
    const unlocked = !requireGames || force || GAMES.every((g) => progress.completed[g.id])

    return (
        <SurpriseFlow
            key={unlocked ? 'open' : 'locked'}
            completed={progress.completed}
            giftOpened={progress.giftOpened}
            requireGames={requireGames}
            force={force}
        />
    )
}