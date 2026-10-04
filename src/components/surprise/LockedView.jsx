import ButtonLink from '../ui/ButtonLink'
import Orbit from './Orbit'

export default function LockedView({ games, completed }) {
    const done = games.filter((g) => completed[g.id]).length
    const missing = games.filter((g) => !completed[g.id])

    return (
        <div>
            <h1 className="font-title text-4xl sm:text-5xl">Sorpresa final</h1>
            <p className="mt-1 font-semibold text-kw-ink/80">Completa los 3 juegos para abrir tu regalo</p>

            <div className="mt-6">
                <Orbit games={games} completed={completed} />
            </div>

            <p className="mt-12 font-title text-2xl text-kw-pink-deep">
                {done} de {games.length} juegos completados
            </p>
            <div className="mx-auto mt-3 h-2.5 max-w-xs overflow-hidden rounded-full bg-white/70">
                <div
                    className="h-full rounded-full bg-linear-to-r from-kw-sky-deep via-kw-pink to-kw-butter-deep transition-all duration-700"
                    style={{ width: `${(done / games.length) * 100}%` }}
                />
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
                {missing.map((g) => (
                    <ButtonLink key={g.id} to={g.to} variant={g.variant}>
                        Jugar: {g.title}
                    </ButtonLink>
                ))}
            </div>
        </div>
    )
}