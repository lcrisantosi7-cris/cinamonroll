import { useState } from 'react'
import { FiKey } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'

const input =
    'w-full rounded-2xl border-2 border-kw-sky-deep/40 bg-white px-4 py-3 text-base outline-none transition focus:border-kw-pink'

export default function ChangePassword() {
    const [pwd, setPwd] = useState('')
    const [again, setAgain] = useState('')
    const [busy, setBusy] = useState(false)
    const [msg, setMsg] = useState(null)

    const submit = async (e) => {
        e.preventDefault()
        if (pwd.length < 12) return setMsg({ ok: false, text: 'Usa al menos 12 caracteres.' })
        if (pwd !== again) return setMsg({ ok: false, text: 'Las contraseñas no coinciden.' })

        setBusy(true)
        setMsg(null)
        const { error } = await supabase.auth.updateUser({ password: pwd })
        setBusy(false)

        if (error) {
            const same = error.message.toLowerCase().includes('same')
            return setMsg({
                ok: false,
                text: same
                    ? 'Elige una contraseña distinta a la actual.'
                    : 'No se pudo cambiar. Cierra sesión, vuelve a entrar e inténtalo de nuevo.',
            })
        }
        setPwd('')
        setAgain('')
        setMsg({ ok: true, text: 'Contraseña actualizada.' })
    }

    return (
        <form
            onSubmit={submit}
            className="rounded-4xl border-2 border-dashed border-kw-butter-deep bg-white/80 p-5 shadow-lg backdrop-blur sm:p-6"
        >
            <h2 className="inline-flex items-center gap-2 font-title text-3xl">
                <FiKey /> Mi contraseña
            </h2>
            <p className="text-sm font-semibold text-kw-ink/70">Elige una que solo tú sepas (mínimo 12 caracteres).</p>

            <div className="mt-4 space-y-3">
                <input
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Nueva contraseña"
                    aria-label="Nueva contraseña"
                    className={input}
                />
                <input
                    type="password"
                    value={again}
                    onChange={(e) => setAgain(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repite la contraseña"
                    aria-label="Repite la contraseña"
                    className={input}
                />
            </div>

            {msg && (
                <p className={`mt-3 text-sm font-bold ${msg.ok ? 'text-emerald-600' : 'text-rose-500'}`}>{msg.text}</p>
            )}

            <button
                type="submit"
                disabled={busy || !pwd || !again}
                className="mt-4 w-full rounded-full bg-kw-butter-deep px-6 py-3 font-extrabold text-amber-900 shadow-lg transition active:scale-95 disabled:opacity-50"
            >
                {busy ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
        </form>
    )
}