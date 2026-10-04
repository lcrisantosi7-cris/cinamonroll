import { useEffect, useState } from 'react'
import { COUPLE } from '../data/config'

const calc = () => {
    const diff = Math.max(0, Date.now() - new Date(COUPLE.startDate).getTime())
    return {
        days: Math.floor(diff / 864e5),
        hours: Math.floor(diff / 36e5) % 24,
        minutes: Math.floor(diff / 6e4) % 60,
        seconds: Math.floor(diff / 1e3) % 60,
    }
}

export default function useDaysTogether() {
    const [time, setTime] = useState(calc)
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000)
        return () => clearInterval(id)
    }, [])
    return time
}