export default function Hud({ level, levels, icon, value, goal }) {
    const pct = Math.max(0, Math.min(100, (value / goal) * 100))

    return (
        <div className="rounded-2xl bg-white/85 p-3 shadow">
            <div className="flex items-center justify-between text-sm font-bold">
                <span>
                    Nivel {level}/{levels}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    {icon} {value}/{goal}
                </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-kw-pink-soft">
                <div
                    className="h-full rounded-full bg-linear-to-r from-kw-pink to-kw-butter-deep transition-all duration-300"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    )
}