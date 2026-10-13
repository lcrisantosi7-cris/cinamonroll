
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FiPlus, FiSave, FiMail, FiCheckCircle } from 'react-icons/fi'

import {
    fetchLettersAdmin,
    fetchLetterBodyAdmin,
    saveLetter,
} from '../../lib/content'

import { useAuth } from '../../context/AuthContext'

const inputClass =
    'w-full rounded-2xl border-2 border-kw-sky-deep/30 bg-white px-4 py-3 text-sm outline-none transition focus:border-kw-pink'

const emptyForm = () => ({
    meta: {
        label: '',
        title: '',
        tone: 'pink',
        letter_date: '',
        unlock_at: '',
        position: 1,
        is_active: true,
    },
    body: {
        greeting: '',
        paragraphs: '',
        closing: '',
        signature: '',
        ps: '',
    },
})

function localDateTime(value) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
}

export default function LettersEditor() {
    const { profile } = useAuth()
    const queryClient = useQueryClient()
    const [selectedId, setSelectedId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [loadingBody, setLoadingBody] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const {
        data: letters = [],
        isLoading,
        isError,
        error: listError,
    } = useQuery({
        queryKey: ['letters-admin'],
        queryFn: fetchLettersAdmin,
    })

    const updateMeta = (key, value) => {
        setForm((current) => ({
            ...current,
            meta: { ...current.meta, [key]: value },
        }))
    }

    const updateBody = (key, value) => {
        setForm((current) => ({
            ...current,
            body: { ...current.body, [key]: value },
        }))
    }

    const newLetter = () => {
        setSelectedId(null)
        setForm(emptyForm())
        setError('')
        setSuccess('')
    }

    const selectLetter = async (letter) => {
        setLoadingBody(true)
        setError('')
        setSuccess('')

        try {
            const body = await fetchLetterBodyAdmin(letter.id)

            setSelectedId(letter.id)
            setForm({
                meta: {
                    label: letter.label ?? '',
                    title: letter.title ?? '',
                    tone: letter.tone ?? 'pink',
                    letter_date: letter.letter_date ?? '',
                    unlock_at: localDateTime(letter.unlock_at),
                    position: letter.position ?? 1,
                    is_active: letter.is_active ?? true,
                },
                body: {
                    greeting: body?.greeting ?? '',
                    paragraphs: Array.isArray(body?.paragraphs)
                        ? body.paragraphs.join('\n\n')
                        : '',
                    closing: body?.closing ?? '',
                    signature: body?.signature ?? '',
                    ps: body?.ps ?? '',
                },
            })
        } catch (err) {
            setError(err.message || 'No se pudo cargar el contenido de la carta.')
        } finally {
            setLoadingBody(false)
        }
    }

    const handleSave = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (!form.meta.label.trim() || !form.meta.title.trim()) {
            setError('Completa el nombre y el título de la carta.')
            return
        }

        if (!profile?.id) {
            setError('No se pudo identificar tu usuario. Vuelve a iniciar sesión.')
            return
        }

        setSaving(true)

        try {
            const savedId = await saveLetter({
                id: selectedId,
                meta: form.meta,
                body: form.body,
                createdBy: profile.id,
            })

            setSelectedId(savedId)
            await queryClient.invalidateQueries({ queryKey: ['letters-admin'] })
            setSuccess('¡Carta guardada correctamente! 💗')
        } catch (err) {
            setError(err.message || 'No se pudo guardar la carta.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <section className="rounded-4xl border-2 border-kw-pink/40 bg-white/85 p-4 shadow-lg backdrop-blur sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="font-title text-3xl">Cartitas para Lili 💌</h2>
                    <p className="mt-1 text-sm font-semibold text-kw-ink/65">
                        Crea nuevas cartas o edita las que ya existen.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={newLetter}
                    className="inline-flex items-center gap-2 rounded-full bg-kw-pink px-4 py-2.5 text-sm font-extrabold text-white shadow transition active:scale-95"
                >
                    <FiPlus /> Nueva carta
                </button>
            </div>

            <div className="mt-5 grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <aside className="rounded-3xl bg-kw-pink-soft/50 p-3">
                    <h3 className="px-2 py-2 font-bold">Tus cartas</h3>

                    {isLoading && (
                        <p className="p-2 text-sm">Cargando cartas...</p>
                    )}

                    {isError && (
                        <p className="p-2 text-sm font-semibold text-rose-600">
                            {listError?.message || 'No se pudieron cargar las cartas.'}
                        </p>
                    )}

                    {!isLoading && !isError && letters.length === 0 && (
                        <p className="p-2 text-sm text-kw-ink/65">
                            Todavía no hay cartas.
                        </p>
                    )}

                    <div className="space-y-2">
                        {letters.map((letter) => (
                            <button
                                key={letter.id}
                                type="button"
                                onClick={() => selectLetter(letter)}
                                className={`w-full rounded-2xl border-2 p-3 text-left transition ${selectedId === letter.id
                                    ? 'border-kw-pink bg-white shadow'
                                    : 'border-transparent bg-white/60 hover:border-kw-pink/40'
                                    }`}
                            >
                                <span className="flex items-start gap-2">
                                    <FiMail className="mt-1 shrink-0 text-kw-pink-deep" />
                                    <span className="min-w-0">
                                        <span className="block break-words font-bold">
                                            {letter.label}
                                        </span>
                                        <span className="mt-1 block break-words text-xs text-kw-ink/65">
                                            {letter.title}
                                        </span>
                                        <span className="mt-2 inline-block rounded-full bg-kw-pink-soft px-2 py-0.5 text-[10px] font-bold">
                                            {letter.is_active ? 'Activa' : 'Oculta'}
                                        </span>
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <h3 className="font-title text-2xl">
                            {selectedId ? 'Editar carta' : 'Crear una carta nueva'}
                        </h3>
                        <p className="text-xs text-kw-ink/60">
                            Los cambios se guardan en tu base de datos.
                        </p>
                    </div>

                    {loadingBody && (
                        <p className="rounded-2xl bg-sky-50 p-3 text-sm font-semibold text-sky-800">
                            Cargando el contenido...
                        </p>
                    )}

                    <fieldset disabled={saving || loadingBody} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-bold">
                                Nombre para elegir la carta
                            </label>
                            <input
                                className={inputClass}
                                value={form.meta.label}
                                onChange={(e) => updateMeta('label', e.target.value)}
                                placeholder="Ej. Para cuando me extrañes"
                                maxLength={120}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold">
                                Título de la carta
                            </label>
                            <input
                                className={inputClass}
                                value={form.meta.title}
                                onChange={(e) => updateMeta('title', e.target.value)}
                                placeholder="Ej. Una cartita para mi princesa"
                                maxLength={160}
                                required
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Estilo
                                </label>
                                <select
                                    className={inputClass}
                                    value={form.meta.tone}
                                    onChange={(e) => updateMeta('tone', e.target.value)}
                                >
                                    <option value="pink">Rosado</option>
                                    <option value="blue">Azul</option>
                                    <option value="butter">Amarillo</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Posición
                                </label>
                                <input
                                    className={inputClass}
                                    type="number"
                                    min="1"
                                    value={form.meta.position}
                                    onChange={(e) => updateMeta('position', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Fecha de la carta
                                </label>
                                <input
                                    className={inputClass}
                                    type="date"
                                    value={form.meta.letter_date}
                                    onChange={(e) => updateMeta('letter_date', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Desbloquear el
                                </label>
                                <input
                                    className={inputClass}
                                    type="datetime-local"
                                    value={form.meta.unlock_at}
                                    onChange={(e) => updateMeta('unlock_at', e.target.value)}
                                />
                                <p className="mt-1 text-xs text-kw-ink/55">
                                    Déjalo vacío para no establecer una fecha.
                                </p>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 rounded-2xl bg-kw-pink-soft/50 p-3 text-sm font-bold">
                            <input
                                type="checkbox"
                                checked={form.meta.is_active}
                                onChange={(e) => updateMeta('is_active', e.target.checked)}
                                className="size-4 accent-pink-500"
                            />
                            Mostrar esta carta en la página
                        </label>

                        <div className="rounded-3xl border border-kw-sky-deep/20 p-4">
                            <h4 className="mb-3 font-bold">Contenido de la carta</h4>

                            <label className="mb-1 block text-sm font-bold">
                                Saludo inicial
                            </label>
                            <input
                                className={inputClass}
                                value={form.body.greeting}
                                onChange={(e) => updateBody('greeting', e.target.value)}
                                placeholder="Mi querida Lili..."
                            />

                            <label className="mb-1 mt-4 block text-sm font-bold">
                                Párrafos
                            </label>
                            <textarea
                                className={`${inputClass} resize-y`}
                                rows={8}
                                value={form.body.paragraphs}
                                onChange={(e) => updateBody('paragraphs', e.target.value)}
                                placeholder={'Escribe aquí tu carta.\n\nDeja una línea vacía entre párrafos.'}
                            />
                            <p className="mt-1 text-xs text-kw-ink/55">
                                Cada párrafo separado por una línea vacía se guardará por separado.
                            </p>

                            <label className="mb-1 mt-4 block text-sm font-bold">
                                Despedida
                            </label>
                            <input
                                className={inputClass}
                                value={form.body.closing}
                                onChange={(e) => updateBody('closing', e.target.value)}
                                placeholder="Con todo mi corazón..."
                            />

                            <label className="mb-1 mt-4 block text-sm font-bold">
                                Firma
                            </label>
                            <input
                                className={inputClass}
                                value={form.body.signature}
                                onChange={(e) => updateBody('signature', e.target.value)}
                                placeholder="Tu camote"
                            />

                            <label className="mb-1 mt-4 block text-sm font-bold">
                                Posdata (opcional)
                            </label>
                            <textarea
                                className={`${inputClass} resize-y`}
                                rows={2}
                                value={form.body.ps}
                                onChange={(e) => updateBody('ps', e.target.value)}
                                placeholder="P.D. Te quiero mucho..."
                            />
                        </div>
                    </fieldset>

                    {error && (
                        <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                            <FiCheckCircle /> {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving || loadingBody}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-kw-pink px-5 py-3 font-extrabold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FiSave />
                        {saving ? 'Guardando...' : 'Guardar carta'}
                    </button>
                </form>
            </div>
        </section>
    )
}
