import { useEffect, useState } from 'react'

export default function useMedia(query) {
    const [matches, setMatches] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(query).matches
    )

    useEffect(() => {
        const mq = window.matchMedia(query)
        const onChange = () => setMatches(mq.matches)
        mq.addEventListener('change', onChange)
        onChange()
        return () => mq.removeEventListener('change', onChange)
    }, [query])

    return matches
}