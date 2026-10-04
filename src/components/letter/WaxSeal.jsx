import { useId } from 'react'

export const SEAL_COLORS = {
    pink: ['#ff6fa3', '#d93a78'],
    blue: ['#7ab8ff', '#3b82e0'],
    butter: ['#ffd966', '#d99a1e'],
}

const BLOB = (() => {
    const pts = Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2
        const r = 42 + Math.sin(a * 7) * 2.4 + Math.sin(a * 3 + 1) * 1.6
        return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`
    })
    return `${pts.join('')}Z`
})()

const HEART =
    'M12 21C5 16 2 12.5 2 8.8 2 6.1 4 4 6.6 4c1.9 0 3.6 1 5.4 3 1.8-2 3.5-3 5.4-3C20 4 22 6.1 22 8.8 22 12.5 19 16 12 21z'

export default function WaxSeal({ tone = 'pink', className = '' }) {
    const id = useId().replace(/:/g, '')
    const [light, dark] = SEAL_COLORS[tone] ?? SEAL_COLORS.pink

    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            <defs>
                <radialGradient id={id} cx="35%" cy="30%" r="80%">
                    <stop offset="0" stopColor={light} />
                    <stop offset="1" stopColor={dark} />
                </radialGradient>
            </defs>
            <path d={BLOB} fill={`url(#${id})`} />
            <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
            <g transform="translate(26 27) scale(2)">
                <path d={HEART} fill="rgba(0,0,0,0.22)" transform="translate(0.4 0.6)" />
                <path d={HEART} fill={light} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
            </g>
            <ellipse cx="33" cy="29" rx="10" ry="4.5" fill="rgba(255,255,255,0.35)" transform="rotate(-30 33 29)" />
        </svg>
    )
}