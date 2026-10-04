import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { VERSES } from '../../data/verses'

const verses = VERSES.filter((v) => v.text?.trim())

export default function VerseSection() {
    const [i, setI] = useState(0)

    useEffect(() => {
        if (verses.length < 2) return
        const id = setInterval(() => setI((x) => (x + 1) % verses.length), 9000)
        return () => clearInterval(id)
    }, [])

    if (!verses.length) return null
    const v = verses[i % verses.length]

    return (
        <section className="mt-24 text-center">
            <h2 className="font-title text-3xl sm:text-4xl">Un amor que no se acaba</h2>

            <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden rounded-4xl border border-amber-200/40 bg-indigo-950/40 px-6 py-14 backdrop-blur-md">
                <svg
                    aria-hidden
                    viewBox="-100 -100 200 200"
                    className="absolute left-1/2 top-1/2 w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 animate-slow-spin opacity-30"
                    style={{ animationDuration: '90s' }}
                >
                    <defs>
                        <linearGradient id="verseRay" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0" stopColor="#ffe27a" stopOpacity="0.9" />
                            <stop offset="1" stopColor="#ffe27a" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {Array.from({ length: 16 }, (_, k) => (
                        <path key={k} d="M0 0L-6 -100L6 -100Z" fill="url(#verseRay)" transform={`rotate(${k * 22.5})`} />
                    ))}
                </svg>

                <div className="relative min-h-40">
                    <AnimatePresence mode="wait">
                        <motion.figure
                            key={v.ref}
                            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                            transition={{ duration: 0.8 }}
                        >
                            <blockquote className="font-title text-[clamp(1.7rem,5vw,2.7rem)] leading-snug text-amber-50">
                                {v.text}
                            </blockquote>
                            <figcaption className="mt-5 text-sm font-extrabold uppercase tracking-[0.3em] text-amber-200">
                                {v.ref}
                            </figcaption>
                            <p className="mt-1 text-xs font-semibold text-indigo-100/60">Reina-Valera 1960</p>
                        </motion.figure>
                    </AnimatePresence>
                </div>

                {verses.length > 1 && (
                    <div className="relative mt-6 flex justify-center gap-2">
                        {verses.map((vv, k) => (
                            <button
                                key={vv.ref}
                                type="button"
                                onClick={() => setI(k)}
                                aria-label={`Ver ${vv.ref}`}
                                className={`h-2 rounded-full transition-all ${k === i % verses.length ? 'w-6 bg-amber-200' : 'w-2 bg-white/30'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}