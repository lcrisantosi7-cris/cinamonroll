import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, useIsPresent, useScroll, useTransform } from 'framer-motion'

const rand = (seed) => () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const r = rand(11)
const STARS = Array.from({ length: 90 }, () => ({
    left: r() * 100,
    top: r() * 100,
    size: 1 + r() * 2.2,
    delay: r() * 4,
    far: r() < 0.55,
}))

const SPIRAL = (() => {
    const dots = []
    for (let arm = 0; arm < 2; arm++) {
        for (let i = 0; i < 70; i++) {
            const a = i * 0.21 + arm * Math.PI
            const rad = 5 + i * 1.25
            dots.push({
                x: 100 + rad * Math.cos(a),
                y: 100 + rad * Math.sin(a),
                r: Math.max(0.7, 2.6 - i * 0.03),
                o: Math.max(0.15, 0.9 - i * 0.011),
            })
        }
    }
    return dots
})()

const NEBULAS = [
    { c: 'rgba(255,143,184,0.30)', pos: 'left-[-20%] top-[5%]', size: 'size-[34rem]', dur: 40 },
    { c: 'rgba(124,196,255,0.25)', pos: 'right-[-25%] top-[40%]', size: 'size-[38rem]', dur: 50 },
    { c: 'rgba(255,217,102,0.16)', pos: 'left-[10%] bottom-[-25%]', size: 'size-[30rem]', dur: 45 },
]

function Planet({ className = '', body, ring }) {
    return (
        <svg viewBox="-100 -60 200 120" className={className} aria-hidden>
            <g transform="rotate(-18)">
                <ellipse rx="78" ry="17" fill="none" stroke={ring} strokeWidth="5" opacity="0.7" />
                <circle r="38" fill={body} />
                <circle cx="-10" cy="-12" r="14" fill="rgba(255,255,255,0.25)" />
                <path d="M-78 0A78 17 0 0 0 78 0" fill="none" stroke={ring} strokeWidth="5" />
            </g>
        </svg>
    )
}

function Layer({ children, y }) {
    return (
        <motion.div style={{ y }} className="absolute inset-0">
            {children}
        </motion.div>
    )
}

export default function Cosmos() {
    const isPresent = useIsPresent()
    useEffect(() => {
        const b = document.body
        b.dataset.cover = String((Number(b.dataset.cover) || 0) + 1)
        return () => {
            const n = (Number(b.dataset.cover) || 1) - 1
            if (n > 0) b.dataset.cover = String(n)
            else delete b.dataset.cover
        }
    }, [])
    const { scrollY } = useScroll()
    const farY = useTransform(scrollY, [0, 3000], [0, -120])
    const nearY = useTransform(scrollY, [0, 3000], [0, -260])
    const planetY = useTransform(scrollY, [0, 3000], [0, -420])

    const dot = (s, i) => (
        <span
            key={i}
            className="absolute animate-twinkle rounded-full bg-white"
            style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
            }}
        />
    )

    return createPortal(
        <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: isPresent ? 1 : 0 }}
            transition={{ duration: isPresent ? 0.9 : 0.3 }}
            className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden bg-linear-to-b from-[#0d1238] via-[#241b5c] to-[#5b2a6e]"
        >
            {NEBULAS.map((n, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${n.pos} ${n.size}`}
                    style={{ background: `radial-gradient(circle, ${n.c}, transparent 65%)` }}
                    animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
                    transition={{ duration: n.dur, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            <Layer y={farY}>{STARS.filter((s) => s.far).map(dot)}</Layer>
            <Layer y={nearY}>{STARS.filter((s) => !s.far).map(dot)}</Layer>

            <svg
                viewBox="0 0 200 200"
                className="absolute -right-24 top-10 w-80 animate-slow-spin opacity-60 sm:w-[28rem]"
            >
                <circle cx="100" cy="100" r="14" fill="#fff4d6" opacity="0.8" />
                {SPIRAL.map((d, i) => (
                    <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#ffffff" opacity={d.o} />
                ))}
            </svg>

            <motion.div style={{ y: planetY }} className="absolute inset-0">
                <motion.div
                    className="absolute left-[6%] top-[58%] w-28 sm:w-40"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Planet body="#ffb3d1" ring="#ffe27a" />
                </motion.div>
                <motion.div
                    className="absolute right-[8%] top-[34%] w-20 sm:w-28"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Planet body="#ffe27a" ring="#9ad7ff" />
                </motion.div>
            </motion.div>

            {[0, 1, 2].map((k) => (
                <span
                    key={k}
                    className="absolute h-px w-28 animate-shoot bg-linear-to-r from-white via-white/50 to-transparent"
                    style={{
                        right: '8%',
                        top: `${10 + k * 18}%`,
                        animationDelay: `${k * 3.2}s`,
                        animationDuration: `${8 + k * 2}s`,
                    }}
                />
            ))}
        </motion.div>,
        document.body
    )
}