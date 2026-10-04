import { FiCheck, FiLock } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import ButtonLink from '../components/ui/ButtonLink'
import Sticker from '../components/ui/Sticker'
import Reveal from '../components/ui/Reveal'
import { Sprite } from '../games/icons'
import { GAMES } from '../data/games'
import { getProgress } from '../utils/progress'

const BADGE = { cinnamoroll: 'star', fresitas: 'strawberry', pompompurin: 'flan' }

export default function Games() {
    const { completed } = getProgress()
    const done = GAMES.filter((g) => completed[g.id]).length
    const all = done === GAMES.length

    return (
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:pt-12">
            <header className="text-center">
                <h1 className="font-title text-[clamp(2.4rem,8vw,4rem)] leading-none">Juegos</h1>
                <p className="mt-2 font-semibold text-kw-ink/80">
                    Completa los tres para abrir la sorpresa final
                </p>
            </header>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
                {GAMES.map((g, i) => (
                    <Reveal key={g.id} delay={i * 0.1} className="h-full">
                        <Card tone={g.tone} tilt className="flex h-full flex-col text-center">
                            {completed[g.id] && (
                                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                    <FiCheck /> Completado
                                </span>
                            )}
                            <Sticker src={g.img} float delay={i * 0.4} className="mx-auto h-28 object-contain" />
                            <h2 className="mt-2 inline-flex items-center justify-center gap-2 font-title text-2xl">
                                <Sprite name={BADGE[g.id]} className="size-7" /> {g.title}
                            </h2>
                            <p className="mt-1 flex-1 text-sm font-semibold text-kw-ink/80">{g.text}</p>
                            <p className="mt-2 text-xs font-bold text-kw-ink/60">{g.levels}</p>
                            <ButtonLink to={g.to} variant={g.variant} className="mt-3">
                                {completed[g.id] ? 'Jugar otra vez' : 'Jugar'}
                            </ButtonLink>
                        </Card>
                    </Reveal>
                ))}
            </div>

            <Reveal className="mx-auto mt-8 max-w-xl">
                <Link
                    to="/sorpresa"
                    className="flex items-center gap-4 rounded-3xl border-2 border-dashed border-kw-pink/70 bg-white/80 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1"
                >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-kw-pink-soft text-xl text-kw-pink-deep">
                        {all ? <FiCheck /> : <FiLock />}
                    </span>
                    <span className="flex-1">
                        <span className="block font-title text-xl">Sorpresa final</span>
                        <span className="text-sm font-semibold text-kw-ink/70">
                            {all ? 'Tu regalo está listo para abrirse' : `${done} de ${GAMES.length} juegos completados`}
                        </span>
                        <span className="mt-2 block h-2 overflow-hidden rounded-full bg-kw-pink-soft">
                            <span
                                className="block h-full rounded-full bg-linear-to-r from-kw-pink to-kw-butter-deep transition-all"
                                style={{ width: `${(done / GAMES.length) * 100}%` }}
                            />
                        </span>
                    </span>
                </Link>
            </Reveal>
        </section>
    )
}