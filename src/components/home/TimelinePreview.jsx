import { motion } from 'framer-motion'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import Card from '../ui/Card'
import ButtonLink from '../ui/ButtonLink'
import Sticker from '../ui/Sticker'
import { TIMELINE_VISIBLE } from '../../data/timeline'
import { formatDate } from '../../utils/formatDate'

function Node({ icon: Icon, title, when, i, last = false }) {
    return (
        <motion.li
            initial={{ opacity: 0, scale: 0.5, y: 14 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.2 + i * 0.15, type: 'spring', damping: 14 }}
            className="min-w-[7.5rem] snap-center text-center md:min-w-0"
        >
            <span className="relative mx-auto grid size-14 place-items-center">
                {last && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-kw-pink/30" />}
                <motion.span
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    className={`relative grid size-14 place-items-center rounded-full border-4 border-white text-2xl shadow-lg ${last ? 'bg-linear-to-br from-amber-100 to-kw-butter-deep text-amber-700' : 'bg-linear-to-br from-sky-100 to-sky-300 text-kw-ink'
                        }`}
                >
                    <Icon />
                </motion.span>
            </span>
            <p className="mt-2 text-xs font-bold leading-tight sm:text-sm">{title}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-kw-ink/70">{when}</p>
        </motion.li>
    )
}

export default function TimelinePreview() {
    return (
        <Card tone="blue" tilt className="h-full">
            <h2 className="font-title text-3xl">Nuestra historia</h2>

            <div className="relative mt-6">
                <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute left-10 right-10 top-7 origin-left border-t-2 border-dashed border-kw-sky-deep/70"
                />
                <ul className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] 
                [-webkit-mask-image:linear-gradient(to_right,black_85%,transparent)] [mask-image:linear-gradient(to_right,black_85%,transparent)] 
                md:grid md:grid-cols-5 md:overflow-visible md:[-webkit-mask-image:none] md:[mask-image:none]">
                    {TIMELINE_VISIBLE.slice(0, 4).map((m, i) => (
                        <Node key={m.id} icon={m.icon} title={m.title} when={m.date ? formatDate(m.date) : 'Por definir'} i={i} />
                    ))}
                    <Node icon={FiStar} title="Más momentos juntos" when="en adelante..." i={4} last />
                </ul>
            </div>

            <div className="mt-4 flex items-end justify-between">
                <ButtonLink to="/historia" variant="blue">
                    Ver historia completa <FiArrowRight />
                </ButtonLink>
                <Sticker name="characters/cinnamoroll" float className="w-16 sm:w-20" />
            </div>
        </Card>
    )
}