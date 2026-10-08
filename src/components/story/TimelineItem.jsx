import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCamera } from 'react-icons/fi'
import Card from '../ui/Card'
import Polaroid from '../ui/Polaroid'
import NodeIcon from './NodeIcon'
import { formatDate } from '../../utils/formatDate'

const TONES = ['pink', 'blue', 'butter']
const ROT = [-4, 3, -1]
const WASHI = {
    backgroundImage: 'repeating-linear-gradient(45deg, #ffd1e3 0 8px, #ffffff 8px 16px)',
}

function PhotoStack({ media, urls, onOpen }) {
    const shown = media.slice(0, 3)

    return (
        <motion.button
            type="button"
            onClick={onOpen}
            initial="rest"
            whileHover="open"
            whileTap="open"
            aria-label={`Ver ${media.length} ${media.length === 1 ? 'archivo' : 'archivos'}`}
            className="relative mx-auto mt-4 block h-64 w-full max-w-[15rem]"
        >
            <span
                aria-hidden
                className="absolute -top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rotate-3 opacity-80 shadow-sm"
                style={WASHI}
            />
            {shown.map((p, i) => (
                <motion.span
                    key={p.id}
                    variants={{
                        rest: { rotate: ROT[i], x: i * 6, y: i * 4 },
                        open: { rotate: ROT[i] * 2.2, x: i * 22 - 18, y: i * 4 },
                    }}
                    transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                    className="absolute inset-x-6 top-2 block"
                    style={{ zIndex: shown.length - i }}
                >
                    <Polaroid src={urls[p.path_thumb]} />
                </motion.span>
            ))}
            <span className="absolute bottom-0 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold shadow">
                <FiCamera /> {media.length}
            </span>
        </motion.button>
    )
}

export default function TimelineItem({ item, index, latest, wide, urls, onPhotos }) {
    const right = index % 2 === 1
    const nodeRef = useRef(null)
    const active = useInView(nodeRef, { margin: '-45% 0px -45% 0px' })
    const reached = useInView(nodeRef, { once: true, margin: '0px 0px -50% 0px' })

    return (
        <li
            id={`hito-${item.id}`}
            className="relative mb-10 pl-16 md:mb-14 md:grid md:grid-cols-2 md:gap-x-20 md:pl-0"
        >
            <span ref={nodeRef} className="absolute left-6 top-6 z-10 -translate-x-1/2 md:left-1/2">
                <motion.span
                    animate={{ scale: active ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className={`relative grid size-12 place-items-center rounded-full border-4 border-white shadow-lg transition-colors duration-500 md:size-14 ${reached
                            ? 'bg-linear-to-br from-pink-200 to-kw-butter text-kw-pink-deep'
                            : 'bg-linear-to-br from-sky-100 to-sky-200 text-kw-ink/60'
                        }`}
                >
                    {(latest || active) && (
                        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-kw-pink/30" />
                    )}
                    <span className="relative">
                        <NodeIcon iconKey={item.icon} className="size-8 md:size-9" />
                    </span>
                </motion.span>
            </span>

            <motion.div
                initial={{ opacity: 0, y: 30, x: wide ? (right ? 40 : -40) : 0 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={right ? 'md:col-start-2' : 'md:col-start-1'}
            >
                <Card tone={TONES[index % TONES.length]} tilt className="text-left">
                    <span className="inline-block rounded-full bg-white/80 px-3 py-0.5 text-xs font-extrabold text-kw-ink/80">
                        {formatDate(item.memory_date)}
                    </span>
                    <h3 className="mt-2 font-title text-2xl leading-tight sm:text-3xl">{item.title}</h3>
                    {item.description && (
                        <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-relaxed text-kw-ink/80 sm:text-base">
                            {item.description}
                        </p>
                    )}
                    {item.media.length > 0 && (
                        <PhotoStack
                            media={item.media}
                            urls={urls}
                            onOpen={() => onPhotos(item.media.map((md) => ({ ...md, memory: item })))}
                        />
                    )}
                </Card>
            </motion.div>
        </li>
    )
}