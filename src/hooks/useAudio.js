import { useCallback, useEffect, useRef, useState } from 'react'

export default function useAudio(tracks) {
    const audioRef = useRef(null)
    const wantPlay = useRef(false)
    const [index, setIndex] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const has = tracks.length > 0

    useEffect(() => {
        if (!has) return
        const audio = new Audio()
        audio.preload = 'none'
        audioRef.current = audio

        const onEnded = () => setIndex((i) => (i + 1) % tracks.length)
        const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
        const onPlay = () => setPlaying(true)
        const onPause = () => setPlaying(false)

        audio.addEventListener('ended', onEnded)
        audio.addEventListener('timeupdate', onTime)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)
        return () => {
            audio.pause()
            audio.removeEventListener('ended', onEnded)
            audio.removeEventListener('timeupdate', onTime)
            audio.removeEventListener('play', onPlay)
            audio.removeEventListener('pause', onPause)
        }
    }, [has, tracks.length])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !has) return
        audio.src = tracks[index].src
        setProgress(0)
        if (wantPlay.current) audio.play().catch(() => { })
    }, [index, tracks, has])

    const play = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        wantPlay.current = true
        audio.play().catch(() => {
            wantPlay.current = false
        })
    }, [])

    const toggle = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) {
            play()
        } else {
            wantPlay.current = false
            audio.pause()
        }
    }, [play])

    const next = useCallback(() => {
        if (has) setIndex((i) => (i + 1) % tracks.length)
    }, [has, tracks.length])

    const prev = useCallback(() => {
        if (has) setIndex((i) => (i - 1 + tracks.length) % tracks.length)
    }, [has, tracks.length])

    return { has, track: tracks[index], playing, progress, play, toggle, next, prev }
}