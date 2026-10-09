import { img, resolveImage } from '../../assets'

export default function Sticker({ name, src, alt = '', className = '', float = false, delay = 0 }) {
    const url = name ? img(name) : resolveImage(src)
    if (!url) return null

    return (
        <img
            src={url}
            alt={alt}
            draggable={false}
            decoding="async"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            className={`pointer-events-none select-none drop-shadow-md ${float ? 'animate-float' : ''} ${className}`}
            style={float && delay ? { animationDelay: `${delay}s` } : undefined}
        />
    )
}