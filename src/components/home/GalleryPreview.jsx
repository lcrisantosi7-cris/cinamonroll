import { useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, useInView } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Card from '../ui/Card'
import Polaroid from '../ui/Polaroid'
import ButtonLink from '../ui/ButtonLink'
import Sticker from '../ui/Sticker'
import useSignedUrls from '../../hooks/useSignedUrls'
import { fetchGalleryPage } from '../../lib/queries'

// rest = montoncito en el centro · open = abanico que se ve completo
const SLOTS = [
    { rest: { rotate: -6, x: '-52%', y: '28%' }, open: { rotate: -9, x: '-106%', y: '-2%' } },
    { rest: { rotate: 5, x: '-48%', y: '22%' }, open: { rotate: 8, x: '6%', y: '-6%' } },
    { rest: { rotate: -2, x: '-50%', y: '26%' }, open: { rotate: -5, x: '-98%', y: '92%' } },
    { rest: { rotate: 3, x: '-50%', y: '24%' }, open: { rotate: 6, x: '-2%', y: '88%' } },
]

export default function GalleryPreview() {
    const { data } = useQuery({
        queryKey: ['memories', 'gallery-preview'],
        queryFn: () => fetchGalleryPage(0),
    })

    const photos = useMemo(
        () =>
            (data?.items ?? [])
                .flatMap((m) => m.media.filter((x) => x.path_thumb).map((x) => ({ path: x.path_thumb, title: m.title })))
                .slice(0, 4),
        [data]
    )
    const urls = useSignedUrls(photos.map((p) => p.path))

    // Al llegar con el dedo a esta sección, las fotos se abren solas
    const ref = useRef(null)
    const open = useInView(ref, { once: true, amount: 0.45 })

    return (
        <Card tone="butter" tilt className="flex h-full flex-col">
            <h2 className="text-center font-title text-3xl">Nuestra galería</h2>

            <motion.div
                ref={ref}
                initial="rest"
                animate={open ? 'open' : 'rest'}
                className="relative mx-auto mt-4 h-[23rem] w-full max-w-xs grow"
            >
                {SLOTS.map((slot, i) => {
                    const photo = photos[i]
                    return (
                        <motion.div
                            key={i}
                            variants={slot}
                            transition={{ type: 'spring', stiffness: 140, damping: 16, delay: i * 0.08 }}
                            className="absolute left-1/2 top-0 w-[46%]"
                            style={{ zIndex: i }}
                        >
                            <Polaroid
                                src={photo ? urls[photo.path] : undefined}
                                caption={photo?.title}
                                loading="eager"
                            />
                        </motion.div>
                    )
                })}
                <span className="absolute bottom-0 left-4 z-10 -rotate-6 rounded bg-kw-pink-soft px-3 py-1 font-title text-base shadow">
                    Tú y yo siempre
                </span>
                <Sticker name="characters/pompompurin" float className="absolute -bottom-3 right-0 z-10 w-16" />
            </motion.div>

            <div className="mt-4 flex items-center justify-between">
                <ButtonLink to="/galeria" variant="butter">
                    Ver galería <FiArrowRight />
                </ButtonLink>
            </div>
        </Card>
    )
}