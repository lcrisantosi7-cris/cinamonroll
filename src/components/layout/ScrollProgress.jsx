import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })

    return (
        <motion.div
            aria-hidden
            style={{ scaleX }}
            className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-linear-to-r from-kw-sky-deep via-kw-pink to-kw-butter-deep"
        />
    )
}