import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import Polaroid from '../components/ui/Polaroid'
import Reveal from '../components/ui/Reveal'
import Lightbox from '../components/gallery/Lightbox'
import { GALLERY } from '../data/gallery'

const ROT = [-3, 2, -1.5, 3, -2, 1]

export default function Gallery() {
    const [open, setOpen] = useState(null)

    const close = useCallback(() => setOpen(null), [])
    const change = useCallback(
        (step) => setOpen((i) => (i === null ? i : (i + step + GALLERY.length) % GALLERY.length)),
        []
    )

    return (
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:pt-12">
            <header className="text-center">
                <h1 className="font-title text-4xl">
                    Nuestra galería <FiHeart className="inline text-kw-pink" />
                </h1>
                <p className="mt-1 text-kw-ink/80">{GALLERY.length} recuerdos que me hacen sonreír</p>
            </header>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
                {GALLERY.map((p, i) => (
                    <Reveal key={p.src} delay={(i % 3) * 0.08}>
                        <button
                            type="button"
                            onClick={() => setOpen(i)}
                            aria-label={`Ver foto: ${p.caption}`}
                            className="block w-full"
                            style={{ rotate: `${ROT[i % ROT.length]}deg` }}
                        >
                            <Polaroid src={p.src} caption={p.caption} />
                        </button>
                    </Reveal>
                ))}
            </div>

            <AnimatePresence>
                {open !== null && (
                    <Lightbox items={GALLERY} index={open} onClose={close} onChange={change} />
                )}
            </AnimatePresence>
        </section>
    )
}