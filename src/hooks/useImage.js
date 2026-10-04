import { useEffect, useRef, useState } from 'react'
import { resolveImage } from '../assets'

export default function useImage(src) {
    const ref = useRef(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const url = resolveImage(src)
        if (!url) return
        const img = new Image()
        img.onload = () => {
            ref.current = img
            setLoaded(true)
        }
        img.src = url
    }, [src])

    return [ref, loaded]
}