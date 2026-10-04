import { FiHeart } from 'react-icons/fi'
import { img } from '../../assets'

export default function Stamp({ className = '' }) {
    const url = img('decor/stamp')

    return (
        <span
            aria-hidden
            className={`relative block aspect-[4/5] bg-white p-[6%] shadow-md ${className}`}
            style={{ outline: '2px dashed #ffffff', outlineOffset: '-1px' }}
        >
            <span className="grid size-full place-items-center rounded-sm border border-kw-pink/50 bg-kw-pink-soft">
                {url ? (
                    <img src={url} alt="" className="size-[85%] object-contain" />
                ) : (
                    <FiHeart className="text-lg text-kw-pink-deep" />
                )}
            </span>
            <svg
                viewBox="0 0 60 30"
                className="absolute -bottom-2 -left-5 w-14 text-kw-ink/40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
            >
                <circle cx="38" cy="15" r="11" />
                <path d="M0 8q5-4 10 0t10 0t10 0M0 15q5-4 10 0t10 0t10 0M0 22q5-4 10 0t10 0t10 0" />
            </svg>
        </span>
    )
}