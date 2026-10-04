import { useEffect, useRef } from 'react'

export default function useRaf(callback, active) {
    const cb = useRef(callback)

    useEffect(() => {
        cb.current = callback
    })

    useEffect(() => {
        if (!active) return
        let id
        let last = performance.now()
        const tick = (now) => {
            const dt = Math.min(0.033, (now - last) / 1000)
            last = now
            cb.current(dt)
            id = requestAnimationFrame(tick)
        }
        id = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(id)
    }, [active])
}