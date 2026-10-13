import { motion } from 'framer-motion'
import { FiCheck, FiLock } from 'react-icons/fi'

const COLORS = {
    pink: ['#ffd1e3', '#e8457f'],
    blue: ['#cfeaff', '#3b82e0'],
    butter: ['#fff1b8', '#e0a82e'],
}

export default function LetterPicker({ letters, selected, onSelect, read }) {
    if (!letters?.length || letters.length < 2) return null

    return (
        <nav
            aria-label="Elegir una carta"
            className="mx-auto mt-7 w-full max-w-4xl"
        >
            <p className="mb-3 text-center text-sm font-semibold text-kw-ink/65">
                Elige un sobre para descubrir su mensaje ♡
            </p>

            <ul className="mx-auto flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pt-2 [scrollbar-width:thin] [scrollbar-color:#f9a8d4_transparent] sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-2">
                {letters.map((letter, index) => {
                    const [fill, stroke] = COLORS[letter.tone] ?? COLORS.pink
                    const isSelected = index === selected
                    const locked =
                        !!letter.unlockAt &&
                        new Date(letter.unlockAt) > new Date()

                    return (
                        <li
                            key={letter.id}
                            className="w-28 shrink-0 snap-center sm:w-32"
                        >
                            <button
                                type="button"
                                onClick={() => onSelect(index)}
                                aria-pressed={isSelected}
                                aria-label={`${letter.label}${locked ? ', bloqueada' : ''}`}
                                className={`relative flex min-h-32 w-full flex-col items-center justify-start gap-2 rounded-2xl px-2 py-3 text-center transition duration-200 active:scale-95 ${isSelected
                                        ? 'text-kw-ink'
                                        : 'text-kw-ink/75 hover:bg-white/45'
                                    }`}
                            >
                                {isSelected && (
                                    <motion.span
                                        layoutId="letter-ring"
                                        className="absolute inset-0 rounded-2xl border-2 border-dashed border-kw-pink bg-white/75 shadow-md shadow-pink-200/20"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 380,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <span className="relative mt-1 block">
                                    <motion.svg
                                        viewBox="0 0 64 44"
                                        className="w-[4.5rem] drop-shadow-sm sm:w-20"
                                        animate={
                                            isSelected
                                                ? { y: [0, -3, 0] }
                                                : { y: 0 }
                                        }
                                        transition={{
                                            duration: 1.8,
                                            repeat: isSelected ? Infinity : 0,
                                        }}
                                    >
                                        <rect
                                            x="2"
                                            y="2"
                                            width="60"
                                            height="40"
                                            rx="6"
                                            fill={fill}
                                            stroke={stroke}
                                            strokeWidth="2.5"
                                        />
                                        <path
                                            d="M4 6l28 20L60 6"
                                            fill="none"
                                            stroke={stroke}
                                            strokeWidth="2.5"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M4 38l18-15M60 38L42 23"
                                            fill="none"
                                            stroke={stroke}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </motion.svg>

                                    {read?.[letter.id] && (
                                        <span
                                            aria-label="Carta leída"
                                            className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-emerald-400 text-xs text-white shadow"
                                        >
                                            <FiCheck />
                                        </span>
                                    )}

                                    {locked && (
                                        <span
                                            aria-label="Carta bloqueada"
                                            className="absolute -left-2 -top-2 grid size-6 place-items-center rounded-full border border-white bg-amber-100 text-xs text-amber-800 shadow"
                                        >
                                            <FiLock />
                                        </span>
                                    )}
                                </span>

                                <span className="relative w-full break-words text-xs font-extrabold leading-snug sm:text-sm">
                                    {letter.label}
                                </span>

                                <span
                                    className={`relative text-[10px] font-bold ${locked
                                            ? 'text-amber-700'
                                            : isSelected
                                                ? 'text-kw-pink-deep'
                                                : 'text-kw-ink/45'
                                        }`}
                                >
                                    {locked
                                        ? 'Aún cerrada'
                                        : read?.[letter.id]
                                            ? 'Ya leída ♡'
                                            : isSelected
                                                ? 'Seleccionada'
                                                : 'Toca para elegir'}
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}