import { useEffect, useRef, useState } from 'react'
import { img } from '../assets'

// Precarga tus imágenes (si existen). ref.current[clave] = Image
export default function useSprites(keys) {
    const ref = useRef({})
    const [ready, setReady] = useState(0)
    const signature = keys.join('|')

    useEffect(() => {
        let alive = true
        signature.split('|').forEach((k) => {
            const url = img(k)
            if (!url) return
            const im = new Image()
            im.onload = () => {
                if (!alive) return
                ref.current[k] = im
                setReady((n) => n + 1)
            }
            im.src = url
        })
        return () => {
            alive = false
        }
    }, [signature])

    return [ref, ready]
}