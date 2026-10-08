import { motion } from 'framer-motion'
import papaImg from '../../assets/images/characters/papa-lili.webp'
import camoteImg from '../../assets/images/characters/camote-luis.webp'

export function Papa({ className = '' }) {
    return (
        <img
            src={papaImg}
            alt="Papa Lili"
            className={`select-none object-contain drop-shadow-md ${className}`}
        />
    )
}

export function Camote({ className = '' }) {
    return (
        <img
            src={camoteImg}
            alt="Camote Luis"
            className={`select-none object-contain drop-shadow-md ${className}`}
        />
    )
}

export function Duo({ className = '' }) {
    return (
        <div className={`flex items-end justify-center gap-3 ${className}`}>
            <motion.div
                className="w-20 sm:w-24"
                animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <Papa className="w-full" />
            </motion.div>
            <motion.div
                className="w-22 sm:w-28"
                animate={{ y: [0, -8, 0], rotate: [3, -3, 3] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
                <Camote className="w-full" />
            </motion.div>
        </div>
    )
}