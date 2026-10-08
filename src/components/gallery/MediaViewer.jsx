import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi'
import useSignedUrls from '../../hooks/useSignedUrls'
import { formatDate } from '../../utils/formatDate'

export default function MediaViewer({ items, index, onClose, onChange }) {
    const item = items[index]
    const prev = items[(index - 1 + items.length) % items.length]
    const next = items[(index + 1) % items.length]
    const [hd, setHd] = useState(false)

    const previewPath = (it) => (it.kind === 'image' ? it.path_medium : it.path_thumb)
    const urls = useSignedUrls(
        [
            item.kind === 'video' ? item.path_full : item.path_medium,
            item.kind === 'video' ? item.path_thumb : hd ? item.path_full : null,
            previewPath(prev),
            previewPath(next),
        ].filter(Boolean)
    )

    useEffect(() => {
        setHd(false)
    }, [index])

    useEffect(() => {
        for (const it of [prev, next]) {
            const u = it.kind === 'image' ? urls[it.path_medium] : null
            if (u) {
                const im = new Image()
                im.src = u
            }
        }
    }, [prev, next, urls])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') onChange(1)
            if (e.key === 'ArrowLeft') onChange(-1)
        }
        window.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [onClose, onChange])

    const stop = (e) => e.stopPropagation()
    const imageSrc = hd ? (urls[item.path_full] ?? urls[item.path_medium]) : urls[item.path_medium]
    const m = item.memory

    const round =
        'grid size-11 place-items-center rounded-full bg-white/90 text-xl text-kw-ink shadow-lg transition active:scale-90'

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] flex flex-col bg-kw-ink/85 backdrop-blur-sm"
        >
            <div className="flex items-center justify-between px-4 pt-4" onClick={stop}>
                <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-kw-ink shadow">
                    {index + 1} / {items.length}
                </span>
                <button type="button" onClick={onClose} aria-label="Cerrar" className={round}>
                    <FiX />
                </button>
            </div>

            <div className="relative grid min-h-0 flex-1 place-items-center px-3">
                <button
                    type="button"
                    onClick={(e) => {
                        stop(e)
                        onChange(-1)
                    }}
                    aria-label="Anterior"
                    className={`${round} absolute left-2 top-1/2 z-10 -translate-y-1/2`}
                >
                    <FiChevronLeft />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        stop(e)
                        onChange(1)
                    }}
                    aria-label="Siguiente"
                    className={`${round} absolute right-2 top-1/2 z-10 -translate-y-1/2`}
                >
                    <FiChevronRight />
                </button>

                <motion.div
                    key={item.id}
                    drag={item.kind === 'image' ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                        if (info.offset.x < -80) onChange(1)
                        else if (info.offset.x > 80) onChange(-1)
                    }}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={stop}
                    className="flex max-h-full max-w-full items-center justify-center"
                >
                    {item.kind === 'video' ? (
                        <video
                            key={item.id}
                            src={urls[item.path_full]}
                            poster={urls[item.path_thumb]}
                            controls
                            playsInline
                            preload="metadata"
                            className="max-h-[62dvh] max-w-full rounded-2xl bg-black shadow-2xl"
                        />
                    ) : (
                        <div
                            className="rounded-2xl bg-cover bg-center shadow-2xl"
                            style={item.blur ? { backgroundImage: `url(${item.blur})` } : undefined}
                        >
                            {imageSrc && (
                                <img
                                    src={imageSrc}
                                    alt={m.title}
                                    draggable={false}
                                    className="max-h-[62dvh] max-w-full rounded-2xl object-contain"
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            <div
                onClick={stop}
                className="max-h-[34dvh] overflow-y-auto rounded-t-4xl bg-white/95 px-5 pb-6 pt-4 shadow-2xl"
            >
                <div className="mx-auto max-w-2xl">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="font-title text-2xl leading-tight sm:text-3xl">{m.title}</h2>
                            <p className="text-xs font-semibold text-kw-ink/60">
                                {formatDate(m.memory_date)}
                                {m.author?.display_name && ` · subido por ${m.author.display_name}`}
                            </p>
                        </div>
                        {item.kind === 'image' && !hd && (
                            <button
                                type="button"
                                onClick={() => setHd(true)}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-kw-pink-soft px-3 py-1.5 text-xs font-bold text-kw-pink-deep transition active:scale-95"
                            >
                                <FiMaximize2 /> Calidad máxima
                            </button>
                        )}
                    </div>
                    {m.description && (
                        <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-relaxed text-kw-ink/80 sm:text-base">
                            {m.description}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}