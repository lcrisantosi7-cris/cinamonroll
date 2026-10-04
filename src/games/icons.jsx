import { useId } from 'react'
import { SPRITES, IMG_NAME } from './sprites'
import { img } from '../assets'

export function Sprite({ name, className = '' }) {
    const uid = useId().replace(/:/g, '')
    const url = IMG_NAME[name] ? img(IMG_NAME[name]) : null

    if (url) {
        return <img src={url} alt="" draggable={false} className={`object-contain ${className}`} />
    }

    const parts = SPRITES[name] ?? []
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            <defs>
                {parts.map(
                    (p, i) =>
                        Array.isArray(p.fill) && (
                            <linearGradient key={i} id={`${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor={p.fill[0]} />
                                <stop offset="1" stopColor={p.fill[1]} />
                            </linearGradient>
                        )
                )}
            </defs>
            {parts.map((p, i) => (
                <path
                    key={i}
                    d={p.d}
                    fill={Array.isArray(p.fill) ? `url(#${uid}-${i})` : (p.fill ?? 'none')}
                    stroke={p.stroke}
                    strokeWidth={p.lw ?? 2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            ))}
        </svg>
    )
}