import { motion, useAnimationControls, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import Sticker from '../ui/Sticker'
import Sparkle from '../ui/Sparkle'
import WaxSeal from './WaxSeal'
import Stamp from './Stamp'
import { COUPLE } from '../../data/config'
import { formatDate } from '../../utils/formatDate'

const THEMES = {
    pink: { back: 'bg-pink-200', front: 'from-pink-200 to-pink-300', flap: 'from-pink-300 to-pink-400' },
    blue: { back: 'bg-sky-200', front: 'from-sky-200 to-sky-300', flap: 'from-sky-300 to-sky-400' },
    butter: { back: 'bg-amber-100', front: 'from-amber-100 to-amber-200', flap: 'from-amber-200 to-amber-300' },
}

const HALVES = [
    { clip: 'inset(0 50% 0 0)', to: { x: -34, y: 46, rotate: -28, opacity: 0 } },
    { clip: 'inset(0 0 0 50%)', to: { x: 34, y: 46, rotate: 28, opacity: 0 } },
]

export default function Envelope({ letter, opening, locked, onOpen }) {
    const tone = THEMES[letter.tone] ? letter.tone : 'pink'
    const theme = THEMES[tone]
    const shake = useAnimationControls()

    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 16 })
    const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 16 })

    const onMove = (e) => {
        if (e.pointerType !== 'mouse' || opening) return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
    }
    const onLeave = () => {
        mx.set(0)
        my.set(0)
    }

    const handle = () => {
        if (opening) return
        if (locked) {
            shake.start({ x: [0, -10, 10, -8, 8, 0], transition: { duration: 0.45 } })
            return
        }
        onOpen()
    }

    const idle = !opening && !locked

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9, transition: { duration: 0.5 } }}
            className="relative mx-auto mt-6 w-[min(88vw,26rem)] pt-20"
        >
            <Sparkle className="absolute left-0 top-24 size-5 animate-twinkle text-kw-butter-deep" />
            <Sparkle className="absolute right-1 top-32 size-6 animate-twinkle text-kw-pink [animation-delay:1s]" />
            <Sparkle className="absolute -bottom-2 left-6 size-4 animate-twinkle text-kw-sky-deep [animation-delay:1.6s]" />

            <motion.div
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                style={{ rotateX, rotateY, transformPerspective: 1000 }}
            >
                <motion.div animate={shake}>
                    <motion.button
                        type="button"
                        onClick={handle}
                        aria-label={locked ? 'Carta bloqueada' : 'Abrir la carta'}
                        animate={idle ? { y: [0, -8, 0], rotate: [-1, 1, -1] } : { y: 0, rotate: 0 }}
                        transition={idle ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                        className={`relative block aspect-[4/3] w-full cursor-pointer ${locked ? 'saturate-50' : ''}`}
                        style={{ perspective: 1000 }}
                    >
                        {/* fondo */}
                        <span className={`absolute inset-0 rounded-2xl shadow-xl shadow-pink-300/50 ${theme.back}`} />

                        {/* papel dentro del sobre */}
                        <motion.span
                            className="absolute inset-x-4 bottom-3 top-3 z-10 rounded-lg bg-white shadow-md"
                            animate={{ y: opening ? '-38%' : 0 }}
                            transition={{ delay: opening ? 0.95 : 0, duration: 0.8, ease: 'easeOut' }}
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(to bottom, transparent 0, transparent 17px, #ffd9e6 17px, #ffd9e6 18px)',
                            }}
                        >
                            <span className="block p-3 text-left font-title text-lg text-kw-ink/60">{letter.label}</span>
                        </motion.span>

                        {/* frente */}
                        <span
                            className={`absolute inset-0 z-20 rounded-2xl bg-linear-to-br ${theme.front}`}
                            style={{ clipPath: 'polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)' }}
                        />

                        {/* dirección y estampilla */}
                        <span className="absolute inset-x-0 bottom-[13%] z-[25] text-center font-title text-xl text-kw-ink/80 sm:text-2xl">
                            Para {COUPLE.her.name}
                        </span>
                        <span className="absolute inset-x-0 bottom-[5%] z-[25] text-center text-[10px] font-extrabold uppercase tracking-[0.25em] text-kw-ink/40">
                            {letter.label}
                        </span>
                        <Stamp className="absolute right-[6%] top-[17%] z-[25] w-[15%] rotate-3" />

                        {/* solapa */}
                        <motion.span
                            className={`absolute inset-x-0 top-0 h-[55%] bg-linear-to-b ${theme.flap}`}
                            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformOrigin: 'top' }}
                            animate={{ rotateX: opening ? 180 : 0, zIndex: opening ? 5 : 30 }}
                            transition={{
                                rotateX: { duration: 0.7, ease: 'easeInOut', delay: opening ? 0.25 : 0 },
                                zIndex: { delay: opening ? 0.6 : 0, duration: 0 },
                            }}
                        />

                        {/* sello de cera: se parte en dos al abrir */}
                        <span className="absolute left-1/2 top-[52%] z-40 size-16 -translate-x-1/2 -translate-y-1/2 sm:size-20">
                            {HALVES.map((h) => (
                                <motion.span
                                    key={h.clip}
                                    className="absolute inset-0"
                                    style={{ clipPath: h.clip }}
                                    animate={opening ? h.to : { scale: [1, 1.08, 1] }}
                                    transition={
                                        opening
                                            ? { duration: 0.55, ease: 'easeIn' }
                                            : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                                    }
                                >
                                    <WaxSeal tone={tone} className="size-full drop-shadow-lg" />
                                </motion.span>
                            ))}
                            {locked && (
                                <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-white text-kw-ink shadow">
                                    <FiLock />
                                </span>
                            )}
                        </span>

                        <Sticker
                            name="characters/pompompurin"
                            float
                            className="absolute -bottom-6 -left-5 z-50 w-16 sm:-left-12 sm:w-20"
                        />
                        <Sticker
                            name="characters/cinnamoroll"
                            float
                            delay={1}
                            className="absolute -bottom-6 -right-5 z-50 w-16 sm:-right-12 sm:w-20"
                        />
                    </motion.button>
                </motion.div>
            </motion.div>

            <span aria-hidden className="mx-auto mt-5 block h-3 w-3/4 rounded-full bg-black/10 blur-md" />

            <motion.p
                animate={{ opacity: opening ? 0 : [0.55, 1, 0.55] }}
                transition={opening ? { duration: 0.2 } : { duration: 2.5, repeat: Infinity }}
                className="mt-7 font-title text-xl"
            >
                {locked
                    ? `Se abre el ${formatDate(letter.unlockAt.slice(0, 10))}`
                    : 'Toca el sobre para abrirlo'}
            </motion.p>
        </motion.div>
    )
}