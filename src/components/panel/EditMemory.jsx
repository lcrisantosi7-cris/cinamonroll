import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiPlus, FiVideo, FiX } from 'react-icons/fi'
import Switch from './Switch'
import IconPicker from './IconPicker'
import BlurImage from '../ui/BlurImage'
import useSignedUrls from '../../hooks/useSignedUrls'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { addMedia, friendlyError, MAX_FILES, validateFile } from '../../lib/memories'
import { todayISO } from '../../lib/imageTools'

const input =
    'w-full rounded-2xl border-2 border-kw-sky-deep/40 bg-white px-4 py-3 text-base outline-none transition focus:border-kw-pink'

export default function EditMemory({ memory, onClose }) {
    const { profile } = useAuth()
    const qc = useQueryClient()
    const [title, setTitle] = useState(memory.title)
    const [description, setDescription] = useState(memory.description)
    const [date, setDate] = useState(memory.memory_date)
    const [inGallery, setInGallery] = useState(memory.in_gallery)
    const [inTimeline, setInTimeline] = useState(memory.in_timeline)
    const [icon, setIcon] = useState(memory.icon)
    const [active, setActive] = useState({})
    const [busy, setBusy] = useState(false)
    const [progress, setProgress] = useState(null)
    const [error, setError] = useState('')
    const fileRef = useRef(null)

    const thumbs = useSignedUrls(memory.media.map((m) => m.path_thumb))
    const isActive = (m) => active[m.id] ?? m.is_active

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && !busy && onClose()
        window.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [busy, onClose])

    const save = async () => {
        if (!title.trim() || !(inGallery || inTimeline || inSurprise)) return
        setBusy(true)
        setError('')
        try {
            const { error: e } = await supabase
                .from('memories')
                .update({
                    title: title.trim(),
                    description: description.trim(),
                    memory_date: date,
                    in_gallery: inGallery,
                    in_timeline: inTimeline,
                    in_surprise: inSurprise,
                    icon,
                })
                .eq('id', memory.id)
            if (e) throw e

            const changed = memory.media.filter((m) => active[m.id] !== undefined && active[m.id] !== m.is_active)
            await Promise.all(
                changed.map(async (m) => {
                    const { error: me } = await supabase.from('media').update({ is_active: active[m.id] }).eq('id', m.id)
                    if (me) throw me
                })
            )
            await qc.invalidateQueries({ queryKey: ['memories'] })
            onClose()
        } catch (err) {
            setError(friendlyError(err))
        } finally {
            setBusy(false)
        }
    }

    const onAddFiles = async (list) => {
        const files = Array.from(list)
        if (!files.length) return
        const problem = files.map(validateFile).find(Boolean)
        if (problem) return setError(problem)
        if (memory.media.length + files.length > MAX_FILES) {
            return setError(`Máximo ${MAX_FILES} archivos por recuerdo.`)
        }
        setBusy(true)
        setError('')
        setProgress({ phase: 'prepare', done: 0, total: files.length })
        try {
            const startPosition = Math.max(-1, ...memory.media.map((m) => m.position)) + 1
            await addMedia({ userId: profile.id, memoryId: memory.id, files, startPosition, onProgress: setProgress })
            await qc.invalidateQueries({ queryKey: ['memories'] })
        } catch (err) {
            setError(friendlyError(err))
        } finally {
            setBusy(false)
            setProgress(null)
        }
    }

    const label = progress
        ? progress.phase === 'prepare'
            ? `Preparando ${Math.min(progress.done + 1, progress.total)} de ${progress.total}...`
            : `Subiendo ${Math.min(progress.done + 1, progress.total)} de ${progress.total}...`
        : null

    const [inSurprise, setInSurprise] = useState(memory.in_surprise)


    return (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-kw-ink/50 p-4 backdrop-blur-sm" onClick={() => !busy && onClose()}>
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="mx-auto my-6 w-full max-w-lg rounded-4xl bg-white p-5 shadow-2xl sm:p-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-title text-3xl">Editar recuerdo</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        aria-label="Cerrar"
                        className="grid size-10 place-items-center rounded-full bg-kw-pink-soft text-lg text-kw-ink transition active:scale-90"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} aria-label="Título" className={input} />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        aria-label="Descripción"
                        className={`${input} resize-none`}
                    />
                    <input
                        type="date"
                        value={date}
                        max={todayISO()}
                        onChange={(e) => setDate(e.target.value || memory.memory_date)}
                        aria-label="Fecha"
                        className={input}
                    />
                    <Switch checked={inGallery} onChange={setInGallery} label="Mostrar en la galería" />
                    <Switch checked={inTimeline} onChange={setInTimeline} label="Mostrar en la línea de tiempo" />
                    <Switch
                        checked={inSurprise}
                        onChange={setInSurprise}
                        label="Para la sorpresa final"
                        hint="Solo se ve cuando se abre el regalo"
                    />
                    {inTimeline && <IconPicker value={icon} onChange={setIcon} />}
                    {!inGallery && !inTimeline && (
                        <p className="text-sm font-bold text-rose-500">Elige al menos un lugar donde mostrarlo.</p>
                    )}
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-sm font-bold">Fotos y videos ({memory.media.length})</p>
                    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {memory.media.map((m) => (
                            <li key={m.id} className={`relative aspect-square ${isActive(m) ? '' : 'opacity-40'}`}>
                                <BlurImage
                                    src={thumbs[m.path_thumb]}
                                    blur={m.blur}
                                    className="size-full rounded-2xl shadow"
                                />
                                {m.kind === 'video' && (
                                    <span className="absolute bottom-1 left-1 grid size-6 place-items-center rounded-full bg-white/90 text-xs text-kw-ink">
                                        <FiVideo />
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setActive((a) => ({ ...a, [m.id]: !isActive(m) }))}
                                    aria-label={isActive(m) ? 'Ocultar archivo' : 'Mostrar archivo'}
                                    className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-white/90 text-sm text-kw-ink shadow transition active:scale-90"
                                >
                                    {isActive(m) ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </li>
                        ))}
                        <li className="aspect-square">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => fileRef.current?.click()}
                                className="grid size-full place-items-center rounded-2xl border-2 border-dashed border-kw-sky-deep/60 bg-white/70 text-2xl text-kw-pink-deep transition active:scale-95"
                                aria-label="Agregar más archivos"
                            >
                                <FiPlus />
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                multiple
                                accept="image/*,video/mp4,video/webm,video/quicktime"
                                className="sr-only"
                                onChange={(e) => {
                                    onAddFiles(e.target.files)
                                    e.target.value = ''
                                }}
                            />
                        </li>
                    </ul>
                    {label && <p className="mt-2 text-sm font-bold text-kw-pink-deep">{label}</p>}
                </div>

                {error && <p className="mt-3 text-sm font-bold text-rose-500">{error}</p>}

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="flex-1 rounded-full bg-kw-pink-soft px-4 py-3 font-bold text-kw-ink transition active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        disabled={busy || !title.trim() || !(inGallery || inTimeline || inSurprise)}
                        className="flex-1 rounded-full bg-kw-pink px-4 py-3 font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50"
                    >
                        {busy && !progress ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}