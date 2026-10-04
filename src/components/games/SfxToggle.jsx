import { useState } from 'react'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import { isMuted, setMuted, sfx } from '../../utils/sfx'

export default function SfxToggle() {
    const [muted, setM] = useState(isMuted)

    const toggle = () => {
        const m = !muted
        setMuted(m)
        setM(m)
        if (!m) sfx.pop()
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={muted}
            aria-label={muted ? 'Activar sonidos' : 'Silenciar sonidos'}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-sm font-bold shadow transition active:scale-95"
        >
            {muted ? <FiVolumeX /> : <FiVolume2 />} Sonidos
        </button>
    )
}