import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiPlay, FiPlus, FiX } from 'react-icons/fi'
import Switch from './Switch'
import IconPicker from './IconPicker'
import { useAuth } from '../../context/AuthContext'
import { createMemory, friendlyError, MAX_FILES, validateFile } from '../../lib/memories'
import { readExifDate, todayISO } from '../../lib/imageTools'
import { heartBurst } from '../../utils/confettiHearts'
import { formatDate } from '../../utils/formatDate'

const input =
    'w-full rounded-2xl border-2 border-kw-sky-deep/40 bg-white px-4 py-3 text-base outline-none transition focus:border-kw-pink'

export default function NewMemory() {
    const { profile } = useAuth()
    const qc = useQueryClient()
    const [items, setItems] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(todayISO)
    const [exifDate, setExifDate] = useState(null)
    const [inGallery, setInGallery] = useState(true)
    const [inTimeline, setInTimeline] = useState(false)
    const [inSurprise, setInSurprise] = useState(false)
    const [icon, setIcon] = useState('generico')
    const [progress, setProgress] = useState(null)
    const [error, setError] = useState('')
    const [ok, setOk] = useState(false)
    const [drag, setDrag] = useState(false)
    const urls = useRef([])

    useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), [])

    const addFiles = (list) => {
        setError('')
        setOk(false)
        const next = [...items]
        for (const file of Array.from(list)) {
            const problem = validateFile(file)
            if (problem) {
                setError(problem)
                continue
            }
            const dup = next.some(
                (i) => i.file.name === file.name && i.file.size === file.size && i.file.lastModified === file.lastModified
            )
            if (dup) continue
            if (next.length >= MAX_FILES) {
                setError(`Máximo ${MAX_FILES} archivos por recuerdo.`)
                break
            }
            const url = URL.createObjectURL(file)
            urls.current.push(url)
            next.push({ id: crypto.randomUUID(), file, url })
        }
        setItems(next)

        if (!exifDate) {
            const firstImage = next.find((i) => i.file.type.startsWith('image/'))
            if (firstImage) readExifDate(firstImage.file).then((d) => d && setExifDate(d))
        }
    }

    const remove = (id) => {
        const it = items.find((i) => i.id === id)
        if (it) URL.revokeObjectURL(it.url)
        setItems((list) => list.filter((i) => i.id !== id))
    }

    const busy = !!progress
    const needsFiles = inGallery && items.length === 0
    const canSend = !busy && title.trim() && (inGallery || inTimeline || inSurprise) && !needsFiles

    const submit = async (e) => {
        e.preventDefault()
        if (!canSend) return
        setError('')
        setOk(false)
        setProgress({ phase: 'prepare', done: 0, total: items.length })
        try {
            await createMemory({
                userId: profile.id,
                title: title.trim(),
                description: description.trim(),
                date,
                inGallery,
                inTimeline,
                inSurprise,
                icon,
                files: items.map((i) => i.file),
                onProgress: setProgress,
            })
            heartBurst({ particleCount: 70, spread: 90, origin: { y: 0.7 } })
            items.forEach((i) => URL.revokeObjectURL(i.url))
            setItems([])
            setTitle('')
            setDescription('')
            setDate(todayISO())
            setExifDate(null)
            setIcon('generico')
            setInSurprise(false)
            setOk(true)
            qc.invalidateQueries({ queryKey: ['memories'] })
        } catch (err) {
            setError(friendlyError(err))
        } finally {
            setProgress(null)
        }
    }

    const steps = progress ? progress.total * 2 + 1 : 1
    const doneSteps = !progress
        ? 0
        : progress.phase === 'prepare'
            ? progress.done
            : progress.phase === 'upload'
                ? progress.total + progress.done
                : progress.total * 2
    const label = !progress
        ? 'Guardar recuerdo'
        : progress.phase === 'prepare'
            ? `Preparando ${Math.min(progress.done + 1, progress.total)} de ${progress.total}...`
            : progress.phase === 'upload'
                ? `Subiendo ${Math.min(progress.done + 1, progress.total)} de ${progress.total}...`
                : 'Guardando recuerdo...'

    return (
        <form
            onSubmit={submit}
            className="rounded-4xl border-2 border-dashed border-kw-pink/70 bg-white/80 p-5 shadow-lg backdrop-blur sm:p-6"
        >
            <h2 className="font-title text-3xl">Nuevo recuerdo</h2>
            <p className="text-sm font-semibold text-kw-ink/70">Fotos y videos de los dos juntos</p>

            <label
                onDragOver={(e) => {
                    e.preventDefault()
                    setDrag(true)
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDrag(false)
                    addFiles(e.dataTransfer.files)
                }}
                className={`mt-4 grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed px-4 py-8 text-center transition ${drag ? 'border-kw-pink bg-kw-pink-soft' : 'border-kw-sky-deep/50 bg-white/60'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    onChange={(e) => {
                        addFiles(e.target.files)
                        e.target.value = ''
                    }}
                    className="sr-only"
                />
                <span className="grid size-12 place-items-center rounded-full bg-kw-pink text-2xl text-white shadow-lg">
                    <FiPlus />
                </span>
                <span className="mt-2 font-bold">Elegir fotos o videos</span>
                <span className="text-xs font-semibold text-kw-ink/60">
                    Fotos hasta 40 MB. Videos hasta 50 MB. Máximo {MAX_FILES}.
                </span>
            </label>

            {items.length > 0 && (
                <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    <AnimatePresence initial={false}>
                        {items.map((it) => (
                            <motion.li
                                key={it.id}
                                layout
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                className="relative aspect-square overflow-hidden rounded-2xl bg-kw-pink-soft shadow"
                            >
                                {it.file.type.startsWith('video/') ? (
                                    <>
                                        <video src={it.url} muted playsInline preload="metadata" className="size-full object-cover" />
                                        <span className="absolute bottom-1 left-1 grid size-6 place-items-center rounded-full bg-white/90 text-xs text-kw-ink">
                                            <FiPlay />
                                        </span>
                                    </>
                                ) : (
                                    <img src={it.url} alt="" className="size-full object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => remove(it.id)}
                                    disabled={busy}
                                    aria-label="Quitar"
                                    className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-white/90 text-sm text-kw-ink shadow transition active:scale-90"
                                >
                                    <FiX />
                                </button>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}

            <div className="mt-4 space-y-3">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    placeholder="Título del recuerdo"
                    aria-label="Título"
                    className={input}
                />
                <div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        placeholder="Cuenta cómo fue ese momento (opcional)"
                        aria-label="Descripción"
                        className={`${input} resize-none`}
                    />
                    <p className="mt-1 text-right text-xs font-bold text-kw-ink/50">{description.length}/2000</p>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold" htmlFor="memory-date">
                        Fecha del recuerdo
                    </label>
                    <input
                        id="memory-date"
                        type="date"
                        value={date}
                        max={todayISO()}
                        onChange={(e) => setDate(e.target.value || todayISO())}
                        className={input}
                    />
                    {exifDate && exifDate !== date && (
                        <button
                            type="button"
                            onClick={() => setDate(exifDate)}
                            className="mt-2 rounded-full bg-kw-butter px-3 py-1 text-xs font-bold text-amber-900 shadow transition active:scale-95"
                        >
                            Usar la fecha de la foto: {formatDate(exifDate)}
                        </button>
                    )}
                </div>

                <Switch
                    checked={inGallery}
                    onChange={setInGallery}
                    label="Mostrar en la galería"
                    hint="Aparece como foto en la galería"
                />
                <Switch
                    checked={inTimeline}
                    onChange={setInTimeline}
                    label="Mostrar en la línea de tiempo"
                    hint="Aparece como un capítulo de nuestra historia"
                />
                <Switch
                    checked={inSurprise}
                    onChange={setInSurprise}
                    label="Para la sorpresa final"
                    hint="Solo se ve cuando se abre el regalo"
                />

                {inTimeline && (
                    <div>
                        <p className="mb-2 text-sm font-bold">Ícono en la línea de tiempo</p>
                        <IconPicker value={icon} onChange={setIcon} />
                    </div>
                )}

                {!inGallery && !inTimeline && !inSurprise && (
                    <p className="text-sm font-bold text-rose-500">Elige al menos un lugar donde mostrarlo.</p>
                )}
                {needsFiles && (
                    <p className="text-sm font-bold text-rose-500">
                        Para la galería necesitas al menos una foto o un video.
                    </p>
                )}
            </div>

            {progress && (
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-kw-pink-soft">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-kw-pink to-kw-butter-deep transition-all duration-300"
                        style={{ width: `${(doneSteps / steps) * 100}%` }}
                    />
                </div>
            )}

            {error && (
                <motion.p key={error} animate={{ x: [0, -8, 8, -5, 5, 0] }} className="mt-3 text-sm font-bold text-rose-500">
                    {error}
                </motion.p>
            )}
            <AnimatePresence>
                {ok && (
                    <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-600"
                    >
                        <FiCheck /> Recuerdo guardado
                    </motion.p>
                )}
            </AnimatePresence>

            <motion.button
                type="submit"
                disabled={!canSend}
                whileTap={{ scale: 0.96 }}
                className="mt-4 w-full rounded-full bg-kw-pink px-6 py-3.5 text-lg font-extrabold text-white shadow-lg shadow-pink-300/60 disabled:opacity-50"
            >
                {label}
            </motion.button>
        </form>
    )
}