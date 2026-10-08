import { Fragment, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiChevronDown, FiHeart, FiRotateCcw } from 'react-icons/fi'
import Sparkle from '../ui/Sparkle'
import ButtonLink from '../ui/ButtonLink'
import PageLoader from '../ui/PageLoader'
import { Duo } from '../ui/Mascots'
import Coupon from './Coupon'
import useSignedUrls from '../../hooks/useSignedUrls'
import {
    fetchCoupons,
    fetchRedemptions,
    fetchSurprise,
    fetchSurpriseMedia,
    redeemCoupon,
} from '../../lib/content'
import { heartRain } from '../../utils/confettiHearts'

const WASHI = {
    backgroundImage: 'repeating-linear-gradient(45deg, #ffd1e3 0 8px, #ffffff 8px 16px)',
}

const notch = (pos) => `radial-gradient(circle at ${pos}, transparent 14px, #000 15px)`
const TICKET_MASK = {
    WebkitMaskImage: `${notch('0 50%')}, ${notch('100% 50%')}`,
    maskImage: `${notch('0 50%')}, ${notch('100% 50%')}`,
    WebkitMaskComposite: 'source-in',
    maskComposite: 'intersect',
}

function SplitText({ text, delay = 0, className = '' }) {
    let k = 0
    return (
        <h1 aria-label={text} className={className}>
            {text.split(' ').map((word, wi) => (
                <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
                    {[...word].map((ch, ci) => (
                        <motion.span
                            key={ci}
                            className="inline-block"
                            initial={{ opacity: 0, y: 30, rotate: 8 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, delay: delay + 0.045 * k++ }}
                        >
                            {ch}
                        </motion.span>
                    ))}
                    {'\u00A0'}
                </span>
            ))}
        </h1>
    )
}

function Scene({ text }) {
    return (
        <motion.p
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mx-auto max-w-xl text-center font-title text-[clamp(1.7rem,6vw,2.6rem)] leading-snug"
        >
            {text}
        </motion.p>
    )
}

function Divider() {
    return (
        <motion.div
            aria-hidden
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto my-12 flex items-center justify-center gap-3 text-kw-pink"
        >
            <span className="h-px w-16 bg-kw-pink/50" />
            <FiHeart className="fill-current" />
            <span className="h-px w-16 bg-kw-pink/50" />
        </motion.div>
    )
}

// La foto se "revela": empieza borrosa y en blanco y negro, como una instantánea al salir
function DevelopingPhoto({ src, caption, rotate = 2 }) {
    return (
        <motion.figure
            initial={{ opacity: 0, y: 40, rotate: rotate * 3 }}
            whileInView={{ opacity: 1, y: 0, rotate }}
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{ rotate: 0, scale: 1.03 }}
            transition={{ type: 'spring', damping: 14 }}
            className="relative w-64 rounded-md bg-white p-3 pb-5 shadow-2xl shadow-pink-300/50 sm:w-72"
        >
            <span
                aria-hidden
                className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 opacity-80 shadow-sm"
                style={WASHI}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded bg-kw-pink-soft">
                {src && (
                    <motion.img
                        src={src}
                        alt={caption || 'Foto de nosotros'}
                        loading="lazy"
                        draggable={false}
                        initial={{ opacity: 0.6 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 2.2, delay: 0.3 }}
                        className="size-full object-cover"
                    />
                )}
                <motion.span
                    aria-hidden
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 2.2, delay: 0.3 }}
                    className="absolute inset-0 bg-linear-to-br from-white/60 to-transparent"
                />
            </div>
            {caption && <figcaption className="mt-3 text-center font-title text-xl">{caption}</figcaption>}
        </motion.figure>
    )
}

function Ticket({ reveal }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: 'spring', damping: 14 }}
            className="relative mx-auto max-w-xl drop-shadow-xl"
        >
            <div
                style={TICKET_MASK}
                className="relative overflow-hidden bg-linear-to-br from-amber-100 via-white to-amber-100 px-10 py-9 text-center"
            >
                <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/2 w-1/3 animate-shine bg-white/70"
                    style={{ animationDuration: '3.5s', animationIterationCount: 'infinite' }}
                />
                <p className="relative text-xs font-extrabold uppercase tracking-[0.35em] text-amber-700">
                    Boleto especial
                </p>
                <h2 className="relative mt-2 font-title text-3xl sm:text-4xl">{reveal.title}</h2>
                <p className="relative mt-2 text-lg font-semibold text-kw-ink/80">{reveal.text}</p>
                {reveal.date && (
                    <p className="relative mt-4 inline-block rounded-full border-2 border-dashed border-amber-400 px-4 py-1 font-title text-xl text-amber-800">
                        {reveal.date}
                    </p>
                )}
            </div>
        </motion.div>
    )
}

export default function RevealView({ onReplay }) {
    const contentQ = useQuery({ queryKey: ['surprise'], queryFn: fetchSurprise })
    const couponsQ = useQuery({ queryKey: ['coupons'], queryFn: fetchCoupons })
    const redQ = useQuery({ queryKey: ['redemptions'], queryFn: fetchRedemptions })
    const mediaQ = useQuery({ queryKey: ['surprise-media'], queryFn: fetchSurpriseMedia })

    const c = contentQ.data ?? {}
    const paragraphs = c.paragraphs ?? []
    const coupons = useMemo(() => couponsQ.data ?? [], [couponsQ.data])
    const redeemed = useMemo(
        () => Object.fromEntries((redQ.data ?? []).map((r) => [r.coupon_id, true])),
        [redQ.data]
    )
    const photos = (mediaQ.data ?? []).filter((m) => m.kind === 'image')
    const video = (mediaQ.data ?? []).find((m) => m.kind === 'video')
    const urls = useSignedUrls([
        ...photos.map((p) => p.path_medium),
        video?.path_full,
        video?.path_thumb,
    ])
    const count = coupons.filter((x) => redeemed[x.id]).length

    useEffect(() => {
        if (!contentQ.isPending) heartRain(2600)
    }, [contentQ.isPending])

    if (contentQ.isPending) return <PageLoader />

    return (
        <div>
            <header className="grid min-h-[72dvh] place-items-center text-center">
                <div>
                    <Sparkle className="mx-auto mb-3 size-8 animate-twinkle text-kw-butter-deep" />
                    <SplitText
                        text={c.title ?? 'Esto es para ti'}
                        delay={0.3}
                        className="font-title text-[clamp(2.6rem,11vw,5rem)] leading-[1.05]"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        className="mt-4 text-lg font-semibold text-kw-ink/80"
                    >
                        Baja despacito, hay mucho para ti
                    </motion.p>
                    <motion.span
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        className="mt-8 inline-block text-3xl text-kw-pink-deep"
                    >
                        <FiChevronDown />
                    </motion.span>
                </div>
            </header>

            <section className="py-10">
                {paragraphs.map((p, i) => (
                    <Fragment key={i}>
                        <Scene text={p} />
                        {i < paragraphs.length - 1 && <Divider />}
                    </Fragment>
                ))}
            </section>

            {photos.length > 0 && (
                <section className="mt-16 flex flex-col items-center gap-12 sm:flex-row sm:flex-wrap sm:justify-center">
                    {photos.map((p, i) => (
                        <DevelopingPhoto
                            key={p.id}
                            src={urls[p.path_medium]}
                            caption={i === 0 ? c.photoCaption : ''}
                            rotate={i % 2 === 0 ? 2 : -3}
                        />
                    ))}
                </section>
            )}

            {video && (
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="mx-auto mt-16 max-w-xl"
                >
                    <video
                        controls
                        playsInline
                        preload="metadata"
                        src={urls[video.path_full]}
                        poster={urls[video.path_thumb]}
                        className="w-full rounded-4xl border-4 border-white shadow-2xl shadow-pink-300/50"
                    />
                </motion.section>
            )}

            {c.reveal && (
                <section className="mt-20">
                    <Ticket reveal={c.reveal} />
                </section>
            )}

            {coupons.length > 0 && (
                <section className="mt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="font-title text-4xl">Tus cupones de amor</h2>
                        <p className="mt-1 text-sm font-semibold text-kw-ink/80">
                            Canjea el que quieras, cuando quieras. Cuando lo hagas, avísame y lo cumplo.
                        </p>
                        <p className="mt-3 inline-block rounded-full bg-white/80 px-4 py-1 text-sm font-bold shadow">
                            Canjeados {count} de {coupons.length}
                        </p>
                    </motion.div>

                    <ul className="mx-auto mt-8 max-w-xl space-y-5">
                        {coupons.map((cp, i) => (
                            <Coupon
                                key={cp.id}
                                coupon={{ id: cp.id, title: cp.title, text: cp.body, img: cp.icon }}
                                index={i}
                                redeemed={!!redeemed[cp.id]}
                                onRedeem={(id) => redeemCoupon(id).catch(() => { })}
                            />
                        ))}
                    </ul>
                </section>
            )}

            <section className="mt-28 text-center">
                <motion.p
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                    className="font-title text-[clamp(1.8rem,6vw,2.8rem)] text-kw-pink-deep"
                >
                    {c.signature}
                </motion.p>
                <Duo className="mt-6" />
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <ButtonLink to="/">Volver al inicio</ButtonLink>
                    <button
                        type="button"
                        onClick={onReplay}
                        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-2.5 font-bold shadow-lg transition hover:-translate-y-0.5 active:scale-95"
                    >
                        <FiRotateCcw /> Abrir el regalo otra vez
                    </button>
                </div>
            </section>
        </div>
    )
}