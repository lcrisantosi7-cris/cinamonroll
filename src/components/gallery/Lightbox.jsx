import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'

export default function Lightbox({ items, index, onClose, onChange }) {
    const item = items[index]

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

    const stop = (fn) => (e) => {
        e.stopPropagation()
        fn()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] grid place-items-center bg-kw-ink/70 p-4 backdrop-blur-sm"
        >
            <button
                type="button"
                onClick={stop(onClose)}
                aria-label="Cerrar"
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/90 text-xl text-kw-ink shadow-lg"
            >
                <FiX />
            </button>
            <button
                type="button"
                onClick={stop(() => onChange(-1))}
                aria-label="Anterior"
                className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-kw-ink shadow-lg sm:left-6"
            >
                <FiChevronLeft />
            </button>
            <button
                type="button"
                onClick={stop(() => onChange(1))}
                aria-label="Siguiente"
                className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-kw-ink shadow-lg sm:right-6"
            >
                <FiChevronRight />
            </button>

            <motion.figure
                key={index}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                    if (info.offset.x < -80) onChange(1)
                    else if (info.offset.x > 80) onChange(-1)
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl rounded-md bg-white p-3 pb-4 shadow-2xl"
            >
                <img
                    src={item.src}
                    alt={item.caption || 'Foto de nosotros'}
                    draggable={false}
                    className="max-h-[70dvh] w-full rounded bg-kw-pink-soft object-contain"
                />
                <figcaption className="mt-2 text-center font-title text-xl">{item.caption}</figcaption>
                <p className="text-center text-xs text-kw-ink/60">
                    {index + 1} / {items.length}
                </p>
            </motion.figure>
        </motion.div>
    )
}