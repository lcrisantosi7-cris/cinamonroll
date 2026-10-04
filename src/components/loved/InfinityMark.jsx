import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'
import { lemniscate } from '../../utils/lemniscate'
import { starBurst } from '../../utils/confettiHearts'

export default function InfinityMark({ className = '' }) {
    const uid = useId().replace(/:/g, '')
    const { path } = useMemo(() => lemniscate({ width: 400, height: 200, stretch: 1.25 }), [])

    const burst = (e) =>
        starBurst({
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        })

    return (
        <motion.svg
            viewBox="0 0 400 200"
            role="img"
            aria-label="Símbolo de infinito"
            className={className}
            whileTap={{ scale: 0.94, rotate: -2 }}
            onClick={burst}
        >
            <defs>
                <linearGradient id={`${uid}g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="0">
                    <stop offset="0" stopColor="#ffc2da" />
                    <stop offset="0.35" stopColor="#ffe27a" />
                    <stop offset="0.7" stopColor="#9ad7ff" />
                    <stop offset="1" stopColor="#ffc2da" />
                </linearGradient>
                <filter id={`${uid}f`} x="-20%" y="-50%" width="140%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <path d={path} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
            <motion.path
                d={path}
                fill="none"
                stroke={`url(#${uid}g)`}
                strokeWidth="5"
                strokeLinecap="round"
                filter={`url(#${uid}f)`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.6, ease: 'easeInOut' }}
            />
            <path
                d={path}
                pathLength="100"
                fill="none"
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="6 94"
                className="animate-dash"
                opacity="0.9"
                filter={`url(#${uid}f)`}
            />
            <circle r="5" fill="#ffffff" filter={`url(#${uid}f)`}>
                <animateMotion dur="9s" repeatCount="indefinite" path={path} />
            </circle>
        </motion.svg>
    )
}