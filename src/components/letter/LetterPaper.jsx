import { Fragment, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowRight, FiFastForward, FiHeart, FiRotateCcw, FiX } from 'react-icons/fi'
import Sticker from '../ui/Sticker'
import ButtonLink from '../ui/ButtonLink'
import Stamp from './Stamp'
import WaxSeal from './WaxSeal'
import ReplyBox from './ReplyBox'
import { heartBurst } from '../../utils/confettiHearts'

const START = 1.0

const NOISE_SVG =
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .4 0 0 0 0 .3 0 0 0 .08 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
const NOISE = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`
const RULED =
    'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #ffd9e6 31px, #ffd9e6 32px)'
const PAPER = { backgroundColor: '#fffdf8', backgroundImage: `${NOISE}, ${RULED}` }
const WASHI = {
    backgroundImage: 'repeating-linear-gradient(45deg, #ffd1e3 0 8px, #ffffff 8px 16px)',
}

const longDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

function buildPlan(letter) {
    const all = [letter.greeting, ...letter.paragraphs, letter.closing, letter.ps ?? '']
        .join(' ')
        .trim()
        .split(/\s+/).length
    const step = all <= 140 ? 0.045 : 0.03

    let words = 0
    const at = (text) => {
        const start = START + words * step
        words += text.split(' ').length
        return start
    }

    const greeting = at(letter.greeting)
    const paragraphs = letter.paragraphs.map(at)
    const closing = at(letter.closing)
    const sig = START + words * step
    words += 14
    const ps = letter.ps ? at(letter.ps) : null

    return { step, greeting, paragraphs, closing, sig, ps, end: START + words * step + 0.8 }
}

function Words({ text, start, step, instant }) {
    return text.split(' ').map((w, i) => (
        <Fragment key={i}>
            <motion.span
                className="inline-block"
                initial={instant ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: start + i * step, duration: 0.35 }}
            >
                {w}
            </motion.span>{' '}
        </Fragment>
    ))
}

const ghostBtn =
    'inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-2.5 font-bold shadow-lg transition hover:-translate-y-0.5 active:scale-95'

export default function LetterPaper({ letter, onClose, onNext, hasNext, onRead }) {
    const plan = useMemo(() => buildPlan(letter), [letter])
    const [instant, setInstant] = useState(false)
    const [done, setDone] = useState(false)
    const [marked, setMarked] = useState({})
    const [replay, setReplay] = useState(0)

    useEffect(() => {
        heartBurst({ particleCount: 60, spread: 90, origin: { y: 0.3 } })
    }, [replay])

    useEffect(() => {
        if (done) return
        const t = setTimeout(() => setDone(true), instant ? 0 : plan.end * 1000)
        return () => clearTimeout(t)
    }, [done, instant, replay, plan])

    useEffect(() => {
        if (!done) return
        onRead?.(letter.id)
        heartBurst({ particleCount: 30, spread: 70, origin: { y: 0.8 } })
    }, [done, letter.id, onRead])

    const toggleMark = (i, e) => {
        const on = !marked[i]
        setMarked((m) => ({ ...m, [i]: on }))
        if (on) {
            const r = e.currentTarget.getBoundingClientRect()
            heartBurst({
                particleCount: 10,
                spread: 50,
                startVelocity: 18,
                origin: { x: (r.left + 20) / window.innerWidth, y: (r.top + 16) / window.innerHeight },
            })
        }
    }

    const onKey = (i) => (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleMark(i, e)
        }
    }

    const replayAll = () => {
        setDone(false)
        setInstant(false)
        setMarked({})
        setReplay((r) => r + 1)
    }

    const { step } = plan

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative mx-auto mt-10 max-w-xl text-left"
        >
            {!done && (
                <div className="sticky top-20 z-30 -mb-2 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setInstant(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold shadow-lg backdrop-blur transition active:scale-95"
                    >
                        <FiFastForward /> Mostrar todo
                    </button>
                </div>
            )}

            {/* personajes asomados */}
            <motion.div
                animate={done ? { y: [0, -16, 0] } : { y: 0 }}
                transition={{ duration: 0.6 }}
                className="pointer-events-none absolute -left-2 -top-14 z-10 w-20 sm:-left-14 sm:w-28"
            >
                <Sticker name="characters/cinnamoroll" />
            </motion.div>
            <motion.div
                animate={done ? { y: [0, -16, 0] } : { y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="pointer-events-none absolute -right-2 -top-14 z-10 w-20 sm:-right-14 sm:w-28"
            >
                <Sticker name="characters/pompompurin" />
            </motion.div>

            {/* cintas washi */}
            <span aria-hidden className="absolute -top-3 left-6 z-20 h-6 w-20 -rotate-6 opacity-80 shadow-sm" style={WASHI} />
            <span aria-hidden className="absolute -top-3 right-8 z-20 h-6 w-20 rotate-5 opacity-80 shadow-sm" style={WASHI} />

            {/* papel que se desdobla */}
            <motion.div
                key={replay}
                initial={{ height: 140, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl shadow-2xl shadow-pink-300/40"
                style={PAPER}
            >
                {/* dobleces que se desvanecen */}
                <motion.div
                    aria-hidden
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 1.1, duration: 1.2 }}
                    className="pointer-events-none absolute inset-0 z-10"
                >
                    {[33.33, 66.66].map((p) => (
                        <span
                            key={p}
                            className="absolute inset-x-0 h-8 -translate-y-1/2 bg-linear-to-b from-transparent via-black/10 to-transparent"
                            style={{ top: `${p}%` }}
                        />
                    ))}
                </motion.div>

                {/* margen y perforaciones */}
                <span aria-hidden className="absolute bottom-0 left-9 top-0 w-px bg-pink-300/60 sm:left-12" />
                {[18, 50, 82].map((t) => (
                    <span key={t} aria-hidden className="absolute left-3 size-3 rounded-full bg-black/5 shadow-inner" style={{ top: `${t}%` }} />
                ))}

                {/* fecha y estampilla */}
                {letter.date && (
                    <span className="absolute left-12 top-5 font-title text-lg text-kw-ink/60 sm:left-16">
                        {longDate(letter.date)}
                    </span>
                )}
                <Stamp className="absolute right-4 top-4 w-12 rotate-3 sm:right-8 sm:w-14" />

                {/* texto */}
                <div
                    key={`${instant}-${replay}`}
                    className="pb-12 pl-12 pr-5 pt-16 font-title text-[1.25rem] leading-8 text-kw-ink sm:pl-16 sm:pr-10 sm:text-[1.4rem]"
                >
                    <p className="mb-8 text-[1.5rem] text-kw-pink-deep">
                        <Words text={letter.greeting} start={plan.greeting} step={step} instant={instant} />
                    </p>

                    {letter.paragraphs.map((p, i) => (
                        <p
                            key={i}
                            role="button"
                            tabIndex={0}
                            aria-pressed={!!marked[i]}
                            onClick={(e) => toggleMark(i, e)}
                            onKeyDown={onKey(i)}
                            className={`relative -mx-2 mb-8 cursor-pointer rounded-lg px-2 transition-colors ${marked[i] ? 'bg-kw-pink-soft/70' : 'hover:bg-kw-pink-soft/30'
                                }`}
                        >
                            {marked[i] && (
                                <motion.span
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', damping: 10 }}
                                    className="absolute -left-6 top-1.5 text-kw-pink-deep"
                                >
                                    <FiHeart className="fill-current" />
                                </motion.span>
                            )}
                            <Words text={p} start={plan.paragraphs[i]} step={step} instant={instant} />
                        </p>
                    ))}

                    <p className="mb-8 text-right">
                        <Words text={letter.closing} start={plan.closing} step={step} instant={instant} />
                    </p>

                    <motion.p
                        initial={instant ? false : { clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ delay: plan.sig, duration: 1.2, ease: 'easeInOut' }}
                        className="mb-8 text-right text-[1.7rem] text-kw-pink-deep"
                    >
                        {letter.signature}
                    </motion.p>

                    {letter.ps && (
                        <p className="mb-8 text-[1.1rem] text-kw-ink/80">
                            <Words text={letter.ps} start={plan.ps} step={step} instant={instant} />
                        </p>
                    )}

                    <div className="flex h-24 justify-end">
                        {done && (
                            <motion.span
                                initial={{ scale: 1.9, opacity: 0, rotate: -25 }}
                                animate={{ scale: 1, opacity: 1, rotate: -8 }}
                                transition={{ type: 'spring', damping: 11, stiffness: 160 }}
                            >
                                <WaxSeal tone={letter.tone} className="size-20 drop-shadow-lg" />
                            </motion.span>
                        )}
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {done && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8 text-center"
                    >
                        {!Object.values(marked).some(Boolean) && (
                            <p className="mb-4 text-sm font-semibold text-kw-ink/60">
                                Toca un párrafo para marcarlo con un corazón
                            </p>
                        )}

                        <div className="flex flex-wrap justify-center gap-3">
                            <button type="button" onClick={replayAll} className={ghostBtn}>
                                <FiRotateCcw /> Releer
                            </button>
                            <button type="button" onClick={onClose} className={ghostBtn}>
                                <FiX /> Cerrar el sobre
                            </button>
                            {hasNext && (
                                <button type="button" onClick={onNext} className={ghostBtn}>
                                    Siguiente carta <FiArrowRight />
                                </button>
                            )}
                            <ButtonLink to="/galeria" variant="blue">
                                Ver nuestra galería
                            </ButtonLink>
                        </div>

                        <ReplyBox letter={letter} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    )
}