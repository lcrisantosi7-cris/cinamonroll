import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiPlus } from 'react-icons/fi'
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
    const remaining = reasons.length - shown

    const toggle = (i, e) => {
        const on = !loved[i]
        setLoved((l) => ({ ...l, [i]: on }))
        if (on) heartBurst({ particleCount: 12, spread: 55, startVelocity: 18, origin: originOf(e) })
    }

    const more = (e) => {
        setShown((s) => Math.min(s + PAGE, reasons.length))
        starBurst({ particleCount: 50, origin: originOf(e) })
    }

    return (
        <section className="mt-20">
            <h2 className="text-center font-title text-3xl sm:text-4xl">Todas las razones</h2>
            <p className="mt-1 text-center text-indigo-100/80">Toca las que más te gusten</p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {reasons.slice(0, shown).map((t, i) => {
                    const on = !!loved[i]
                    return (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ delay: (i % 3) * 0.08 }}
                        >
                            <button
                                type="button"
                                onClick={(e) => toggle(i, e)}
                                aria-pressed={on}
                                className={`group flex h-full w-full items-start gap-3 rounded-3xl border p-4 text-left backdrop-blur-md transition duration-300 hover:-translate-y-1 ${on
                                        ? 'border-pink-200/60 bg-pink-300/20 shadow-lg shadow-pink-400/20'
                                        : 'border-white/20 bg-white/10 hover:bg-white/15'
                                    }`}
                            >
                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-pink-300 to-amber-200 font-title text-lg text-indigo-900">
                                    {i + 1}
                                </span>
                                <span className="flex-1 font-title text-xl leading-snug">{t}</span>
                                <FiHeart
                                    className={`mt-1 shrink-0 text-xl transition ${on ? 'animate-heartbeat fill-pink-300 text-pink-300' : 'text-white/40 group-hover:text-pink-200'
                                        }`}
                                />
                            </button>
                        </motion.li>
                    )
                })}
            </ul>

            <div className="mt-8 text-center">
                {remaining > 0 ? (
                    <motion.button
                        type="button"
                        onClick={more}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        className="inline-flex items-center gap-2 rounded-full bg-kw-pink px-7 py-3 font-extrabold text-white shadow-lg shadow-pink-500/30"
                    >
                        <FiPlus /> Ver más razones ({remaining})
                    </motion.button>
                ) : (
                    <p className="font-title text-2xl text-amber-100">Y aun así, esto no es todo.</p>
                )}
            </div>
        </section>
    )
}