import { motion } from 'framer-motion'
import { img, resolveImage } from '../../assets'

export default function Sticker({ name, src, alt = '', className = '', float = false, delay = 0 }) {
    const url = name ? img(name) : resolveImage(src)
    if (!url) return null

    return (
        <motion.img
            src={url}
            alt={alt}
            draggable={false}
            decoding="async"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            className={`pointer-events-none select-none drop-shadow-md ${className}`}
            animate={float ? { y: [0, -6, 0] } : undefined}
            transition={float ? { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } : undefined}
        />
    )
}