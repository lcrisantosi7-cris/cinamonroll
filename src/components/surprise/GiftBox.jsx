import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

const SPARK = 'M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z'
const SPARKS = [[24, 40, 0.5], [176, 52, 0.6], [14, 120, 0.4], [188, 130, 0.45], [60, 14, 0.4], [146, 10, 0.5]]
const RAYS = Array.from({ length: 12 }, (_, i) => i * 30)

export default function GiftBox({
    taps = 0,
    needed = 3,
    opened = false,
    locked = false,
    unlocking = false,
    onTap,
    className = 'w-[min(72vw,18rem)]',
}) {
    const controls = useAnimationControls()
    const level = Math.min(1, taps / needed)

    useEffect(() => {
        if (taps > 0 && !opened) {
            controls.start({
                rotate: [0, -6 - taps * 2, 6 + taps * 2, -4, 4, 0],
                scale: [1, 1.05 + taps * 0.02, 1],
                transition: { duration: 0.45 },
            })
        }
    }, [taps, opened, controls])

    const still = locked || opened || unlocking

    return (
        <motion.div
            className={`relative mx-auto ${className}`}
            animate={still ? { y: 0 } : { y: [0, -8, 0] }}
            transition={still ? { duration: 0.3 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
            <button
                type="button"
                onClick={onTap}
                disabled={locked || opened || unlocking}
                aria-label={locked ? 'Regalo bloqueado' : 'Abrir el regalo'}
                className="block w-full disabled:cursor-default"
            >
                <motion.svg viewBox="0 0 200 200" className="w-full overflow-visible" animate={controls}>
                    <defs>
                        <linearGradient id="giftBody" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#ffc9de" />
                            <stop offset="1" stopColor="#ff8fb8" />
                        </linearGradient>
                        <linearGradient id="giftRibbon" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#fff3b8" />
                            <stop offset="1" stopColor="#ffd966" />
                        </linearGradient>
                        <radialGradient id="giftGlow">
                            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                            <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="giftRay" gradientUnits="userSpaceOnUse" x1="100" y1="100" x2="100" y2="-20">
                            <stop offset="0" stopColor="#fff6c9" stopOpacity="0.95" />
                            <stop offset="1" stopColor="#fff6c9" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* resplandor que crece con cada toque */}
                    <circle
                        cx="100"
                        cy="110"
                        r="95"
                        fill="url(#giftGlow)"
                        style={{
                            opacity: opened ? 1 : 0.25 + level * 0.6,
                            transform: `scale(${opened ? 1.7 : 1 + level * 0.25})`,
                            transformBox: 'fill-box',
                            transformOrigin: 'center',
                            transition: 'all 0.6s ease',
                        }}
                    />

                    {/* rayos de luz */}
                    <g
                        className="animate-slow-spin"
                        style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '20s' }}
                    >
                        {RAYS.map((a) => (
                            <path
                                key={a}
                                d="M100 100L95 -20L105 -20Z"
                                transform={`rotate(${a} 100 100)`}
                                fill="url(#giftRay)"
                                style={{ opacity: opened ? 0 : level * 0.75, transition: 'opacity 0.5s ease' }}
                            />
                        ))}
                    </g>

                    {/* brillos alrededor */}
                    {SPARKS.map(([x, y, s], i) => (
                        <g key={i} transform={`translate(${x} ${y})`}>
                            <g transform={`scale(${s})`}>
                                <g
                                    className="animate-twinkle"
                                    style={{
                                        transformBox: 'fill-box',
                                        transformOrigin: 'center',
                                        animationDelay: `${i * 0.35}s`,
                                        animationDuration: `${3 - level * 1.6}s`,
                                    }}
                                >
                                    <path d={SPARK} transform="translate(-12 -12)" fill="#ffe27a" />
                                </g>
                            </g>
                        </g>
                    ))}

                    <ellipse cx="100" cy="186" rx="62" ry="8" fill="#000" opacity="0.08" />

                    <rect x="38" y="88" width="124" height="94" rx="10" fill="url(#giftBody)" stroke="#e8457f" strokeWidth="3" />
                    <rect x="88" y="88" width="24" height="94" fill="url(#giftRibbon)" stroke="#e0a82e" strokeWidth="2" />
                    <g fill="#fff" opacity="0.7">
                        <circle cx="58" cy="116" r="4" />
                        <circle cx="72" cy="150" r="3" />
                        <circle cx="140" cy="122" r="4" />
                        <circle cx="128" cy="160" r="3" />
                    </g>

                    {/* luz por la rendija de la tapa */}
                    <rect
                        x="38"
                        y="89"
                        width="124"
                        height="3"
                        rx="1.5"
                        fill="#fff"
                        style={{ opacity: level, filter: 'blur(1.5px)', transition: 'opacity 0.4s ease' }}
                    />

                    {/* tapa */}
                    <motion.g
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        animate={
                            opened
                                ? { y: -150, rotate: 22, opacity: 0 }
                                : { y: -level * 5, rotate: 0, opacity: 1 }
                        }
                        transition={{ duration: opened ? 0.8 : 0.4, ease: opened ? 'easeIn' : 'easeOut' }}
                    >
                        <rect x="30" y="64" width="140" height="30" rx="9" fill="#ff9ec3" stroke="#e8457f" strokeWidth="3" />
                        <rect x="88" y="64" width="24" height="30" fill="url(#giftRibbon)" stroke="#e0a82e" strokeWidth="2" />
                        <path d="M100 64C82 28 50 38 64 58c9 11 27 7 36 6z" fill="#ffe27a" stroke="#e0a82e" strokeWidth="2.5" strokeLinejoin="round" />
                        <path d="M100 64c18-36 50-26 36-6-9 11-27 7-36 6z" fill="#ffe27a" stroke="#e0a82e" strokeWidth="2.5" strokeLinejoin="round" />
                        <circle cx="100" cy="64" r="9" fill="#ffd966" stroke="#e0a82e" strokeWidth="2.5" />
                    </motion.g>

                    {/* candado */}
                    {(locked || unlocking) && (
                        <motion.g
                            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                            animate={
                                unlocking
                                    ? { scale: [1, 1.15, 0], opacity: [1, 1, 0], rotate: [0, -8, 8, 0] }
                                    : { rotate: [0, -6, 6, -4, 4, 0] }
                            }
                            transition={
                                unlocking
                                    ? { duration: 1.1, delay: 0.6, times: [0, 0.4, 1] }
                                    : { duration: 0.5, repeat: Infinity, repeatDelay: 2.6 }
                            }
                        >
                            <motion.path
                                d="M88 132 v-10 a12 12 0 0 1 24 0 v10"
                                fill="none"
                                stroke="#9aa3c7"
                                strokeWidth="6"
                                strokeLinecap="round"
                                animate={unlocking ? { y: [0, -9] } : { y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                            />
                            <rect x="80" y="130" width="40" height="30" rx="8" fill="#c9cfe8" stroke="#9aa3c7" strokeWidth="3" />
                            <circle cx="100" cy="143" r="4" fill="#7c85aa" />
                            <rect x="98.5" y="145" width="3" height="8" rx="1.5" fill="#7c85aa" />
                        </motion.g>
                    )}
                </motion.svg>
            </button>
        </motion.div>
    )
}