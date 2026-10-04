import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { FiEye } from 'react-icons/fi'
import GameShell from '../components/games/GameShell'
import GameSide from '../components/games/GameSide'
import GameOverlay, { PrimaryButton } from '../components/games/GameOverlay'
import ButtonLink from '../components/ui/ButtonLink'
import Sticker from '../components/ui/Sticker'
import { Sprite } from './icons'
import Decor from './decor'
import { SCENES, flanPos } from '../data/flanScenes'
import { markCompleted } from '../utils/progress'
import { sfx } from '../utils/sfx'
import { GAMES } from '../data/games'

const HINTS = 3
const GAME = GAMES.find((x) => x.id === 'pompompurin')
const CHEERS = ['¡Lo encontraste!', '¡Qué ojo!', '¡Otro más!', '¡Delicioso!', '¡Genial!']

export default function PompompurinGame() {
    const [level, setLevel] = useState(0)
    const [found, setFound] = useState([])
    const [timeLeft, setTimeLeft] = useState(SCENES[0].time)
    const [hints, setHints] = useState(HINTS)
    const [hint, setHint] = useState(null)
    const [phase, setPhase] = useState('ready')
    const [ripples, setRipples] = useState([])
    const [cheer, setCheer] = useState(null)
    const cheerTimer = useRef(null)
    const scene = SCENES[level]

    const begin = (lvl) => {
        setLevel(lvl)
        setFound([])
        setTimeLeft(SCENES[lvl].time)
        setHints(HINTS)
        setHint(null)
        setRipples([])
        setCheer(null)
        setPhase('playing')
    }

    useEffect(() => {
        if (phase !== 'playing') return
        const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
        return () => clearInterval(id)
    }, [phase])

    useEffect(() => {
        if (phase === 'playing' && timeLeft <= 0) {
            sfx.lose()
            setPhase('lost')
        }
    }, [timeLeft, phase])

    useEffect(() => () => clearTimeout(cheerTimer.current), [])

    const onFind = (i) => {
        if (phase !== 'playing' || found.includes(i)) return
        const next = [...found, i]
        setFound(next)
        setHint(null)
        sfx.find()
        navigator.vibrate?.(15)
        setCheer(CHEERS[next.length % CHEERS.length])
        clearTimeout(cheerTimer.current)
        cheerTimer.current = setTimeout(() => setCheer(null), 1600)

        if (next.length === scene.flans.length) {
            if (level < SCENES.length - 1) {
                sfx.win()
                setPhase('levelup')
            } else {
                markCompleted('pompompurin')
                sfx.win()
                confetti({
                    particleCount: 120,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ['#ffd966', '#ff8fb8', '#ffffff', '#8b5a2b'],
                    disableForReducedMotion: true,
                })
                setPhase('won')
            }
        }
    }

    const askHint = () => {
        if (hints <= 0 || phase !== 'playing') return
        const i = scene.flans.findIndex((_, idx) => !found.includes(idx))
        if (i === -1) return
        setHints((h) => h - 1)
        setHint(i)
        setTimeout(() => setHint(null), 1800)
    }

    const onScene = (e) => {
        if (phase !== 'playing' || e.target.closest('[data-flan]')) return
        const r = e.currentTarget.getBoundingClientRect()
        const id = Date.now() + Math.random()
        setRipples((rs) => [...rs.slice(-5), { id, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }])
        setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 650)
        sfx.miss()
    }

    const views = {
        ready: {
            image: 'characters/pompompurin',
            title: 'Flanes escondidos',
            text: 'Pompompurin escondió sus flanes. Encuéntralos todos antes de que se acabe el tiempo. Tienes 3 pistas por escena.',
            label: 'Empezar',
            onClick: () => begin(0),
        },
        levelup: {
            icon: <Sprite name="flan" className="size-16" />,
            title: `¡Escena ${level + 1} completada!`,
            text: 'Vamos con la siguiente: hay más flanes escondidos.',
            label: 'Siguiente escena',
            onClick: () => begin(level + 1),
        },
        lost: {
            icon: <Sprite name="heart" className="size-14" />,
            title: '¡Se acabó el tiempo!',
            text: 'Los flanes se escondieron mejor. ¡Intenta otra vez!',
            label: `Reintentar escena ${level + 1}`,
            onClick: () => begin(level),
        },
        won: {
            icon: <Sprite name="flan" className="size-20" />,
            title: '¡Encontraste todos!',
            text: GAME.reward,
            label: 'Jugar otra vez',
            onClick: () => begin(0),
        },
    }
    const view = views[phase]

    const hud = (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-2xl bg-white/85 p-3 text-sm font-bold shadow">
            <span>
                Escena {level + 1}/{SCENES.length}
            </span>
            <div className="flex justify-center gap-1">
                {scene.flans.map((_, i) => (
                    <motion.span
                        key={`${level}-${i}`}
                        animate={found.includes(i) ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                        className={`transition ${found.includes(i) ? '' : 'opacity-35 grayscale'}`}
                    >
                        <Sprite name="flan" className="size-6" />
                    </motion.span>
                ))}
            </div>
            <span className={timeLeft <= 10 ? 'text-rose-500' : ''}>{timeLeft}s</span>
        </div>
    )

    return (
        <GameShell
            title="Flanes escondidos"
            subtitle={scene.title}
            hud={hud}
            side={
                <GameSide
                    image="characters/pompompurin"
                    steps={[
                        'Busca los flanes que asoman detrás de los dibujos.',
                        'Tócalos para encontrarlos: pasan al frente.',
                        'Encuentra todos antes de que se acabe el tiempo.',
                        'Si te atoras, usa una pista (tienes 3 por escena).',
                    ]}
                    tip="Fíjate en los bordes y debajo de los dibujos grandes."
                />
            }
        >
            <div
                onPointerDown={onScene}
                className={`relative aspect-[3/4] w-full touch-manipulation select-none overflow-hidden rounded-3xl border-4 border-white bg-linear-to-b shadow-xl [container-type:inline-size] ${scene.bg}`}
            >
                <div aria-hidden className={`absolute inset-x-0 bottom-0 h-[16%] ${scene.ground}`} />

                {scene.decor.map((dc, i) => (
                    <div
                        key={`${level}-d${i}`}
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${dc.x}%`, top: `${dc.y}%`, width: `${dc.size}cqw`, height: `${dc.size}cqw` }}
                    >
                        <Decor t={dc.t} />
                    </div>
                ))}

                {scene.flans.map((fl, i) => {
                    const pos = flanPos(scene, fl)
                    const isFound = found.includes(i)
                    return (
                        <button
                            key={`${level}-f${i}`}
                            data-flan
                            type="button"
                            aria-label="Flan escondido"
                            onClick={() => onFind(i)}
                            disabled={phase !== 'playing'}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 ${isFound ? 'z-30' : 'z-10'}`}
                            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: '13cqw', height: '13cqw' }}
                        >
                            <motion.span
                                className="block size-full"
                                animate={isFound ? { scale: [1, 1.5, 1.15], rotate: [0, 14, -8, 0] } : { scale: 1 }}
                            >
                                <Sprite name="flan" className="size-full drop-shadow-md" />
                            </motion.span>
                            {isFound && (
                                <motion.span
                                    aria-hidden
                                    initial={{ scale: 0.5, opacity: 0.9 }}
                                    animate={{ scale: 2.4, opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0 rounded-full border-4 border-kw-butter-deep"
                                />
                            )}
                            {hint === i && (
                                <span className="absolute inset-0 animate-ping rounded-full border-4 border-kw-pink" />
                            )}
                        </button>
                    )
                })}

                {ripples.map((r) => (
                    <motion.span
                        key={r.id}
                        aria-hidden
                        initial={{ scale: 0.2, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white"
                        style={{ left: `${r.x}%`, top: `${r.y}%`, width: '14cqw', height: '14cqw' }}
                    />
                ))}

                <div className="pointer-events-none absolute right-2 top-2 z-30 w-[16cqw]">
                    <AnimatePresence>
                        {cheer && (
                            <motion.p
                                key={cheer}
                                initial={{ opacity: 0, scale: 0.6, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute right-0 top-0 w-max max-w-[34cqw] -translate-y-full rounded-2xl bg-white px-3 py-1.5 text-center font-title text-lg leading-tight shadow-lg"
                            >
                                {cheer}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <motion.div
                        animate={cheer ? { y: [0, -10, 0], rotate: [0, -6, 6, 0] } : { y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sticker name="characters/pompompurin" />
                    </motion.div>
                </div>
            </div>

            <div className="mt-3 text-center">
                <motion.button
                    type="button"
                    onClick={askHint}
                    disabled={hints <= 0 || phase !== 'playing'}
                    whileTap={{ scale: 0.94 }}
                    className="inline-flex items-center gap-2 rounded-full bg-kw-butter-deep px-6 py-2.5 font-bold text-amber-900 shadow-lg disabled:opacity-50"
                >
                    <FiEye /> Pista ({hints})
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {view && (
                    <GameOverlay key={phase} image={view.image} icon={view.icon} title={view.title} text={view.text}>
                        <PrimaryButton onClick={view.onClick}>{view.label}</PrimaryButton>
                        {phase === 'won' && <ButtonLink to="/juegos" variant="butter">Volver a los juegos</ButtonLink>}
                    </GameOverlay>
                )}
            </AnimatePresence>
        </GameShell>
    )
}