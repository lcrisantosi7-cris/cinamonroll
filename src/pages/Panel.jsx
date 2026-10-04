import { useEffect, useState } from 'react'
import { FiLock } from 'react-icons/fi'
import NewMemory from '../components/panel/NewMemory'
import MyMemories from '../components/panel/MyMemories'
import ChangePassword from '../components/panel/ChangePassword'
import { useAuth } from '../context/AuthContext'

export default function Panel() {
    const { profile, editUntil, lockEdit } = useAuth()
    const [refreshKey, setRefreshKey] = useState(0)
    const [minutes, setMinutes] = useState(() => Math.ceil((editUntil - Date.now()) / 60000))

    useEffect(() => {
        const id = setInterval(() => setMinutes(Math.ceil((editUntil - Date.now()) / 60000)), 15000)
        return () => clearInterval(id)
    }, [editUntil])

    return (
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:pt-12">
            <header className="text-center">
                <h1 className="font-title text-4xl sm:text-5xl">Panel de edición</h1>
                <p className="mt-1 font-semibold text-kw-ink/80">Hola, {profile?.display_name}</p>
                <p className="mt-2 text-sm font-semibold text-kw-ink/60">
                    Edición desbloqueada: te quedan unos {Math.max(minutes, 0)} min.
                </p>
                <button
                    type="button"
                    onClick={lockEdit}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-kw-pink-soft px-5 py-2 text-sm font-bold transition active:scale-95"
                >
                    <FiLock /> Bloquear ahora
                </button>
            </header>

            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
                <div className="space-y-6">
                    <NewMemory onCreated={() => setRefreshKey((k) => k + 1)} />
                    <ChangePassword />
                </div>
                <MyMemories refreshKey={refreshKey} />
            </div>
        </section>
    )
}