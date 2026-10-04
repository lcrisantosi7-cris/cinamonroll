import { useState } from 'react'
import { FiCheck, FiGift, FiLock } from 'react-icons/fi'
import Card from '../ui/Card'
import ButtonLink from '../ui/ButtonLink'
import Sticker from '../ui/Sticker'
import AssetIcon from '../ui/AssetIcon'
import Reveal from '../ui/Reveal'
import { GAMES } from '../../data/games'
import { getProgress } from '../../utils/progress'

export default function GamesSurprise() {
    const [completed] = useState(() => getProgress().completed)
    const done = GAMES.filter((g) => completed[g.id]).length
    const ready = done === GAMES.length

    const cards = [
        ...GAMES.map((g) => ({
            id: g.id,
            tone: g.tone,
            variant: g.variant,
            title: g.title,
            text: g.blurb,
            to: g.to,
            label: 'Jugar',
            char: g.img,
            done: !!completed[g.id],
        })),
        {
            id: 'sorpresa',
            tone: 'pink',
            variant: 'pink',
            title: 'Sorpresa final',
            text: ready
                ? 'Tu regalo ya está listo para abrirse.'
                : `Completa los juegos para abrirla (${done}/${GAMES.length}).`,
            to: '/sorpresa',
            label: ready ? 'Abrir' : 'Ver',
            locked: !ready,
        },
    ]

    return (
        <>
            {cards.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.1} className="h-full">
                    <Card tone={c.tone} tilt className="group flex h-full flex-col items-center text-center">
                        {c.done && (
                            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                <FiCheck /> Completado
                            </span>
                        )}
                        {c.locked && (
                            <span className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/80 text-kw-ink/60">
                                <FiLock />
                            </span>
                        )}

                        <div className="grid h-28 place-items-center">
                            {c.char ? (
                                <Sticker
                                    src={c.char}
                                    float
                                    delay={i * 0.4}
                                    className="h-28 object-contain transition duration-300 group-hover:-translate-y-2 group-hover:scale-110"
                                />
                            ) : (
                                <AssetIcon
                                    name="icons/sorpresa"
                                    fallback={FiGift}
                                    className="size-20 animate-heartbeat text-kw-pink"
                                    imgClassName="h-24 object-contain transition duration-300 group-hover:-translate-y-2 group-hover:scale-110"
                                />
                            )}
                        </div>

                        <h3 className="mt-2 font-title text-2xl">{c.title}</h3>
                        <p className="mt-1 flex-1 text-sm font-semibold text-kw-ink/80">{c.text}</p>
                        <ButtonLink to={c.to} variant={c.variant} className="mt-4">
                            {c.label}
                        </ButtonLink>
                    </Card>
                </Reveal>
            ))}
        </>
    )
}