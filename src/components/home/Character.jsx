import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { img } from '../../assets'
import { heartBurst } from '../../utils/confettiHearts'

export default function Character({ name, alt, phrases, side = 'left', delay = 0, className = '' }) {
    const [bubble, setBubble] = useState(null)
    const timer = useRef(null)
    const idx = useRef(-1)
    const src = img(name)

    useEffect(() => () => clearTimeout(timer.current), [])
    if (!src) return null

    const poke = (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        heartBurst({
            particleCount: 18,
            spread: 70,
            startVelocity: 22,
            origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height * 0.3) / window.innerHeight },
        })
        idx.current = (idx.current + 1) % phrases.length
        setBubble(phrases[idx.current])
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setBubble(null), 2400)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 0.3 + delay }}
            className={`relative ${className}`}
        >
            <AnimatePresence>
                {bubble && (
                    <motion.p
                        key={bubble}
                        initial={{ opacity: 0, scale: 0.6, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute left-1/2 top-0 z-10 w-max max-w-[11rem] -translate-x-1/2 -translate-y-full rounded-2xl bg-white px-3 py-2 text-center font-title text-lg leading-tight shadow-lg"
                    >
                        {bubble}
                        <span className="absolute left-1/2 top-full size-3 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-white" />
                    </motion.p>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={poke}
                aria-label={`Tocar a ${alt}`}
                whileHover={{ scale: 1.06, rotate: side === 'left' ? -3 : 3 }}
                whileTap={{ scaleY: 0.88, scaleX: 1.08 }}
                animate={{ y: [0, -12, 0] }}
                transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay } }}
                className="block w-full cursor-pointer"
            >
                <img
                    src={src}
                    alt={alt}
                    draggable={false}
                    decoding="async"
                    className="w-full select-none drop-shadow-[0_10px_16px_rgba(120,170,230,0.35)]"
                />
            </motion.button>
        </motion.div>
    )
}