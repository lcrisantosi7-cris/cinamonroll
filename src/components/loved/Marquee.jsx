import { FiStar } from 'react-icons/fi'

function Row({ items, reverse = false }) {
    const doubled = [...items, ...items]
    const duration = Math.max(40, items.length * 4)

    return (
        <div className="overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <ul
                className="flex w-max animate-marquee gap-3 pr-3 hover:[animation-play-state:paused]"
                style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
            >
                {doubled.map((t, i) => (
                    <li
                        key={i}
                        aria-hidden={i >= items.length}
                        className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-5 py-2 font-title text-xl text-white/90 backdrop-blur-sm"
                    >
                        <FiStar className="text-amber-200" /> {t}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function Marquee({ reasons }) {
    const a = reasons.filter((_, i) => i % 2 === 0)
    const b = reasons.filter((_, i) => i % 2 === 1)

    return (
        <div className="space-y-3">
            <Row items={a} />
            {b.length > 0 && <Row items={b} reverse />}
        </div>
    )
}