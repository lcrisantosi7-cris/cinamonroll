import { useEffect, useState } from 'react'
import { signPaths } from '../lib/storage'

export default function useSignedUrls(paths) {
    const key = paths.filter(Boolean).join('|')
    const [urls, setUrls] = useState({})

    useEffect(() => {
        if (!key) return
        let alive = true
        signPaths(key.split('|'))
            .then((map) => alive && setUrls(map))
            .catch(() => { })
        return () => {
            alive = false
        }
    }, [key])

    return urls
}