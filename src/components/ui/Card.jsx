import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const TONES = {
    pink: 'from-pink-50 to-kw-pink-soft border-kw-pink/70 shadow-pink-200/60',
    blue: 'from-white to-sky-100 border-kw-sky-deep/60 shadow-sky-200/60',
    butter: 'from-white to-kw-butter border-kw-butter-deep shadow-amber-200/60',
}

export default function Card({ tone = 'pink', tilt = false, className = '', children, ...props }) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 220, damping: 20 })
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 220, damping: 20 })

    const onMove = (e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
    }
    const onLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.section
            onPointerMove={tilt ? onMove : undefined}
            onPointerLeave={tilt ? onLeave : undefined}
            style={tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={`relative rounded-4xl border-2 border-dashed bg-linear-to-br p-5 shadow-lg sm:p-6 ${TONES[tone]} ${className}`}
            {...props}
        >
            {children}
        </motion.section>
    )
}