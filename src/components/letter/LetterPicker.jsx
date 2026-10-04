import { motion } from 'framer-motion'
import { FiCheck, FiLock } from 'react-icons/fi'

const COLORS = {
    pink: ['#ffd1e3', '#e8457f'],
    blue: ['#cfeaff', '#3b82e0'],
    butter: ['#fff1b8', '#e0a82e'],
}

export default function LetterPicker({ letters, selected, onSelect, read }) {
    if (letters.length < 2) return null

    return (
        <ul className="mx-auto mt-6 flex max-w-xl snap-x gap-3 overflow-x-auto px-2 pb-2 [scrollbar-width:none] sm:justify-center">
            {letters.map((l, i) => {
                const [fill, stroke] = COLORS[l.tone] ?? COLORS.pink
                const isSelected = i === selected
                const locked = !!l.unlockAt && new Date(l.unlockAt) > new Date()

                return (
                    <li key={l.id} className="snap-center">
                        <button
                            type="button"
                            onClick={() => onSelect(i)}
                            aria-pressed={isSelected}
                            className="relative flex w-28 flex-col items-center gap-1 rounded-2xl p-2 text-center transition active:scale-95"
                        >
                            {isSelected && (
                                <motion.span
                                    layoutId="letter-ring"
                                    className="absolute inset-0 rounded-2xl border-2 border-dashed border-kw-pink bg-white/70"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="relative">
                                <svg viewBox="0 0 64 44" className="w-16">
                                    <rect x="2" y="2" width="60" height="40" rx="6" fill={fill} stroke={stroke} strokeWidth="2.5" />
                                    <path d="M4 6l28 20L60 6" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
                                </svg>
                                {read[l.id] && (
                                    <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-emerald-400 text-xs text-white shadow">
                                        <FiCheck />
                                    </span>
                                )}
                                {locked && (
                                    <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-white text-xs text-kw-ink shadow">
                                        <FiLock />
                                    </span>
                                )}
                            </span>
                            <span className="relative text-xs font-bold leading-tight">{l.label}</span>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}