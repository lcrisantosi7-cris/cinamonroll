import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiImage, FiHeart, FiCalendar, FiMessageCircle, FiGift, FiCloud, FiClock, FiStar, FiSmile } from 'react-icons/fi'
import Sticker from '../ui/Sticker'
import AssetIcon from '../ui/AssetIcon'

const TONES = {
    pink: 'from-pink-50 to-pink-200 border-pink-200 text-pink-500',
    sky: 'from-sky-50 to-sky-200 border-sky-200 text-sky-500',
    rose: 'from-rose-50 to-rose-200 border-rose-200 text-rose-500',
    blue: 'from-blue-50 to-blue-200 border-blue-200 text-blue-500',
    purple: 'from-purple-50 to-purple-200 border-purple-200 text-purple-500',
    butter: 'from-amber-50 to-amber-200 border-amber-200 text-amber-600',
}

const ITEMS = [
    { label: 'Carta para ti', short: 'Carta', to: '/carta', asset: 'icons/carta', fallback: FiMail, tone: 'pink' },
    { label: 'Galería de fotos', short: 'Galería', to: '/galeria', asset: 'icons/galeria', fallback: FiImage, tone: 'sky' },
    { label: 'Cosas que amo de ti', short: 'Lo que amo', to: '/cosas-que-amo', asset: 'icons/cosas-que-amo', fallback: FiHeart, tone: 'rose' },
    { label: 'Nuestra historia', short: 'Historia', to: '/historia', asset: 'icons/historia', fallback: FiCalendar, tone: 'blue' },
    { label: 'Mensajes sorpresa', short: 'Mensajes', to: '/mensajes', asset: 'icons/mensajes', fallback: FiMessageCircle, tone: 'purple' },
    { label: 'Sorpresa final', short: 'Sorpresa', to: '/sorpresa', asset: 'icons/sorpresa', fallback: FiGift, tone: 'pink' },
    { label: 'Juego Cinnamoroll', short: 'Cinnamoroll', to: '/juegos/cinnamoroll', asset: 'icons/juego-cinnamoroll', fallback: FiCloud, tone: 'sky' },
    { label: 'Juego Fresitas', short: 'Fresitas', to: '/juegos/fresitas', asset: 'icons/juego-fresitas', fallback: FiStar, tone: 'rose' },
    { label: 'Juego Flanes', short: 'Flanes', to: '/juegos/pompompurin', asset: 'icons/juego-flanes', fallback: FiSmile, tone: 'butter' },
    { label: 'Contador juntos', short: 'Contador', href: '#contador', asset: 'icons/contador', fallback: FiClock, tone: 'rose' },
]

function Tile({ item, i }) {
    const { label, short, to, href, asset, fallback, tone } = item
    const Tag = to ? Link : 'a'
    const target = to ? { to } : { href }

    return (
        <motion.li
            initial={{ opacity: 0, y: 18, scale: 0.85 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.05, type: 'spring', damping: 16 }}
            whileTap={{ scale: 0.92 }}
        >
            <Tag
                {...target}
                className="group flex h-full flex-col items-center gap-1.5 rounded-2xl p-1.5 text-center sm:p-2"
            >
                <span
                    className={`grid size-14 place-items-center rounded-2xl border-2 bg-linear-to-br shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:animate-wiggle sm:size-16 ${TONES[tone]}`}
                >
                    <AssetIcon name={asset} fallback={fallback} className="text-2xl" imgClassName="size-9 object-contain sm:size-11" />
                </span>
                <span className="text-[11px] font-bold leading-tight transition-colors group-hover:text-kw-pink-deep sm:text-xs">
                    <span className="md:hidden">{short}</span>
                    <span className="hidden md:inline">{label}</span>
                </span>
            </Tag>
        </motion.li>
    )
}

export default function QuickMenu() {
    return (
        <section id="menu" className="relative mx-auto mt-16 max-w-7xl scroll-mt-24 px-4">
            <Sticker name="decor/bow" float className="absolute -top-8 left-1/2 z-10 w-16 -translate-x-1/2 sm:w-20" />
            <ul className="grid grid-cols-5 gap-1 rounded-[2rem] border-2 border-dashed border-kw-sky-deep/60 bg-white/75 p-3 pt-6 shadow-xl backdrop-blur-md lg:grid-cols-10">
                {ITEMS.map((item, i) => (
                    <Tile key={item.label} item={item} i={i} />
                ))}
            </ul>
        </section>
    )
}