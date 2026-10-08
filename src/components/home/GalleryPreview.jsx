import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Card from '../ui/Card'
import Polaroid from '../ui/Polaroid'
import ButtonLink from '../ui/ButtonLink'
import Sticker from '../ui/Sticker'
import useSignedUrls from '../../hooks/useSignedUrls'
import { fetchGalleryPage } from '../../lib/queries'

const SLOTS = [
    { rest: { rotate: -8, x: '-95%', y: '0%' }, open: { rotate: -14, x: '-108%', y: '-4%' } },
    { rest: { rotate: 7, x: '-5%', y: '-6%' }, open: { rotate: 13, x: '8%', y: '-10%' } },
    { rest: { rotate: -3, x: '-85%', y: '52%' }, open: { rotate: -7, x: '-98%', y: '56%' } },
    { rest: { rotate: 5, x: '-15%', y: '48%' }, open: { rotate: 9, x: '-2%', y: '52%' } },
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

    return (
        <Card tone="butter" tilt className="flex h-full flex-col">
            <h2 className="text-center font-title text-3xl">Nuestra galería</h2>

            <motion.div
                initial="rest"
                whileHover="open"
                whileTap="open"
                className="relative mx-auto mt-4 h-80 w-full max-w-xs grow"
            >
                {SLOTS.map((slot, i) => {
                    const photo = photos[i]
                    return (
                        <motion.div
                            key={i}
                            variants={slot}
                            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                            className="absolute left-1/2 top-0 w-[46%]"
                            style={{ zIndex: i }}
                        >
                            <Polaroid src={photo ? urls[photo.path] : undefined} caption={photo?.title} />
                        </motion.div>
                    )
                })}
                <span className="absolute bottom-0 left-4 z-10 -rotate-6 rounded bg-kw-pink-soft px-3 py-1 font-title text-base shadow">
                    Tú y yo siempre
                </span>
                <Sticker name="characters/pompompurin" float className="absolute -bottom-2 right-0 z-10 w-16" />
            </motion.div>

            <div className="mt-4 flex items-center justify-between">
                <ButtonLink to="/galeria" variant="butter">
                    Ver galería <FiArrowRight />
                </ButtonLink>
            </div>
        </Card>
    )
}