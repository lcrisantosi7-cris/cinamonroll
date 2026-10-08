import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiArrowRight, FiHeart } from 'react-icons/fi'
import Card from '../ui/Card'
import ButtonLink from '../ui/ButtonLink'
import Sticker from '../ui/Sticker'
import { fetchReasons } from '../../lib/content'
import { heartBurst } from '../../utils/confettiHearts'

export default function LovedThingsPreview() {
    const { data } = useQuery({ queryKey: ['reasons'], queryFn: fetchReasons })
    const shown = useMemo(() => (data ?? []).slice(0, 6).map((r) => r.body), [data])
    const [hl, setHl] = useState(0)

    useEffect(() => {
        if (!shown.length) return
        const id = setInterval(() => setHl((i) => (i + 1) % shown.length), 2200)
        return () => clearInterval(id)
    }, [shown.length])

    const burst = (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        heartBurst({
            particleCount: 14,
            spread: 60,
            startVelocity: 20,
            origin: { x: (r.left + 24) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
        })
    }

    return (
        <Card tone="pink" tilt className="flex h-full flex-col">
            <h2 className="font-title text-3xl">Cosas que amo de ti</h2>

            <ul className="mt-4 flex-1 space-y-1.5">
                {shown.map((t, i) => (
                    <motion.li
                        key={t}
                        animate={{ scale: hl === i ? 1.03 : 1, x: hl === i ? 4 : 0 }}
                        whileHover={{ x: 8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <button
                            type="button"
                            onClick={burst}
                            className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-bold transition-colors sm:text-base ${hl === i ? 'bg-white/80' : 'hover:bg-white/50'
                                }`}
                        >
                            <FiHeart
                                className={`shrink-0 text-lg transition ${hl === i ? 'fill-kw-pink text-kw-pink' : 'text-kw-pink group-hover:fill-kw-pink'
                                    } group-hover:animate-heartbeat`}
                            />
                            {t}
                        </button>
                    </motion.li>
                ))}
            </ul>

            <div className="mt-4 flex items-end justify-between">
                <ButtonLink to="/cosas-que-amo">
                    Ver todas, y contando <FiArrowRight />
                </ButtonLink>
                <Sticker name="characters/pompompurin" float delay={1} className="w-20 sm:w-24" />
            </div>
        </Card>
    )
}