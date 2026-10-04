import { AnimatePresence, motion } from 'framer-motion'
import Card from '../ui/Card'
import Sticker from '../ui/Sticker'
import useDaysTogether from '../../hooks/useDaysTogether'
import { COUPLE } from '../../data/config'

const pad = (n) => String(n).padStart(2, '0')

const startLabel = new Date(COUPLE.startDate).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

function Digit({ value }) {
    return (
        <span className="grid h-16 w-12 place-items-center overflow-hidden rounded-2xl border-2 border-kw-sky-deep/40 bg-white font-title text-5xl shadow-inner">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={value}
                    initial={{ y: -24, opacity: 0, rotateX: 90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

export default function DaysCounter() {
    const { days, months, restDays, hours, minutes, seconds } = useDaysTogether()
    const digits = String(days).padStart(3, '0').split('')

    return (
        <Card tone="butter" tilt id="contador" className="h-full scroll-mt-24 text-center">
            <h2 className="font-title text-3xl">Contador juntos</h2>

            <div className="mt-4 flex justify-center gap-2">
                {digits.map((d, i) => (
                    <Digit key={i} value={d} />
                ))}
            </div>
            <p className="mt-2 font-title text-xl">días juntos</p>

            <p className="mt-1 text-sm font-bold text-kw-pink-deep">
                {months} {months === 1 ? 'mes' : 'meses'} y {restDays} {restDays === 1 ? 'día' : 'días'}
            </p>

            <div className="mx-auto mt-3 grid max-w-xs grid-cols-3 gap-2 text-xs font-bold text-kw-ink/70">
                {[
                    ['horas', pad(hours)],
                    ['min', pad(minutes)],
                    ['seg', pad(seconds)],
                ].map(([label, val]) => (
                    <div key={label} className="rounded-2xl bg-white/70 py-2">
                        <motion.p
                            key={val}
                            initial={label === 'seg' ? { scale: 1.3, color: '#e8457f' } : false}
                            animate={{ scale: 1, color: '#24478f' }}
                            className="font-title text-2xl tabular-nums"
                        >
                            {val}
                        </motion.p>
                        {label}
                    </div>
                ))}
            </div>

            <p className="mt-3 text-xs font-semibold text-kw-ink/60">Desde el {startLabel}</p>
            <p className="mt-1 text-sm font-semibold text-kw-pink-deep">Y todavía nos quedan muchos más.</p>

            <Sticker name="characters/pompompurin" float className="mx-auto mt-2 w-20" />
        </Card>
    )
}