import { forwardRef, useEffect } from 'react'

export const pointerX = (e, canvas, width) => {
    const r = canvas.getBoundingClientRect()
    return ((e.clientX - r.left) / r.width) * width
}

const GameCanvas = forwardRef(function GameCanvas({ width, height, ...props }, ref) {
    useEffect(() => {
        const canvas = ref.current
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)
    }, [ref, width, height])

    return (
        <canvas
            ref={ref}
            className="block w-full touch-none select-none rounded-3xl border-4 border-white shadow-xl"
            style={{ aspectRatio: `${width} / ${height}` }}
            {...props}
        />
    )
})

export default GameCanvas