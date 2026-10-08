import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { FiHeart, FiPlay, FiPlus } from 'react-icons/fi'
import BlurImage from '../components/ui/BlurImage'
import MediaViewer from '../components/gallery/MediaViewer'
import useSignedUrls from '../hooks/useSignedUrls'
import { fetchGalleryPage } from '../lib/queries'

const ROT = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']
const FILTERS = [
    ['all', 'Todo'],
    ['image', 'Fotos'],
    ['video', 'Videos'],
]

const fmtDuration = (s) => {
    if (!s) return ''
    const m = Math.floor(s / 60)
    return `${m}:${String(Math.round(s % 60)).padStart(2, '0')}`
}

export default function Gallery() {
    const q = useInfiniteQuery({
        queryKey: ['memories', 'gallery'],
        queryFn: ({ pageParam }) => fetchGalleryPage(pageParam),
        initialPageParam: 0,
        getNextPageParam: (last, all) => (last.hasMore ? all.length : undefined),
    })

    const [filter, setFilter] = useState('all')
    const [open, setOpen] = useState(null)

    const all = useMemo(
        () =>
            (q.data?.pages ?? [])
                .flatMap((p) => p.items)
                .flatMap((m) => m.media.map((md) => ({ ...md, memory: m }))),
        [q.data]
    )
    const shown = useMemo(
        () => (filter === 'all' ? all : all.filter((x) => x.kind === filter)),
        [all, filter]
    )
    const urls = useSignedUrls(shown.map((x) => x.path_thumb))

    const sentinel = useRef(null)
    const inView = useInView(sentinel, { margin: '500px' })
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = q
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const close = useCallback(() => setOpen(null), [])
    const change = useCallback(
        (step) => setOpen((i) => (i === null ? i : (i + step + shown.length) % shown.length)),
        [shown.length]
    )

    return (
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:pt-12">
            <header className="text-center">
                <h1 className="font-title text-[clamp(2.4rem,8vw,4rem)] leading-none">
                    Nuestra galería <FiHeart className="inline text-kw-pink" />
                </h1>
                <p className="mt-2 font-semibold text-kw-ink/80">
                    {all.length > 0
                        ? `${all.length} recuerdos${hasNextPage ? ' y más' : ''}`
                        : 'Los momentos que queremos guardar'}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {FILTERS.map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setFilter(key)}
                            aria-pressed={filter === key}
                            className={`rounded-full px-4 py-1.5 text-sm font-bold shadow transition active:scale-95 ${filter === key ? 'bg-kw-pink text-white' : 'bg-white/80 text-kw-ink'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                    <Link
                        to="/panel"
                        className="inline-flex items-center gap-1.5 rounded-full bg-kw-butter px-4 py-1.5 text-sm font-bold text-amber-900 shadow transition active:scale-95"
                    >
                        <FiPlus /> Agregar
                    </Link>
                </div>
            </header>

            {q.isPending && (
                <ul className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <li key={i} className="mb-4 break-inside-avoid">
                            <div
                                className="animate-pulse rounded-md bg-white/70 shadow"
                                style={{ height: `${150 + ((i * 53) % 90)}px` }}
                            />
                        </li>
                    ))}
                </ul>
            )}

            {q.isError && (
                <div className="mx-auto mt-10 max-w-md rounded-3xl bg-white/80 p-6 text-center shadow">
                    <p className="font-bold text-rose-500">No se pudo cargar la galería.</p>
                    <button
                        type="button"
                        onClick={() => q.refetch()}
                        className="mt-3 rounded-full bg-kw-pink px-5 py-2 font-bold text-white shadow transition active:scale-95"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!q.isPending && !q.isError && shown.length === 0 && (
                <div className="mx-auto mt-10 max-w-md rounded-4xl border-2 border-dashed border-kw-pink/70 bg-white/80 p-8 text-center shadow-lg">
                    <p className="font-title text-3xl">Todavía no hay recuerdos aquí</p>
                    <p className="mt-2 text-sm font-semibold text-kw-ink/70">
                        Sube la primera foto o el primer video desde el panel.
                    </p>
                    <Link
                        to="/panel"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-kw-pink px-6 py-2.5 font-bold text-white shadow-lg transition active:scale-95"
                    >
                        <FiPlus /> Subir un recuerdo
                    </Link>
                </div>
            )}

            <ul className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4">
                {shown.map((it, i) => (
                    <motion.li
                        key={it.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 break-inside-avoid"
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(i)}
                            aria-label={`Ver ${it.memory.title}`}
                            className="group block w-full text-left"
                        >
                            <figure
                                className={`rounded-md bg-white p-2 pb-3 shadow-lg shadow-slate-300/50 transition duration-300 group-hover:-translate-y-1 group-hover:rotate-0 ${ROT[i % ROT.length]}`}
                            >
                                <div className="relative">
                                    <BlurImage
                                        src={urls[it.path_thumb]}
                                        blur={it.blur}
                                        alt={it.memory.title}
                                        className="w-full rounded"
                                        style={{
                                            aspectRatio: it.width && it.height ? `${it.width} / ${it.height}` : '4 / 5',
                                        }}
                                    />
                                    {it.kind === 'video' && (
                                        <span className="absolute inset-0 grid place-items-center">
                                            <span className="grid size-12 place-items-center rounded-full bg-white/90 text-xl text-kw-pink-deep shadow-lg">
                                                <FiPlay className="translate-x-px" />
                                            </span>
                                            {it.duration_s && (
                                                <span className="absolute bottom-1.5 right-1.5 rounded-full bg-kw-ink/70 px-2 py-0.5 text-[11px] font-bold text-white">
                                                    {fmtDuration(it.duration_s)}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                                <figcaption className="mt-2 truncate text-center font-title text-lg">
                                    {it.memory.title}
                                </figcaption>
                            </figure>
                        </button>
                    </motion.li>
                ))}
            </ul>

            <div ref={sentinel} className="mt-6 text-center text-sm font-bold text-kw-ink/60">
                {isFetchingNextPage && 'Cargando más...'}
            </div>

            <AnimatePresence>
                {open !== null && shown[open] && (
                    <MediaViewer items={shown} index={open} onClose={close} onChange={change} />
                )}
            </AnimatePresence>
        </section>
    )
}