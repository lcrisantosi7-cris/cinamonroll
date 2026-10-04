import { useEffect, useState } from 'react'
import { FiLock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Panel() {
    const { profile, editUntil, lockEdit } = useAuth()
    const [count, setCount] = useState(null)
    const [error, setError] = useState('')
    const [minutes, setMinutes] = useState(() => Math.ceil((editUntil - Date.now()) / 60000))

    useEffect(() => {
        supabase
            .from('memories')
            .select('id', { count: 'exact', head: true })
            .then(({ count: c, error: e }) => {
                if (e) setError(e.message)
                else setCount(c)
            })
    }, [])

    useEffect(() => {
        const id = setInterval(() => setMinutes(Math.ceil((editUntil - Date.now()) / 60000)), 15000)
        return () => clearInterval(id)
    }, [editUntil])

    return (
        <section className="mx-auto max-w-2xl px-4 pb-10 pt-8 text-center sm:pt-12">
            <h1 className="font-title text-4xl sm:text-5xl">Panel de edición</h1>
            <p className="mt-1 font-semibold text-kw-ink/80">Hola, {profile?.display_name}</p>

            <div className="mt-8 rounded-4xl border-2 border-dashed border-kw-pink/70 bg-white/80 p-6 shadow-lg backdrop-blur">
                <p className="font-title text-2xl">Conexión con la base de datos</p>
                {error ? (
                    <p className="mt-2 text-sm font-bold text-rose-500">Error: {error}</p>
                ) : (
                    <p className="mt-2 text-lg font-semibold">
                        {count === null ? 'Comprobando...' : `Todo bien. Recuerdos guardados: ${count}`}
                    </p>
                )}
                <p className="mt-3 text-sm font-semibold text-kw-ink/70">
                    Edición desbloqueada: te quedan unos {Math.max(minutes, 0)} min.
                </p>
                <button
                    type="button"
                    onClick={lockEdit}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-kw-pink-soft px-5 py-2 font-bold transition active:scale-95"
                >
                    <FiLock /> Bloquear ahora
                </button>
            </div>

            <p className="mt-6 text-sm font-semibold text-kw-ink/60">
                Próximamente aquí: subir fotos y videos, editar recuerdos, cartas y cupones.
            </p>
        </section>
    )
}