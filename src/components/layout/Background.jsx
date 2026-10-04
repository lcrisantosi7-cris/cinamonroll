import { motion, useScroll, useTransform } from 'framer-motion'

const FAR_CLOUDS = [
    { top: '8%', w: 'w-28', dur: 130, delay: 10, o: 'opacity-60' },
    { top: '38%', w: 'w-32', dur: 150, delay: 90, o: 'opacity-50' },
    { top: '66%', w: 'w-28', dur: 140, delay: 40, o: 'opacity-50' },
]
const NEAR_CLOUDS = [
    { top: '14%', w: 'w-48', dur: 90, delay: 0, o: 'opacity-90' },
    { top: '30%', w: 'w-36', dur: 110, delay: 55, o: 'opacity-75' },
    { top: '52%', w: 'w-60', dur: 120, delay: 70, o: 'opacity-80' },
    { top: '78%', w: 'w-44', dur: 100, delay: 25, o: 'opacity-65' },
]

const STARS = Array.from({ length: 16 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 23) % 85,
    size: 10 + (i % 3) * 5,
    delay: (i % 5) * 0.6,
}))

const HEARTS = Array.from({ length: 8 }, (_, i) => ({
    left: 5 + i * 12,
    size: 14 + (i % 3) * 6,
    dur: 14 + (i % 4) * 3,
    delay: i * 1.7,
}))

const Star = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <path
            d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z"
            fill="#ffe27a" stroke="#f5b83d" strokeWidth="1" strokeLinejoin="round"
        />
    </svg>
)

const Heart = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <path
            d="M12 21C5 16 2 12.5 2 8.8 2 6.1 4 4 6.6 4c1.9 0 3.6 1 5.4 3 1.8-2 3.5-3 5.4-3C20 4 22 6.1 22 8.8 22 12.5 19 16 12 21z"
            fill="#ff8fb8"
        />
    </svg>
)

const Cloud = ({ c }) => (
    <svg
        viewBox="0 0 125 60"
        className={`absolute left-0 animate-drift will-change-transform ${c.w} ${c.o}`}
        style={{ top: c.top, animationDuration: `${c.dur}s`, animationDelay: `-${c.delay}s` }}
    >
        <path d="M20 50Q0 50 0 35Q0 20 20 20Q30 5 50 10Q70 0 90 15Q110 10 115 30Q125 50 100 50Z" fill="#fff" />
    </svg>
)

export default function Background() {
    const { scrollY, scrollYProgress } = useScroll()
    const dayO = useTransform(scrollYProgress, [0, 0.45], [1, 0])
    const duskO = useTransform(scrollYProgress, [0, 0.45, 0.8], [0, 1, 0])
    const meadowO = useTransform(scrollYProgress, [0.5, 1], [0, 1])
    const farY = useTransform(scrollY, [0, 4000], [0, -120])
    const nearY = useTransform(scrollY, [0, 4000], [0, -320])

    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <motion.div style={{ opacity: dayO }} className="absolute inset-0 bg-linear-to-b from-[#b9e0ff] via-[#e6f4ff] to-[#fff1f6]" />
            <motion.div style={{ opacity: duskO }} className="absolute inset-0 bg-linear-to-b from-[#c9d6ff] via-[#f3e6ff] to-[#ffe6f1]" />
            <motion.div style={{ opacity: meadowO }} className="absolute inset-0 bg-linear-to-b from-[#ffd9ea] via-[#fff3da] to-[#dff6e4]" />

            <motion.div style={{ y: farY }} className="absolute inset-0">
                {FAR_CLOUDS.map((c, i) => <Cloud key={i} c={c} />)}
            </motion.div>
            <motion.div style={{ y: nearY }} className="absolute inset-0">
                {NEAR_CLOUDS.map((c, i) => <Cloud key={i} c={c} />)}
            </motion.div>

            {STARS.map((s, i) => (
                <span
                    key={i}
                    className="absolute animate-twinkle"
                    style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
                >
                    <Star size={s.size} />
                </span>
            ))}

            {HEARTS.map((h, i) => (
                <span
                    key={i}
                    className="absolute top-0 animate-rise will-change-transform"
                    style={{ left: `${h.left}%`, animationDuration: `${h.dur}s`, animationDelay: `-${h.delay}s` }}
                >
                    <Heart size={h.size} />
                </span>
            ))}
        </div>
    )
}