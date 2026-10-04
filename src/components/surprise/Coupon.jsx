import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiGift } from 'react-icons/fi'
import { img } from '../../assets'
import { heartBurst } from '../../utils/confettiHearts'

const TONES = [
    { stub: 'bg-pink-100', main: 'from-pink-50 to-pink-200 border-pink-300' },
    { stub: 'bg-sky-100', main: 'from-white to-sky-200 border-sky-300' },
    { stub: 'bg-amber-100', main: 'from-amber-50 to-amber-200 border-amber-300' },
]

const notch = (pos) => `radial-gradient(circle at ${pos}, transparent 11px, #000 12px)`
const mask = (a, b) => ({
    WebkitMaskImage: `${a}, ${b}`,
    maskImage: `${a}, ${b}`,
    WebkitMaskComposite: 'source-in',
    maskComposite: 'intersect',
})
const STUB_MASK = mask(notch('100% 0'), notch('100% 100%'))
const MAIN_MASK = mask(notch('0 0'), notch('0 100%'))

export default function Coupon({ coupon, index, redeemed, onRedeem }) {
    const [armed, setArmed] = useState(false)
    const [fresh, setFresh] = useState(false)
    const [broken, setBroken] = useState(false)
    const url = coupon.img ? img(coupon.img) : null
    const tone = TONES[index % TONES.length]

    const handle = (e) => {
        if (!armed) {
            setArmed(true)
            setTimeout(() => setArmed(false), 2500)
            return
        }
        setFresh(true)
        heartBurst({
            particleCount: 36,
            spread: 75,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        })
        onRedeem(coupon.id)
    }

    return (
        <motion.li
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative drop-shadow-lg"
        >
            <motion.div
                animate={fresh ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex"
            >
                <motion.div
                    animate={redeemed ? { rotate: -5, x: -6, y: 6 } : { rotate: 0, x: 0, y: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 12 }}
                    style={STUB_MASK}
                    className={`grid w-24 shrink-0 place-items-center rounded-l-3xl ${tone.stub} ${redeemed ? 'grayscale' : ''
                        }`}
                >
                    {url && !broken ? (
                        <img
                            src={url}
                            alt=""
                            loading="lazy"
                            draggable={false}
                            onError={() => setBroken(true)}
                            className="size-16 object-contain"
                        />
                    ) : (
                        <FiGift className="text-3xl text-kw-pink" />
                    )}
                </motion.div>

                <div
                    style={MAIN_MASK}
                    className={`relative min-w-0 flex-1 rounded-r-3xl border-l-2 border-dashed bg-linear-to-br p-4 ${tone.main} ${redeemed ? 'opacity-80' : ''
                        }`}
                >
                    <h3 className="font-title text-xl leading-tight">{coupon.title}</h3>
                    <p className="text-sm font-semibold text-kw-ink/80">{coupon.text}</p>
                    <button
                        type="button"
                        disabled={redeemed}
                        onClick={handle}
                        className="mt-2 rounded-full bg-kw-pink px-4 py-1.5 text-sm font-bold text-white shadow-lg transition active:scale-95 disabled:bg-kw-ink/30"
                    >
                        {redeemed ? 'Canjeado' : armed ? 'Toca otra vez para confirmar' : 'Canjear'}
                    </button>

                    {redeemed && (
                        <motion.span
                            initial={fresh ? { scale: 2.4, opacity: 0, rotate: -30 } : false}
                            animate={{ scale: 1, opacity: 1, rotate: -12 }}
                            transition={{ type: 'spring', damping: 8, stiffness: 220 }}
                            className="pointer-events-none absolute right-3 top-3 rounded-lg border-4 border-kw-pink-deep px-2 py-0.5 font-title text-xl uppercase text-kw-pink-deep"
                        >
                            Canjeado
                        </motion.span>
                    )}
                </div>
            </motion.div>
        </motion.li>
    )
}