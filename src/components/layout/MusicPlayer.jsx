import { motion } from 'framer-motion'
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from 'react-icons/fi'
import { usePlayer } from '../../context/AudioContext'

const RING = 2 * Math.PI * 18

function Equalizer({ active }) {
    return (
        <span className="flex h-4 items-end gap-0.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
                <span
                    key={i}
                    className={`h-full w-0.5 origin-bottom rounded-full bg-kw-pink ${active ? 'animate-eq' : 'scale-y-25'}`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </span>
    )
}

export default function MusicPlayer() {
    const player = usePlayer()
    if (!player?.has) return null
    const { track, playing, progress, toggle, next, prev } = player

    return (
        <div className="flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/70 py-1 pl-3 pr-1.5 shadow-sm">
            <Equalizer active={playing} />

            <div className="hidden min-w-0 xl:block">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-kw-ink/60">Nuestra canción</p>
                <p className="max-w-[10rem] truncate font-title text-sm leading-none">{track.title}</p>
            </div>

            <button type="button" onClick={prev} aria-label="Anterior" className="hidden text-kw-ink/70 transition hover:text-kw-pink-deep sm:block">
                <FiSkipBack />
            </button>

            <motion.button
                type="button"
                onClick={toggle}
                aria-label={playing ? 'Pausar' : 'Reproducir'}
                whileTap={{ scale: 0.88 }}
                className="relative grid size-10 place-items-center"
            >
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden>
                    <circle cx="22" cy="22" r="18" fill="none" stroke="#ffd1e3" strokeWidth="3" />
                    <circle
                        cx="22" cy="22" r="18" fill="none" stroke="#e8457f" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={RING} strokeDashoffset={RING * (1 - progress)}
                    />
                </svg>
                <span className="relative grid size-7 place-items-center rounded-full bg-kw-pink text-white">
                    {playing ? <FiPause /> : <FiPlay className="translate-x-px" />}
                </span>
            </motion.button>

            <button type="button" onClick={next} aria-label="Siguiente" className="hidden text-kw-ink/70 transition hover:text-kw-pink-deep sm:block">
                <FiSkipForward />
            </button>
        </div>
    )
}