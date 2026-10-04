import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import SfxToggle from './SfxToggle'

export default function GameShell({ title, subtitle, hud, side, children }) {
    return (
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:pt-10">
            <div
                className={`grid items-start gap-8 lg:justify-center ${side ? 'lg:grid-cols-[28rem_minmax(0,22rem)]' : ''
                    }`}
            >
                <div className="mx-auto w-full max-w-md">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/juegos"
                            className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-sm font-bold shadow"
                        >
                            <FiArrowLeft /> Juegos
                        </Link>
                        <SfxToggle />
                    </div>

                    <header className="mt-3 text-center">
                        <h1 className="font-title text-3xl sm:text-4xl">{title}</h1>
                        {subtitle && <p className="mt-1 text-sm font-semibold text-kw-ink/80">{subtitle}</p>}
                    </header>

                    {hud && <div className="mt-4">{hud}</div>}
                    <div className="relative mt-3">{children}</div>
                </div>

                {side && <aside className="hidden lg:block">{side}</aside>}
            </div>
        </section>
    )
}