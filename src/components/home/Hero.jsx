import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import Sticker from '../ui/Sticker'
import Sparkle from '../ui/Sparkle'
import CloudCard from './CloudCard'
import Character from './Character'
import { COUPLE, PHRASES } from '../../data/config'

function Layer({ sx, sy, depth, className = '', children }) {
    const x = useTransform(sx, (v) => v * depth)
    const y = useTransform(sy, (v) => v * depth)
    return (
        <motion.div style={{ x, y }} className={className}>
            {children}
        </motion.div>
    )
}

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
}
const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 18 } },
}

export default function Hero() {
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const sx = useSpring(mx, { stiffness: 60, damping: 18 })
    const sy = useSpring(my, { stiffness: 60, damping: 18 })

    const onMove = (e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
    }
    const reset = () => {
        mx.set(0)
        my.set(0)
    }

    return (
        <section
            id="inicio"
            onPointerMove={onMove}
            onPointerLeave={reset}
            className="relative px-4 pb-4 pt-6 sm:pt-12"
        >
            <Layer sx={sx} sy={sy} depth={60} className="pointer-events-none absolute left-0 top-0 w-24 sm:w-40 lg:w-60">
                <Sticker name="decor/castle" float />
            </Layer>
            <Layer sx={sx} sy={sy} depth={-50} className="pointer-events-none absolute right-0 top-0 w-24 sm:w-40 lg:w-56">
                <Sticker name="decor/ferris-wheel" float delay={1} />
            </Layer>

            <div className="relative mx-auto grid max-w-7xl grid-cols-2 items-end gap-x-3 gap-y-6 lg:grid-cols-[1fr_minmax(0,40rem)_1fr]">
                <CloudCard className="col-span-2 mt-10 lg:order-2 lg:col-span-1">
                    <Sparkle className="absolute -left-1 top-0 size-6 animate-twinkle text-kw-butter-deep" />
                    <Sparkle className="absolute -right-1 top-8 size-5 animate-twinkle text-kw-pink [animation-delay:1s]" />

                    <motion.div variants={container} initial="hidden" animate="show">
                        <motion.span
                            variants={item}
                            className="inline-flex rounded-full bg-kw-pink-soft px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-kw-pink-deep"
                        >
                            Para {COUPLE.her.name}
                        </motion.span>

                        <motion.h1
                            variants={item}
                            className="mt-3 font-title text-[clamp(2rem,5.4vw,3.4rem)] leading-[1.05]"
                        >
                            Para la persona que hace mis días más bonitos
                            <FiHeart className="ml-2 inline -translate-y-1 animate-heartbeat text-kw-pink" />
                        </motion.h1>

                        <motion.p variants={item} className="mx-auto mt-4 max-w-md text-base font-semibold text-kw-ink/80 sm:text-lg">
                            Gracias por existir, por hacerme sonreír, por estar siempre y por ser tú.
                        </motion.p>

                        <motion.a
                            variants={item}
                            href="#menu"
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-kw-pink px-8 py-3.5 text-lg font-extrabold text-white shadow-lg shadow-pink-300/60"
                        >
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/40 opacity-0 group-hover:animate-shine group-hover:opacity-100"
                            />
                            <FiHeart className="relative animate-heartbeat" />
                            <span className="relative">Explorar mi mundo</span>
                        </motion.a>
                    </motion.div>
                </CloudCard>

                <Layer sx={sx} sy={sy} depth={30} className="order-2 justify-self-center lg:order-1 lg:justify-self-end">
                    <Character
                        name="characters/cinnamoroll"
                        alt="Cinnamoroll"
                        phrases={PHRASES.cinnamoroll}
                        side="left"
                        className="w-36 sm:w-52 lg:w-72 xl:w-80"
                    />
                </Layer>
                <Layer sx={sx} sy={sy} depth={-30} className="order-3 justify-self-center lg:justify-self-start">
                    <Character
                        name="characters/pompompurin"
                        alt="Pompompurin"
                        phrases={PHRASES.pompompurin}
                        side="right"
                        delay={0.4}
                        className="w-36 sm:w-52 lg:w-72 xl:w-80"
                    />
                </Layer>
            </div>
        </section>
    )
}