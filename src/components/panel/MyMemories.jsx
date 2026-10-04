import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiVideo } from 'react-icons/fi'
import BlurImage from '../ui/BlurImage'
import useSignedUrls from '../../hooks/useSignedUrls'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatDate'

const firstMedia = (m) => [...(m.media ?? [])].sort((a, b) => a.position - b.position)[0]

function Badge({ children, tone = 'pink' }) {
    const tones = {
        pink: 'bg-kw-pink-soft text-kw-pink-deep',
        blue: 'bg-sky-100 text-sky-700',
        gray: 'bg-kw-ink/10 text-kw-ink/70',
    }
    return <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${tones[tone]}`}>{children}</span>
}

export default function MyMemories({ refreshKey }) {
    const { profile } = useAuth()
    const [rows, setRows] = useState(null)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        const { data, error: e } = await supabase
            .from('memories')
            .select(
                'id, title, memory_date, in_gallery, in_timeline, is_active, created_by, author:profiles!memories_created_by_fkey(display_name), media(id, kind, path_thumb, blur, position)'
            )
            .order('memory_date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(100)
        if (e) setError(e.message)
        else setRows(data)
    }, [])

    useEffect(() => {
        load()
    }, [load, refreshKey])

    const paths = useMemo(
        () => (rows ?? []).map((m) => firstMedia(m)?.path_thumb).filter(Boolean),
        [rows]
    )
    const urls = useSignedUrls(paths)

    const toggle = async (m) => {
        const next = !m.is_active
        setRows((rs) => rs.map((r) => (r.id === m.id ? { ...r, is_active: next } : r)))
        const { error: e } = await supabase.from('memories').update({ is_active: next }).eq('id', m.id)
        if (e) {
            setError(e.message)
            load()
        }
    }

    return (
        <section className="rounded-4xl border-2 border-dashed border-kw-sky-deep/60 bg-white/80 p-5 shadow-lg backdrop-blur sm:p-6">
            <h2 className="font-title text-3xl">Recuerdos guardados</h2>
            <p className="text-sm font-semibold text-kw-ink/70">
                Desactivar un recuerdo lo oculta, pero no se borra. Solo puedes cambiar los que subiste tú.
            </p>

            {error && <p className="mt-3 text-sm font-bold text-rose-500">Error: {error}</p>}
            {rows === null && !error && <p className="mt-4 font-semibold">Cargando...</p>}
            {rows?.length === 0 && (
                <p className="mt-4 font-semibold text-kw-ink/70">Todavía no hay recuerdos. Sube el primero.</p>
            )}

            <ul className="mt-4 space-y-3">
                {rows?.map((m) => {
                    const media = firstMedia(m)
                    const mine = m.created_by === profile?.id
                    return (
                        <motion.li
                            key={m.id}
                            layout
                            className={`flex items-center gap-3 rounded-3xl bg-white p-3 shadow transition ${m.is_active ? '' : 'opacity-60'
                                }`}
                        >
                            <BlurImage
                                src={media?.path_thumb ? urls[media.path_thumb] : null}
                                blur={media?.blur}
                                alt={m.title}
                                className="size-20 shrink-0 rounded-2xl"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-title text-xl leading-tight">{m.title}</p>
                                <p className="text-xs font-semibold text-kw-ink/60">
                                    {formatDate(m.memory_date)} · {m.author?.display_name ?? 'Alguien'}
                                    {media?.kind === 'video' && (
                                        <FiVideo className="ml-1 inline" aria-label="Incluye video" />
                                    )}
                                    {(m.media?.length ?? 0) > 1 && ` · ${m.media.length} archivos`}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {m.in_gallery && <Badge>Galería</Badge>}
                                    {m.in_timeline && <Badge tone="blue">Línea de tiempo</Badge>}
                                    {!m.is_active && <Badge tone="gray">Desactivado</Badge>}
                                </div>
                            </div>
                            {mine && (
                                <button
                                    type="button"
                                    onClick={() => toggle(m)}
                                    aria-label={m.is_active ? 'Desactivar recuerdo' : 'Reactivar recuerdo'}
                                    className="grid size-10 shrink-0 place-items-center rounded-full bg-kw-pink-soft text-lg text-kw-pink-deep transition active:scale-90"
                                >
                                    {m.is_active ? <FiEyeOff /> : <FiEye />}
                                </button>
                            )}
                        </motion.li>
                    )
                })}
            </ul>
        </section>
    )
}