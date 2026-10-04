import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiAward, FiCheck, FiLock } from 'react-icons/fi'
import GiftBox from './GiftBox'
import { img } from '../../assets'

const R = 38
const ANGLES = [-90, 30, 150]

const posOf = (i) => {
    const a = (ANGLES[i % ANGLES.length] * Math.PI) / 180
    return { left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%` }
}

function Medal({ game, done, pos, unlocking, i }) {
    const [broken, setBroken] = useState(false)
    const url = img(`surprise/medal-${game.id}`)

    const body = (
        <span
            className={`relative grid size-20 place-items-center rounded-full border-4 border-white bg-white/90 shadow-lg sm:size-24 ${done ? '' : 'grayscale'
                }`}
        >
            {url && !broken ? (
                <img
                    src={url}
                    alt=""
                    draggable={false}
                    onError={() => setBroken(true)}
                    className={`size-[85%] object-contain ${done ? '' : 'opacity-50'}`}
                />
            ) : (
                <FiAward className="text-3xl text-kw-pink" />
            )}
            <span
                className={`absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full text-white shadow ${done ? 'bg-emerald-400' : 'bg-kw-ink/50'
                    }`}
            >
                {done ? <FiCheck /> : <FiLock />}
            </span>
        </span>
    )

    return (
        <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={
                unlocking
                    ? { left: '50%', top: '50%', scale: 0.15, rotate: 360, opacity: 0 }
                    : { left: pos.left, top: pos.top, scale: 1, rotate: 0, opacity: 1 }
            }
            transition={
                unlocking
                    ? { duration: 1.1, delay: 0.15 + i * 0.18, ease: 'easeIn' }
                    : { duration: 0.4 }
            }
        >
            <motion.div
                animate={unlocking ? { y: 0 } : { y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
            >
                {done || unlocking ? (
                    body
                ) : (
                    <Link to={game.to} aria-label={`Jugar ${game.title}`} className="block active:scale-95">
                        {body}
                    </Link>
                )}
                <span className="absolute left-1/2 top-full mt-1 w-28 -translate-x-1/2 text-center text-[11px] font-bold leading-tight">
                    {game.title}
                </span>
            </motion.div>
        </motion.div>
    )
}

export default function Orbit({ games, completed, unlocking = false }) {
    const all = games.every((g) => completed[g.id])

    return (
        <div className="relative mx-auto aspect-square w-[min(92vw,26rem)]">
            <motion.svg
                aria-hidden
                viewBox="0 0 100 100"
                className="absolute inset-0 animate-slow-spin"
                animate={{ opacity: unlocking ? 0 : 1 }}
                transition={{ duration: 0.8 }}
            >
                <circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke="rgba(36,71,143,0.28)"
                    strokeWidth="0.6"
                    strokeDasharray="1 2.4"
                    strokeLinecap="round"
                />
            </motion.svg>

            <div className="absolute left-1/2 top-1/2 w-[44%] -translate-x-1/2 -translate-y-1/2">
                <GiftBox className="w-full" locked={!all && !unlocking} unlocking={unlocking} />
            </div>

            {games.map((g, i) => (
                <Medal
                    key={g.id}
                    game={g}
                    done={!!completed[g.id]}
                    pos={posOf(i)}
                    unlocking={unlocking}
                    i={i}
                />
            ))}
        </div>
    )
}