import { motion } from 'framer-motion'
import { FiImage } from 'react-icons/fi'
import { resolveImage } from '../../assets'

export default function Polaroid({ src, caption, className = '', loading = 'lazy' }) {

    const url = resolveImage(src)

    return (
        <motion.figure
            whileHover={{ scale: 1.08 }}
            className={`rounded-md bg-white p-2 pb-3 shadow-lg shadow-slate-300/50 hover:z-10 ${className}`}
        >
            <div className="aspect-square overflow-hidden rounded bg-kw-pink-soft">
                {url ? (
                    <img
                        src={url}
                        alt={caption || 'Foto de nosotros'}
                        loading={loading}
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                        className="size-full object-cover"
                    />
                ) : (
                    <span className="grid size-full place-items-center text-4xl text-kw-pink/60">
                        <FiImage />
                    </span>
                )}
            </div>
            {caption && <figcaption className="mt-1 text-center font-title text-sm">{caption}</figcaption>}
        </motion.figure>
    )
}