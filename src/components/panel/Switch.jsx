import { motion } from 'framer-motion'

export default function Switch({ checked, onChange, label, hint }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/80 px-4 py-3 text-left shadow transition active:scale-[0.98]"
        >
            <span>
                <span className="block font-bold">{label}</span>
                {hint && <span className="block text-xs font-semibold text-kw-ink/60">{hint}</span>}
            </span>
            <span
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-kw-pink' : 'bg-kw-ink/20'
                    }`}
            >
                <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`absolute top-0.5 size-6 rounded-full bg-white shadow ${checked ? 'right-0.5' : 'left-0.5'
                        }`}
                />
            </span>
        </button>
    )
}