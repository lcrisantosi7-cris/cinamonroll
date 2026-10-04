import { motion } from 'framer-motion'
import { img } from '../../assets'

export default function PageLoader() {
    const url = img('characters/cinnamoroll')

    return (
        <div className="grid min-h-[60dvh] place-items-center">
            <div className="text-center">
                <motion.div
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {url ? (
                        <img src={url} alt="" draggable={false} className="mx-auto w-24 drop-shadow-lg" />
                    ) : (
                        <span className="mx-auto block size-14 rounded-full bg-kw-pink" />
                    )}
                </motion.div>
                <div className="mt-3 flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="size-2 rounded-full bg-kw-pink"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}