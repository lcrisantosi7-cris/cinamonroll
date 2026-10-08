import { useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import Cosmos from '../components/loved/Cosmos'
import InfinityMark from '../components/loved/InfinityMark'
import Marquee from '../components/loved/Marquee'
import Constellation from '../components/loved/Constellation'
import ReasonList from '../components/loved/ReasonList'
import VerseSection from '../components/loved/VerseSection'
import ButtonLink from '../components/ui/ButtonLink'
import PageLoader from '../components/ui/PageLoader'
import { fetchReasons } from '../lib/content'

function CountUp({ to }) {
    const mv = useMotionValue(0)
    const rounded = useTransform(mv, (v) => Math.round(v))
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        const controls = animate(mv, to, { duration: 2.2, ease: 'easeOut' })
        return () => controls.stop()
    }, [inView, mv, to])

    return <motion.span ref={ref}>{rounded}</motion.span>
}

export default function LovedThings() {
    const { data, isPending } = useQuery({ queryKey: ['reasons'], queryFn: fetchReasons })
    const reasons = useMemo(() => (data ?? []).map((r) => r.body), [data])

    return (
        <>
            <Cosmos />

            <div className="mx-auto max-w-5xl px-4 pb-10 pt-8 text-white sm:pt-12">
                <header className="text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                        <InfinityMark className="mx-auto w-[min(86vw,26rem)] cursor-pointer" />
                    </motion.div>

                    <h1 className="mt-2 bg-linear-to-r from-pink-200 via-amber-100 to-sky-200 bg-clip-text font-title text-[clamp(2.4rem,9vw,4.6rem)] leading-none text-transparent">
                        Cosas que amo de ti
                    </h1>
                    <p className="mt-3 text-lg font-semibold text-indigo-100/90">
                        Podría seguir toda la vida, y todavía faltarían.
                    </p>
                    {reasons.length > 0 && (
                        <p className="mt-5 text-indigo-100/90">
                            <span className="font-title text-4xl text-amber-200">
                                <CountUp to={reasons.length} />+
                            </span>{' '}
                            razones, y contando
                        </p>
                    )}
                </header>

                {isPending && <PageLoader />}

                {!isPending && reasons.length === 0 && (
                    <div className="mx-auto mt-12 max-w-md rounded-4xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
                        <p className="font-title text-3xl">La lista apenas empieza</p>
                        <p className="mt-2 text-sm font-semibold text-indigo-100/80">Aquí irán todas las razones.</p>
                    </div>
                )}

                {reasons.length > 0 && (
                    <>
                        <div className="mt-10">
                            <Marquee reasons={reasons} />
                        </div>
                        <Constellation reasons={reasons} />
                        <ReasonList reasons={reasons} />
                    </>
                )}

                <VerseSection />

                <section className="mt-24 text-center">
                    <InfinityMark className="mx-auto w-48" />
                    <p className="mt-4 font-title text-3xl sm:text-4xl">Y todavía faltan muchas más</p>
                    <p className="mt-2 text-indigo-100/80">Las iré descubriendo contigo, una por una.</p>
                    <ButtonLink to="/" className="mt-6">
                        Volver al inicio
                    </ButtonLink>
                </section>
            </div>
        </>
    )
}