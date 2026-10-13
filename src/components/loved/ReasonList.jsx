import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiPlus, FiStar } from 'react-icons/fi'
import { heartBurst, starBurst } from '../../utils/confettiHearts'

const PAGE = 18

const originOf = (e) => {
    const r = e.currentTarget.getBoundingClientRect()

    return {
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height / 2) / window.innerHeight,
    }
}

export default function ReasonList({ reasons }) {
    const [shown, setShown] = useState(PAGE)
    const [loved, setLoved] = useState({})

    const remaining = Math.max(0, reasons.length - shown)
    const lovedCount = Object.values(loved).filter(Boolean).length

    const toggle = (i, e) => {
        const on = !loved[i]

        setLoved((current) => ({ ...current, [i]: on }))

        if (on) {
            heartBurst({
                particleCount: 12,
                spread: 55,
                startVelocity: 18,
                origin: originOf(e),
            })
        }
    }

    const more = (e) => {
        setShown((current) => Math.min(current + PAGE, reasons.length))

        starBurst({
            particleCount: 35,
            origin: originOf(e),
        })
    }

    return (
        <section className="mt-14 min-w-0 sm:mt-20">
            <header className="mx-auto max-w-2xl text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-pink-200/25 bg-pink-200/10 text-pink-200 shadow-lg shadow-pink-500/10">
                    <FiHeart className="text-xl" />
                </span>

                <h2 className="mt-4 text-balance bg-linear-to-r from-pink-200 via-amber-100 to-pink-200 bg-clip-text font-title text-2xl text-transparent sm:text-4xl">
                    Todas las razones
                </h2>

                <p className="mt-2 text-sm font-medium text-indigo-100/80 sm:text-base">
                    Pequeñas cosas que hacen que seas tan especial para mí.
                </p>

                {lovedCount > 0 && (
                    <motion.p
                        key={lovedCount}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200/25 bg-pink-200/10 px-4 py-2 text-sm font-bold text-pink-100"
                    >
                        <FiHeart className="fill-pink-300 text-pink-300" />
                        Has marcado {lovedCount} {lovedCount === 1 ? 'razón' : 'razones'}
                    </motion.p>
                )}
            </header>

            <ul className="mt-6 grid min-w-0 grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {reasons.slice(0, shown).map((text, i) => {
                    const on = !!loved[i]

                    return (
                        <motion.li
                            key={`${i}-${text}`}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
                            className="min-w-0"
                        >
                            <button
                                type="button"
                                onClick={(e) => toggle(i, e)}
                                aria-pressed={on}
                                className={`group relative flex min-h-28 w-full items-start gap-3 overflow-hidden rounded-3xl border p-4 text-left shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] sm:min-h-32 sm:p-5 ${
                                    on
                                        ? 'border-pink-200/60 bg-linear-to-br from-pink-300/20 to-rose-300/10 shadow-pink-400/10'
                                        : 'border-white/15 bg-indigo-950/35 hover:border-pink-200/35 hover:bg-white/10'
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute -right-5 -top-6 size-20 rounded-full blur-2xl transition ${
                                        on ? 'bg-pink-300/20' : 'bg-sky-200/5 group-hover:bg-pink-200/10'
                                    }`}
                                />

                                <span
                                    className={`relative grid size-10 shrink-0 place-items-center rounded-2xl font-title text-lg shadow-sm transition sm:size-11 ${
                                        on
                                            ? 'bg-linear-to-br from-pink-200 to-rose-300 text-rose-900'
                                            : 'border border-white/20 bg-white/10 text-amber-100 group-hover:border-pink-200/40'
                                    }`}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                <span className="relative min-w-0 flex-1 break-words pt-1 font-title text-base leading-snug text-white [overflow-wrap:anywhere] sm:text-xl">
                                    {text}
                                </span>

                                <span
                                    className={`relative mt-1 grid size-8 shrink-0 place-items-center rounded-full transition ${
                                        on
                                            ? 'bg-pink-300/20 text-pink-200'
                                            : 'text-white/40 group-hover:text-pink-200'
                                    }`}
                                >
                                    <FiHeart
                                        className={`text-lg transition ${
                                            on ? 'animate-heartbeat fill-pink-300 text-pink-300' : ''
                                        }`}
                                    />
                                </span>
                            </button>
                        </motion.li>
                    )
                })}
            </ul>

            <div className="mt-7 px-1 text-center sm:mt-9">
                {remaining > 0 ? (
                    <motion.button
                        type="button"
                        onClick={more}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-pink-100/30 bg-linear-to-r from-pink-400 to-rose-400 px-6 py-3 font-extrabold text-white shadow-lg shadow-pink-500/20 transition hover:shadow-pink-400/30 sm:px-7"
                    >
                        <FiPlus />
                        Ver más razones
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                            {remaining}
                        </span>
                    </motion.button>
                ) : (
                    <div className="mx-auto max-w-lg rounded-3xl border border-amber-100/20 bg-white/5 px-5 py-5 backdrop-blur-sm">
                        <FiStar className="mx-auto text-2xl text-amber-200" />
                        <p className="mt-2 font-title text-xl text-amber-100 sm:text-2xl">
                            Y aun así, esto no es todo ♡
                        </p>
                        <p className="mt-1 text-sm text-indigo-100/70">
                            Siempre encontraré nuevas razones para quererte.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}