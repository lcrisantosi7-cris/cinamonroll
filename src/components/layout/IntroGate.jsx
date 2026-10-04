import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import Sticker from '../ui/Sticker'
import Sparkle from '../ui/Sparkle'
import { COUPLE } from '../../data/config'
import { usePlayer } from '../../context/AudioContext'
import { heartBurst } from '../../utils/confettiHearts'

export default function IntroGate({ onEnter }) {
    const player = usePlayer()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    const enter = (withMusic) => {
        if (withMusic && player?.has) player.play()
        heartBurst({ particleCount: 90, spread: 110, startVelocity: 40, origin: { y: 0.75 } })
        onEnter()
    }

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-linear-to-b from-[#b9e0ff] via-[#e6f4ff] to-[#fff1f6] px-6"
        >
            <Sparkle className="absolute left-[12%] top-[16%] size-6 animate-twinkle text-kw-butter-deep" />
            <Sparkle className="absolute right-[14%] top-[24%] size-8 animate-twinkle text-kw-pink [animation-delay:0.8s]" />
            <Sparkle className="absolute bottom-[18%] left-[18%] size-5 animate-twinkle text-kw-sky-deep [animation-delay:1.4s]" />

            <div className="relative text-center">
                <motion.div
                    initial={{ scale: 0.6, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                >
                    <Sticker name="characters/cinnamoroll" float className="mx-auto w-44 sm:w-56" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-4 font-title text-[clamp(2.6rem,12vw,4.5rem)] leading-none"
                >
                    Para {COUPLE.her.name}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="mt-3 text-lg font-semibold text-kw-ink/80"
                >
                    Hice algo especial para ti
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="mt-8 flex flex-col items-center gap-3"
                >
                    <span className="relative inline-flex">
                        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-kw-pink/40" />
                        <motion.button
                            type="button"
                            onClick={() => enter(true)}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            className="relative inline-flex items-center gap-2 rounded-full bg-kw-pink px-10 py-4 text-xl font-extrabold text-white shadow-xl shadow-pink-300/60"
                        >
                            <FiHeart className="animate-heartbeat" /> Entrar
                        </motion.button>
                    </span>
                    {player?.has && (
                        <button
                            type="button"
                            onClick={() => enter(false)}
                            className="text-sm font-bold text-kw-ink/60 underline-offset-4 hover:underline"
                        >
                            Entrar sin música
                        </button>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}