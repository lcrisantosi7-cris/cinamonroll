import { Link } from 'react-router-dom'

const VARIANTS = {
    pink: 'bg-kw-pink text-white shadow-pink-300/60',
    blue: 'bg-kw-sky-deep text-white shadow-sky-300/60',
    butter: 'bg-kw-butter-deep text-amber-900 shadow-amber-200/70',
}

export default function ButtonLink({ to, variant = 'pink', children, className = '' }) {
    return (
        <Link
            to={to}
            className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-2.5 font-bold shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 ${VARIANTS[variant]} ${className}`}
        >
            <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/40 opacity-0 group-hover:animate-shine group-hover:opacity-100"
            />
            <span className="relative inline-flex items-center gap-2">{children}</span>
        </Link>
    )
}