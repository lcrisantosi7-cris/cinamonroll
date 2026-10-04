import Sticker from '../ui/Sticker'

export default function GameSide({ title = 'Cómo se juega', steps, tip, image }) {
    return (
        <div className="rounded-4xl border-2 border-dashed border-white/80 bg-white/70 p-6 shadow-lg backdrop-blur">
            <h2 className="font-title text-2xl">{title}</h2>
            <ol className="mt-3 space-y-2.5">
                {steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm font-semibold">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-kw-pink text-xs font-extrabold text-white">
                            {i + 1}
                        </span>
                        {s}
                    </li>
                ))}
            </ol>
            {tip && <p className="mt-4 rounded-2xl bg-kw-pink-soft/70 p-3 text-sm font-semibold">{tip}</p>}
            {image && <Sticker name={image} float className="mx-auto mt-4 w-28" />}
        </div>
    )
}