import { createPortal } from 'react-dom'
import { motion, useIsPresent } from 'framer-motion'

const rand = (seed) => () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const r = rand(5)
const BITS = Array.from({ length: 24 }, (_, i) => ({
    left: r() * 100,
    size: 12 + r() * 16,
    dur: 12 + r() * 10,
    delay: r() * 14,
    heart: i % 3 !== 0,
}))

const Heart = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <path
            d="M12 21C5 16 2 12.5 2 8.8 2 6.1 4 4 6.6 4c1.9 0 3.6 1 5.4 3 1.8-2 3.5-3 5.4-3C20 4 22 6.1 22 8.8 22 12.5 19 16 12 21z"
            fill="#ff8fb8"
        />
    </svg>
)

const Star = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <path
            d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z"
            fill="#ffe27a"
            stroke="#f5b83d"
            strokeWidth="1"
            strokeLinejoin="round"
        />
    </svg>
)

export default function Celebration() {
    const isPresent = useIsPresent()

    return createPortal(
        <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: isPresent ? 1 : 0 }}
            transition={{ duration: isPresent ? 0.9 : 0.3 }}
            className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden bg-linear-to-b from-[#ffc9e0] via-[#ffe9d6] to-[#fff6dc]"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.75),transparent_60%)]" />

            <svg
                viewBox="-100 -100 200 200"
                className="absolute left-1/2 top-[-55%] w-[190%] max-w-none -translate-x-1/2 animate-slow-spin opacity-40"
                style={{ animationDuration: '120s' }}
            >
                <defs>
                    <linearGradient id="celRay" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0" stopColor="#ffd966" stopOpacity="0.9" />
                        <stop offset="1" stopColor="#ffd966" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {Array.from({ length: 20 }, (_, k) => (
                    <path key={k} d="M0 0L-7 -100L7 -100Z" fill="url(#celRay)" transform={`rotate(${k * 18})`} />
                ))}
            </svg>

            {BITS.map((b, i) => (
                <span
                    key={i}
                    className="absolute top-0 animate-rise will-change-transform"
                    style={{ left: `${b.left}%`, animationDuration: `${b.dur}s`, animationDelay: `-${b.delay}s` }}
                >
                    {b.heart ? <Heart size={b.size} /> : <Star size={b.size} />}
                </span>
            ))}
        </motion.div>,
        document.body
    )
}