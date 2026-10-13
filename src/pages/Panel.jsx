
import { useEffect, useState } from 'react'
import {
    FiArrowRight,
    FiHeart,
    FiHome,
    FiImage,
    FiLock,
    FiMail,
    FiSettings,
} from 'react-icons/fi'
import NewMemory from '../components/panel/NewMemory'
import MyMemories from '../components/panel/MyMemories'
import ChangePassword from '../components/panel/ChangePassword'
import LettersEditor from '../components/panel/LettersEditor'
import { useAuth } from '../context/AuthContext'

const sections = [
    { id: 'inicio', label: 'Resumen', icon: FiHome },
    { id: 'cartas', label: 'Cartas', icon: FiMail },
    { id: 'recuerdos', label: 'Fotos y videos', icon: FiImage },
    { id: 'seguridad', label: 'Seguridad', icon: FiLock },
]

function SectionButton({ section, active, onClick }) {
    const Icon = section.icon

    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-extrabold transition ${active
                    ? 'bg-kw-pink text-white shadow-md'
                    : 'bg-white/70 text-kw-ink hover:bg-kw-pink-soft'
                }`}
        >
            <Icon className="shrink-0 text-lg" />
            <span>{section.label}</span>
            {active && <FiArrowRight className="ml-auto" />}
        </button>
    )
}

function QuickCard({ icon: Icon, title, description, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group rounded-3xl border-2 border-kw-pink/25 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-kw-pink/60 hover:shadow-md"
        >
            <span className="grid size-11 place-items-center rounded-2xl bg-kw-pink-soft text-xl text-kw-pink-deep">
                <Icon />
            </span>
            <span className="mt-3 block font-title text-2xl">{title}</span>
            <span className="mt-1 block text-sm text-kw-ink/65">{description}</span>
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-kw-pink-deep">
                Abrir apartado <FiArrowRight className="transition group-hover:translate-x-1" />
            </span>
        </button>
    )
}

export default function Panel() {
    const { profile, editUntil, lockEdit } = useAuth()
    const [activeSection, setActiveSection] = useState('inicio')
    const [minutes, setMinutes] = useState(
        () => Math.ceil((editUntil - Date.now()) / 60000)
    )

    useEffect(() => {
        const id = setInterval(
            () => setMinutes(Math.ceil((editUntil - Date.now()) / 60000)),
            15000
        )
        return () => clearInterval(id)
    }, [editUntil])

    const currentSection = sections.find((item) => item.id === activeSection)

    return (
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pt-10">
            <header className="mb-7 rounded-4xl border-2 border-kw-pink/30 bg-white/85 p-5 shadow-lg backdrop-blur sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-kw-pink-deep">
                            Tu espacio privado
                        </p>
                        <h1 className="mt-1 font-title text-4xl sm:text-5xl">
                            Panel de edición ♡
                        </h1>
                        <p className="mt-2 font-semibold text-kw-ink/75">
                            Hola, {profile?.display_name || 'bienvenido'}.
                            Aquí puedes organizar los detalles de tu regalo.
                        </p>
                        <p className="mt-2 text-sm font-semibold text-kw-ink/60">
                            Edición desbloqueada: te quedan unos {Math.max(minutes, 0)} min.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={lockEdit}
                        className="inline-flex items-center gap-2 rounded-full bg-kw-pink-soft px-5 py-3 text-sm font-extrabold text-kw-pink-deep transition hover:bg-kw-pink hover:text-white active:scale-95"
                    >
                        <FiLock /> Bloquear edición
                    </button>
                </div>
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <nav
                    aria-label="Apartados del panel"
                    className="rounded-4xl border-2 border-kw-sky-deep/25 bg-sky-50/80 p-3 shadow-sm sm:p-4"
                >
                    <p className="mb-3 px-3 text-xs font-extrabold uppercase tracking-wider text-kw-ink/50">
                        Administración
                    </p>
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                        {sections.map((section) => (
                            <SectionButton
                                key={section.id}
                                section={section}
                                active={activeSection === section.id}
                                onClick={() => setActiveSection(section.id)}
                            />
                        ))}
                    </div>

                    <div className="mt-4 hidden rounded-2xl bg-white/75 p-3 text-xs font-semibold leading-relaxed text-kw-ink/60 lg:block">
                        <FiHeart className="mb-2 text-lg text-kw-pink-deep" />
                        Un rinconcito para cuidar cada detalle de vuestra historia.
                    </div>
                </nav>

                <main className="min-w-0">
                    {activeSection === 'inicio' && (
                        <div>
                            <div className="mb-5">
                                <h2 className="font-title text-3xl">
                                    Tu centro de control
                                </h2>
                                <p className="mt-1 text-sm text-kw-ink/65">
                                    Elige qué parte de la web quieres administrar.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <QuickCard
                                    icon={FiMail}
                                    title="Cartitas"
                                    description="Edita cartas existentes o escribe una nueva para Lili."
                                    onClick={() => setActiveSection('cartas')}
                                />
                                <QuickCard
                                    icon={FiImage}
                                    title="Recuerdos"
                                    description="Sube fotos y videos y decide dónde aparecerán."
                                    onClick={() => setActiveSection('recuerdos')}
                                />
                                <QuickCard
                                    icon={FiLock}
                                    title="Seguridad"
                                    description="Administra tu contraseña y el acceso de edición."
                                    onClick={() => setActiveSection('seguridad')}
                                />
                                <QuickCard
                                    icon={FiSettings}
                                    title="Más personalización"
                                    description="Esta área podrá reunir los ajustes y demás contenidos en próximas etapas."
                                    onClick={() => setActiveSection('cartas')}
                                />
                            </div>

                            <div className="mt-5 rounded-3xl border border-kw-sky-deep/25 bg-white/75 p-4 text-sm leading-relaxed text-kw-ink/70">
                                <strong className="text-kw-ink">Consejo:</strong>{' '}
                                guarda los cambios y luego revisa la página pública para
                                confirmar cómo se muestran. Esta primera etapa incluye
                                cartas, recuerdos y seguridad; los demás editores se pueden
                                incorporar después.
                            </div>
                        </div>
                    )}

                    {activeSection === 'cartas' && <LettersEditor />}

                    {activeSection === 'recuerdos' && (
                        <div className="space-y-6">
                            <header>
                                <h2 className="font-title text-3xl">Fotos y videos</h2>
                                <p className="mt-1 text-sm text-kw-ink/65">
                                    Sube nuevos recuerdos y administra los que ya guardaste.
                                </p>
                            </header>

                            <NewMemory />
                            <MyMemories />
                        </div>
                    )}

                    {activeSection === 'seguridad' && (
                        <div className="space-y-5">
                            <header>
                                <h2 className="font-title text-3xl">Seguridad</h2>
                                <p className="mt-1 text-sm text-kw-ink/65">
                                    Protege el acceso al modo de edición.
                                </p>
                            </header>
                            <ChangePassword />
                            <div className="rounded-3xl border border-kw-pink/30 bg-white/80 p-4">
                                <h3 className="font-bold">Bloqueo de edición</h3>
                                <p className="mt-1 text-sm text-kw-ink/65">
                                    También puedes bloquear la edición ahora mismo desde
                                    el botón de la parte superior.
                                </p>
                                <button
                                    type="button"
                                    onClick={lockEdit}
                                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-kw-pink-soft px-4 py-2 text-sm font-extrabold text-kw-pink-deep"
                                >
                                    <FiLock /> Bloquear ahora
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="mt-5 text-center text-xs font-semibold text-kw-ink/40">
                        {currentSection?.label} · Hecho con cariño ♡
                    </p>
                </main>
            </div>
        </section>
    )
}
