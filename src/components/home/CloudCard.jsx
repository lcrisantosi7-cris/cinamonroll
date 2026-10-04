import { motion } from 'framer-motion'

const BUMPS = [
    ['8%', '0%', 4.5], ['26%', '0%', 6], ['50%', '0%', 7.5], ['74%', '0%', 5.5], ['92%', '0%', 4],
    ['14%', '100%', 4], ['36%', '100%', 5.5], ['60%', '100%', 5], ['84%', '100%', 4.5],
    ['0%', '28%', 4.5], ['0%', '68%', 4], ['100%', '34%', 4], ['100%', '72%', 4.5],
]

export default function CloudCard({ className = '', children }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 110 }}
            className={`relative drop-shadow-[0_14px_22px_rgba(255,143,184,0.28)] ${className}`}
        >
            {BUMPS.map(([left, top, s], i) => (
                <motion.span
                    key={i}
                    aria-hidden
                    className="absolute rounded-full bg-white/95"
                    style={{ left, top, width: `${s}rem`, height: `${s}rem`, marginLeft: `-${s / 2}rem`, marginTop: `-${s / 2}rem` }}
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                />
            ))}

            <div className="relative rounded-[2.5rem] bg-white/95 px-6 py-9 text-center sm:px-12 sm:py-12">
                <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[2rem] border-2 border-dashed border-kw-pink/70" />
                <div className="relative">{children}</div>
            </div>
        </motion.div>
    )
}