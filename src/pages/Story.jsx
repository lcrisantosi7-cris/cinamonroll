import { useCallback, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { FiArrowDown, FiHeart, FiPlus } from 'react-icons/fi'
import TimelineItem from '../components/story/TimelineItem'
import MediaViewer from '../components/gallery/MediaViewer'
import PageLoader from '../components/ui/PageLoader'
import Sparkle from '../components/ui/Sparkle'
import { Duo } from '../components/ui/Mascots'
import useDaysTogether from '../hooks/useDaysTogether'
import useMedia from '../hooks/useMedia'
import useSignedUrls from '../hooks/useSignedUrls'
import { fetchTimeline } from '../lib/queries'
import { img } from '../assets'

const monthLabel = (iso) => {
    const s = new Date(`${iso}T00:00:00`).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
    return s.charAt(0).toUpperCase() + s.slice(1)
}
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5)
const gapLabel = (d) => {
    if (d === 1) return '1 día después'
    if (d < 60) return `${d} días después`
    return `${Math.round(d / 30.4)} meses después`
}

function buildRows(list) {
    const rows = []
    let n = 0
    let prev = null
    let lastKey = null
    list.forEach((m) => {
        if (prev) {
            const d = daysBetween(prev.memory_date, m.memory_date)
            if (d > 0) rows.push({ type: 'gap', key: `g-${m.id}`, days: d })
        }
        const key = m.memory_date.slice(0, 7)
        if (key !== lastKey) {
            rows.push({ type: 'month', key: `m-${key}`, label: monthLabel(m.memory_date) })
            lastKey = key
        }
        rows.push({ type: 'item', key: m.id, item: m, index: n++ })
        prev = m
    })
    return rows
}

function Traveler() {
    const url = img('characters/cinnamoroll')
    return (
        <motion.div
            animate={{ y: [0, -5, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
            {url ? (
                <img src={url} alt="" draggable={false} className="w-12 drop-shadow-lg md:w-16" />
            ) : (
                <span className="grid size-9 place-items-center rounded-full bg-kw-pink text-white shadow-lg">
                    <FiHeart />
                </span>
            )}
        </motion.div>
    )
}

function Pill({ children }) {
    return (
        <span className="rounded-full border-2 border-white bg-white/80 px-4 py-1.5 text-sm font-bold shadow">
            {children}
        </span>
    )
}

// Aislado para que el contador en vivo no vuelva a dibujar toda la línea
function StoryStats({ count }) {
    const { days, months, restDays } = useDaysTogether()
    return (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Pill>{days} días juntos</Pill>
            <Pill>
                {months} {months === 1 ? 'mes' : 'meses'} y {restDays} {restDays === 1 ? 'día' : 'días'}
            </Pill>
            <Pill>
                {count} {count === 1 ? 'recuerdo' : 'recuerdos'}
            </Pill>
        </div>
    )
}

function MonthChip({ label }) {
    return (
        <li className="relative mb-6 mt-2 pl-16 md:pl-0 md:text-center">
            <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 inline-block rounded-full border-2 border-white bg-white/90 px-5 py-1.5 font-title text-xl shadow-lg"
            >
                {label}
            </motion.span>
        </li>
    )
}

function GapBadge({ days }) {
    return (
        <li className="relative mb-6 pl-16 md:pl-0 md:text-center">
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-10 inline-block rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-kw-ink/70"
            >
                {gapLabel(days)}
            </motion.span>
        </li>
    )
}

export default function Story() {
    const wide = useMedia('(min-width: 768px)')
    const wrapRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 0.65', 'end 0.65'] })
    const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
    const top = useTransform(p, [0, 1], ['0%', '100%'])

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ['memories', 'timeline'],
        queryFn: fetchTimeline,
    })

    const list = useMemo(() => data ?? [], [data])
    const rows = useMemo(() => buildRows(list), [list])
    const latestId = list.at(-1)?.id
    const urls = useSignedUrls(list.flatMap((m) => m.media.slice(0, 3).map((x) => x.path_thumb)))

    const [box, setBox] = useState(null)
    const openBox = useCallback((items) => setBox({ items, index: 0 }), [])
    const closeBox = useCallback(() => setBox(null), [])
    const changeBox = useCallback(
        (step) =>
            setBox((b) => b && { ...b, index: (b.index + step + b.items.length) % b.items.length }),
        []
    )

    const goLatest = () =>
        document
            .getElementById(`hito-${latestId}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    return (
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:pt-12">
            <header className="text-center">
                <h1 className="font-title text-[clamp(2.4rem,8vw,4rem)] leading-none">
                    Nuestra historia <FiHeart className="inline text-kw-pink" />
                </h1>
                <p className="mt-2 font-semibold text-kw-ink/80">Cada capítulo, desde el primer día</p>
                <StoryStats count={list.length} />
                {latestId && (
                    <button
                        type="button"
                        onClick={goLatest}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-kw-pink px-6 py-2.5 font-bold text-white shadow-lg shadow-pink-300/60 transition hover:-translate-y-0.5 active:scale-95"
                    >
                        <FiArrowDown /> Ir al último recuerdo
                    </button>
                )}
            </header>

            {isPending && <PageLoader />}

            {isError && (
                <div className="mx-auto mt-10 max-w-md rounded-3xl bg-white/80 p-6 text-center shadow">
                    <p className="font-bold text-rose-500">No se pudo cargar la historia.</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-3 rounded-full bg-kw-pink px-5 py-2 font-bold text-white shadow transition active:scale-95"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!isPending && !isError && list.length === 0 && (
                <div className="mx-auto mt-10 max-w-md rounded-4xl border-2 border-dashed border-kw-pink/70 bg-white/80 p-8 text-center shadow-lg">
                    <p className="font-title text-3xl">Nuestra historia empieza aquí</p>
                    <p className="mt-2 text-sm font-semibold text-kw-ink/70">
                        Crea un recuerdo en el panel y marca "Mostrar en la línea de tiempo".
                    </p>
                    <Link
                        to="/panel"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-kw-pink px-6 py-2.5 font-bold text-white shadow-lg transition active:scale-95"
                    >
                        <FiPlus /> Agregar el primero
                    </Link>
                </div>
            )}

            {list.length > 0 && (
                <div ref={wrapRef} className="relative mt-12">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-6 w-1 -translate-x-1/2 md:left-1/2"
                    >
                        <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-kw-sky-deep/50" />
                        <motion.span
                            style={{ scaleY: p }}
                            className="absolute inset-y-0 left-0 w-1 origin-top rounded-full bg-linear-to-b from-kw-sky-deep via-kw-pink to-kw-butter-deep shadow-[0_0_12px_rgba(255,143,184,0.6)]"
                        />
                        <motion.div
                            style={{ top }}
                            className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                        >
                            <Traveler />
                        </motion.div>
                    </div>

                    <ol className="relative">
                        {rows.map((r) => {
                            if (r.type === 'month') return <MonthChip key={r.key} label={r.label} />
                            if (r.type === 'gap') return <GapBadge key={r.key} days={r.days} />
                            return (
                                <TimelineItem
                                    key={r.key}
                                    item={r.item}
                                    index={r.index}
                                    latest={r.item.id === latestId}
                                    wide={wide}
                                    urls={urls}
                                    onPhotos={openBox}
                                />
                            )
                        })}

                        <li className="relative pl-16 md:pl-0 md:text-center">
                            <span className="absolute left-6 top-0 z-10 -translate-x-1/2 md:left-1/2">
                                <span className="relative grid size-12 place-items-center rounded-full border-4 border-white bg-linear-to-br from-amber-100 to-kw-butter-deep text-amber-700 shadow-lg md:size-14">
                                    <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-kw-butter-deep/40" />
                                    <Sparkle className="relative size-6 animate-twinkle" />
                                </span>
                            </span>
                            <div className="pt-16 md:pt-20">
                                <p className="font-title text-3xl text-kw-pink-deep">Y lo mejor está por venir</p>
                                <p className="mt-1 text-sm font-semibold text-kw-ink/70">
                                    Lo que sigue lo escribimos juntos
                                </p>
                                <Duo className="mt-4 justify-start md:justify-center" />
                            </div>
                        </li>
                    </ol>
                </div>
            )}

            <AnimatePresence>
                {box && (
                    <MediaViewer items={box.items} index={box.index} onClose={closeBox} onChange={changeBox} />
                )}
            </AnimatePresence>
        </section>
    )
}