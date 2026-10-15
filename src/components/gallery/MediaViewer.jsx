
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    FiChevronLeft,
    FiChevronRight,
    FiMaximize2,
    FiX,
} from 'react-icons/fi'
import useSignedUrls from '../../hooks/useSignedUrls'
import { formatDate } from '../../utils/formatDate'

export default function MediaViewer({
    items,
    index,
    onClose,
    onChange,
}) {
    const [hd, setHd] = useState(false)

    const count = items?.length ?? 0
    const safeIndex =
        count > 0 ? ((index % count) + count) % count : 0

    const item = items?.[safeIndex]

    const prev =
        count > 0 ? items[(safeIndex - 1 + count) % count] : null

    const next =
        count > 0 ? items[(safeIndex + 1) % count] : null

    const previewPath = (media) =>
        media.kind === 'image'
            ? media.path_medium
            : media.path_thumb

    const paths = [
        item?.kind === 'video'
            ? item.path_full
            : item?.path_medium,
        item?.kind === 'video'
            ? item.path_thumb
            : hd
                ? item?.path_full
                : null,
        prev ? previewPath(prev) : null,
        next ? previewPath(next) : null,
    ].filter(Boolean)

    const urls = useSignedUrls(paths)

    useEffect(() => {
        setHd(false)
    }, [safeIndex])

    // Precarga las imágenes vecinas para que el cambio sea más fluido.
    useEffect(() => {
        if (!prev || !next) return

        for (const media of [prev, next]) {
            if (media.kind !== 'image') continue

            const url = urls[media.path_medium]

            if (url) {
                const image = new Image()
                image.src = url
            }
        }
    }, [prev, next, urls])

    // Bloquea el fondo sin perder la posición de scroll en móviles.
    // El bloqueo vive durante todo el montaje del visor y no se reinicia
    // al cambiar de recuerdo o cuando se actualizan las URL firmadas.
    useEffect(() => {
        const body = document.body
        const html = document.documentElement
        const scrollY = window.scrollY

        const previous = {
            bodyOverflow: body.style.overflow,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyLeft: body.style.left,
            bodyRight: body.style.right,
            bodyWidth: body.style.width,
            htmlOverflow: html.style.overflow,
            htmlScrollBehavior: html.style.scrollBehavior,
        }

        // En Android, overflow:hidden por sí solo puede no bloquear
        // correctamente el scroll del documento.
        html.style.overflow = 'hidden'
        html.style.scrollBehavior = 'auto'
        body.style.overflow = 'hidden'
        body.style.position = 'fixed'
        body.style.top = `-${scrollY}px`
        body.style.left = '0'
        body.style.right = '0'
        body.style.width = '100%'

        return () => {
            body.style.overflow = previous.bodyOverflow
            body.style.position = previous.bodyPosition
            body.style.top = previous.bodyTop
            body.style.left = previous.bodyLeft
            body.style.right = previous.bodyRight
            body.style.width = previous.bodyWidth
            html.style.overflow = previous.htmlOverflow

            // Restaura la posición antes de devolver el scroll suave del sitio.
            window.scrollTo(0, scrollY)
            html.style.scrollBehavior = previous.htmlScrollBehavior
        }
    }, [])

    // Los controles de teclado se actualizan aparte del bloqueo del scroll.
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                onClose()
                return
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault()
                onChange(1)
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                onChange(-1)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose, onChange])

    if (!item) return null

    const memory = item.memory

    const stop = (event) => {
        event.stopPropagation()
    }

    const navigate = (event, step) => {
        event.preventDefault()
        event.stopPropagation()
        onChange(step)
    }

    const imageSrc = hd
        ? urls[item.path_full] ?? urls[item.path_medium]
        : urls[item.path_medium]

    const round =
        'grid size-11 shrink-0 place-items-center rounded-full bg-white/95 text-xl text-kw-ink shadow-lg transition hover:scale-105 hover:bg-white active:scale-90'

    const canNavigate = count > 1

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] flex flex-col bg-kw-ink/95"
            role="dialog"
            aria-modal="true"
            aria-label="Visor de recuerdos"
        >
            {/* Barra superior */}
            <div
                className="relative z-20 flex items-center justify-between gap-3 px-4 pt-4"
                onClick={stop}
            >
                <span className="rounded-full bg-white/95 px-3 py-2 text-sm font-bold text-kw-ink shadow">
                    {safeIndex + 1} / {count}
                </span>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar galería"
                    className={round}
                >
                    <FiX />
                </button>
            </div>

            {/* Área de visualización */}
            <div
                className="relative grid min-h-0 flex-1 place-items-center px-14 py-3 sm:px-20"
                onClick={stop}
            >
                {/* Flecha anterior */}
                {canNavigate && (
                    <button
                        type="button"
                        onClick={(event) => navigate(event, -1)}
                        aria-label="Ver recuerdo anterior"
                        className={`${round} absolute left-2 top-1/2 z-30 -translate-y-1/2 sm:left-4`}
                    >
                        <FiChevronLeft />
                    </button>
                )}

                {/* Flecha siguiente */}
                {canNavigate && (
                    <button
                        type="button"
                        onClick={(event) => navigate(event, 1)}
                        aria-label="Ver recuerdo siguiente"
                        className={`${round} absolute right-2 top-1/2 z-30 -translate-y-1/2 sm:right-4`}
                    >
                        <FiChevronRight />
                    </button>
                )}

                <motion.div
                    key={`${item.id}-${item.path_thumb}`}
                    drag={item.kind === 'image' ? 'x' : false}
                    dragDirectionLock
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                        if (info.offset.x < -80) onChange(1)
                        if (info.offset.x > 80) onChange(-1)
                    }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={stop}
                    className="flex max-h-full max-w-full touch-pan-y items-center justify-center"
                >
                    {item.kind === 'video' ? (
                        <video
                            key={`${item.id}-${item.path_full}`}
                            src={urls[item.path_full]}
                            poster={urls[item.path_thumb]}
                            controls
                            playsInline
                            preload="metadata"
                            className="max-h-[58dvh] max-w-full rounded-2xl bg-black shadow-2xl sm:max-h-[64dvh]"
                        >
                            Tu navegador no puede reproducir este video.
                        </video>
                    ) : (
                        <div
                            className="flex max-h-full max-w-full items-center justify-center rounded-2xl bg-black/20 shadow-2xl"
                            style={
                                item.blur
                                    ? {
                                        backgroundImage: `url(${item.blur})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }
                                    : undefined
                            }
                        >
                            {imageSrc ? (
                                <img
                                    key={`${item.id}-${imageSrc}`}
                                    src={imageSrc}
                                    alt={memory.title}
                                    draggable={false}
                                    loading="eager"
                                    decoding="async"
                                    fetchPriority={hd ? 'high' : 'auto'}
                                    className="max-h-[58dvh] max-w-full rounded-2xl object-contain sm:max-h-[64dvh]"
                                />
                            ) : (
                                <div className="grid min-h-48 min-w-48 place-items-center rounded-2xl bg-white/10 px-6 text-center text-sm font-semibold text-white">
                                    Cargando recuerdo...
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Información del recuerdo */}
            <div
                onClick={stop}
                className="relative z-20 max-h-[34dvh] overflow-y-auto overscroll-contain rounded-t-4xl bg-white/95 px-5 pb-6 pt-4 shadow-2xl"
            >
                <div className="mx-auto max-w-2xl">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h2 className="break-words font-title text-2xl leading-tight text-kw-ink sm:text-3xl">
                                {memory.title}
                            </h2>

                            <p className="mt-1 text-xs font-semibold text-kw-ink/60">
                                {formatDate(memory.memory_date)}
                                {memory.author?.display_name &&
                                    ` · subido por ${memory.author.display_name}`}
                            </p>
                        </div>

                        {item.kind === 'image' &&
                            !hd &&
                            item.path_full && (
                                <button
                                    type="button"
                                    onClick={() => setHd(true)}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-kw-pink-soft px-3 py-2 text-xs font-bold text-kw-pink-deep transition hover:brightness-95 active:scale-95"
                                >
                                    <FiMaximize2 />
                                    Calidad máxima
                                </button>
                            )}
                    </div>

                    {memory.description && (
                        <p className="mt-3 whitespace-pre-line break-words text-sm font-semibold leading-relaxed text-kw-ink/80 sm:text-base">
                            {memory.description}
                        </p>
                    )}

                    {canNavigate && (
                        <p className="mt-4 text-center text-xs font-semibold text-kw-ink/50">
                            Usa las flechas para recorrer sus recuerdos ♡
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
