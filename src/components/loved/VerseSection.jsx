import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
    FiBookOpen,
    FiHeart,
    FiChevronLeft,
    FiChevronRight,
    FiPause,
    FiPlay,
} from 'react-icons/fi'
import { VERSES } from '../../data/verses'

const verses = VERSES.filter((v) => v.text?.trim())

export default function VerseSection() {
    const [i, setI] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (verses.length < 2 || isPaused) return

        const id = setInterval(() => {
            setI((current) => (current + 1) % verses.length)
        }, 10000)

        return () => clearInterval(id)
    }, [isPaused])

    if (!verses.length) return null

    const index = i % verses.length
    const verse = verses[index]

    const changeVerse = (step) => {
        setI((current) => (current + step + verses.length) % verses.length)
    }

    return (
        <section className="relative mt-24">
            <header className="mx-auto max-w-2xl text-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mx-auto grid size-14 place-items-center rounded-full border border-amber-200/30 bg-amber-200/10 text-amber-200 shadow-lg shadow-amber-300/10"
                >
                    <FiBookOpen className="text-2xl" />
                </motion.span>

                <h2 className="mt-4 bg-linear-to-r from-amber-100 via-pink-200 to-sky-200 bg-clip-text font-title text-3xl text-transparent sm:text-4xl">
                    Un amor que no se acaba
                </h2>

                <p className="mt-3 text-sm font-medium leading-relaxed text-indigo-100/75 sm:text-base">
                    Palabras que me recuerdan lo bonito que es amar y compartir la vida.
                </p>
            </header>

            <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-[2rem] border border-amber-100/25 bg-linear-to-br from-indigo-950/95 via-indigo-900/90 to-purple-950/95 p-5 shadow-2xl shadow-indigo-950/30 sm:p-9">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 15% 20%, rgba(251,207,232,.2) 0, transparent 28%), radial-gradient(circle at 85% 80%, rgba(253,230,138,.16) 0, transparent 30%)',
                    }}
                />

                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-5 top-4 font-serif text-7xl leading-none text-amber-200/20 sm:left-8 sm:top-6 sm:text-8xl"
                >
                    “
                </span>

                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 right-5 font-serif text-7xl leading-none text-pink-200/20 sm:bottom-5 sm:right-8 sm:text-8xl"
                >
                    ”
                </span>

                <div className="relative min-h-64 sm:min-h-60">
                    <AnimatePresence mode="wait">
                        <motion.figure
                            key={verse.ref}
                            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                            transition={{ duration: 0.45 }}
                            className="flex min-h-64 flex-col items-center justify-center py-7 text-center sm:min-h-60 sm:px-6"
                        >
                            <blockquote className="max-w-2xl whitespace-pre-line font-title text-xl leading-relaxed text-amber-50 sm:text-2xl md:text-3xl">
                                {verse.text}
                            </blockquote>

                            <figcaption className="mt-7 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-amber-100/20 bg-white/5 px-4 py-2 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-amber-200 sm:text-sm sm:tracking-[0.2em]">
                                <FiHeart className="shrink-0 text-pink-300" />
                                {verse.ref}
                            </figcaption>

                            <p className="mt-3 text-xs font-medium text-indigo-100/55">
                                Reina-Valera 1960
                            </p>
                        </motion.figure>
                    </AnimatePresence>
                </div>

                {verses.length > 1 && (
                    <div className="relative mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => changeVerse(-1)}
                            aria-label="Versículo anterior"
                            title="Versículo anterior"
                            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-amber-100 transition hover:border-pink-200/50 hover:bg-pink-200/10 active:scale-90"
                        >
                            <FiChevronLeft className="text-xl" />
                        </button>

                        <div className="flex max-w-[55%] items-center justify-center gap-1.5">
                            {verses.map((v, k) => (
                                <button
                                    key={v.ref}
                                    type="button"
                                    onClick={() => setI(k)}
                                    aria-label={`Ver ${v.ref}`}
                                    aria-current={k === index ? 'true' : undefined}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${k === index
                                            ? 'w-7 bg-amber-200 shadow-md shadow-amber-200/30'
                                            : 'w-2.5 bg-white/25 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => changeVerse(1)}
                            aria-label="Siguiente versículo"
                            title="Siguiente versículo"
                            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-amber-100 transition hover:border-pink-200/50 hover:bg-pink-200/10 active:scale-90"
                        >
                            <FiChevronRight className="text-xl" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsPaused((paused) => !paused)}
                            aria-label={
                                isPaused
                                    ? 'Reanudar carrusel automático'
                                    : 'Pausar carrusel automático'
                            }
                            aria-pressed={isPaused}
                            title={
                                isPaused
                                    ? 'Reanudar versículos'
                                    : 'Pausar versículos'
                            }
                            className={`inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition active:scale-95 ${isPaused
                                    ? 'border-amber-200/40 bg-amber-200/15 text-amber-100 hover:bg-amber-200/25'
                                    : 'border-white/15 bg-white/5 text-indigo-100 hover:border-pink-200/40 hover:bg-pink-200/10'
                                }`}
                        >
                            {isPaused ? (
                                <FiPlay className="text-base" />
                            ) : (
                                <FiPause className="text-base" />
                            )}

                            <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
                        </button>
                    </div>
                )}

                <p className="relative mt-5 text-center font-title text-sm text-pink-100/80 sm:text-base">
                    Palabras bonitas para guardar en el corazón ♡
                </p>

                {isPaused && verses.length > 1 && (
                    <p
                        role="status"
                        className="relative mt-2 text-center text-xs font-medium text-amber-200/70"
                    >
                        <FiPause className="mr-1 inline-block" />
                        Carrusel pausado
                    </p>
                )}
            </div>
        </section>
    )
}
