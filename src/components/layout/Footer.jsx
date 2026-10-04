import Sticker from '../ui/Sticker'
import { COUPLE } from '../../data/config'

const FLOWERS = [
    { x: 6, h: 70, c: '#ff8fb8' }, { x: 14, h: 50, c: '#ffd966' }, { x: 24, h: 82, c: '#ffffff' },
    { x: 33, h: 56, c: '#cfeaff' }, { x: 44, h: 76, c: '#ff8fb8' }, { x: 55, h: 52, c: '#ffd966' },
    { x: 66, h: 84, c: '#ffffff' }, { x: 76, h: 58, c: '#ff8fb8' }, { x: 86, h: 74, c: '#cfeaff' },
    { x: 94, h: 54, c: '#ffd966' },
]

function Flower({ x, h, c, i }) {
    return (
        <span
            aria-hidden
            className="absolute bottom-6 origin-bottom animate-sway"
            style={{ left: `${x}%`, height: h, animationDelay: `${i * 0.35}s` }}
        >
            <svg width="34" height={h} viewBox={`0 0 34 ${h}`} className="overflow-visible">
                <path d={`M17 ${h} C15 ${h * 0.7} 19 ${h * 0.4} 17 18`} stroke="#6cc58a" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d={`M17 ${h * 0.65} q-12 -8 -14 -16 q12 0 14 16z`} fill="#8bd6a3" />
                {[0, 72, 144, 216, 288].map((a) => (
                    <ellipse key={a} cx="17" cy="9" rx="5" ry="8" fill={c} stroke="#0000001a" transform={`rotate(${a} 17 18)`} />
                ))}
                <circle cx="17" cy="18" r="5" fill="#ffd966" />
            </svg>
        </span>
    )
}

export default function Footer() {
    return (
        <footer className="relative mt-20 overflow-hidden pb-28 pt-28 lg:pb-10">
            <svg aria-hidden viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-44 w-full">
                <path d="M0 80C240 20 480 120 720 70C960 20 1200 110 1440 60L1440 200L0 200Z" fill="#c9f0d3" />
                <path d="M0 120C300 70 520 150 760 110C1000 70 1220 140 1440 100L1440 200L0 200Z" fill="#aee6bd" />
            </svg>

            {FLOWERS.map((f, i) => <Flower key={f.x} {...f} i={i} />)}

            <div className="relative mx-auto flex max-w-7xl items-end justify-between gap-4 px-4">
                <Sticker name="decor/mailbox" float className="w-14 sm:w-24" />
                <p className="rounded-full bg-white/90 px-5 py-2 text-center font-title text-lg text-kw-pink-deep shadow-md">
                    Gracias por ser parte de mi vida
                </p>
                <Sticker name="decor/signpost" float delay={1} className="w-14 sm:w-24" />
            </div>
            <p className="relative mt-4 text-center text-xs font-bold text-emerald-900/60">
                Hecho con mucho cariño para {COUPLE.her.name}
            </p>
        </footer>
    )
}