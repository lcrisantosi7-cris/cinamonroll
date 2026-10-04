import { motion } from 'framer-motion'
import { img } from '../../assets'

export function PrimaryButton({ onClick, children }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="rounded-full bg-kw-pink px-7 py-2.5 font-bold text-white shadow-lg shadow-pink-300/60"
        >
            {children}
        </motion.button>
    )
}

export default function GameOverlay({ icon, image, title, text, children }) {
    const url = image ? img(image) : null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 grid place-items-center rounded-3xl bg-white/70 p-4 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 14 }}
                className="w-full max-w-xs rounded-3xl border-2 border-dashed border-kw-pink/70 bg-white p-5 text-center shadow-xl"
            >
                {url ? (
                    <img src={url} alt="" draggable={false} className="mx-auto h-24 object-contain" />
                ) : (
                    icon && <div className="mx-auto grid h-24 w-24 place-items-center">{icon}</div>
                )}
                <h2 className="mt-1 font-title text-2xl">{title}</h2>
                {text && <p className="mt-1 text-sm font-semibold text-kw-ink/80">{text}</p>}
                <div className="mt-4 flex flex-col items-center gap-2">{children}</div>
            </motion.div>
        </motion.div>
    )
}