import { useState } from 'react'

export default function BlurImage({ src, blur, alt = '', className = '', imgClassName = '', style }) {
    const [loaded, setLoaded] = useState(false)

    return (
        <div className={`relative overflow-hidden bg-kw-pink-soft ${className}`} style={style}>
            {blur && (
                <div
                    aria-hidden
                    className="absolute inset-0 scale-110 blur-lg"
                    style={{ backgroundImage: `url(${blur})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
            )}
            {src && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    onLoad={() => setLoaded(true)}
                    className={`relative size-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'
                        } ${imgClassName}`}
                />
            )}
        </div>
    )
}