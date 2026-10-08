import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import Envelope from '../components/letter/Envelope'
import LetterPaper from '../components/letter/LetterPaper'
import LetterPicker from '../components/letter/LetterPicker'
import PageLoader from '../components/ui/PageLoader'
import useProgress from '../hooks/useProgress'
import { fetchLetterBody, fetchLetters, markLetterRead } from '../lib/content'

const OPEN_MS = 2100
const isLocked = (l) => !!l.unlockAt && new Date(l.unlockAt) > new Date()

export default function Letter() {
    const lettersQ = useQuery({ queryKey: ['letters'], queryFn: fetchLetters })
    const { lettersRead } = useProgress()
    const letters = useMemo(() => lettersQ.data ?? [], [lettersQ.data])

    const [selected, setSelected] = useState(0)
    const [stage, setStage] = useState('closed') // closed | opening | open
    const [animDone, setAnimDone] = useState(false)
    const [notice, setNotice] = useState('')

    const meta = letters[selected]
    const locked = meta ? isLocked(meta) : false
    const many = letters.length > 1

    const bodyQ = useQuery({
        queryKey: ['letter-body', meta?.id],
        queryFn: () => fetchLetterBody(meta.id),
        enabled: !!meta && !locked && stage !== 'closed',
    })

    useEffect(() => {
        if (stage !== 'opening') return
        setAnimDone(false)
        const t = setTimeout(() => setAnimDone(true), OPEN_MS)
        return () => clearTimeout(t)
    }, [stage])

    useEffect(() => {
        if (stage !== 'opening' || !animDone) return
        if (bodyQ.data) setStage('open')
        else if (bodyQ.isFetched) {
            setNotice('Esta carta todavía no se puede leer.')
            setStage('closed')
        }
    }, [stage, animDone, bodyQ.data, bodyQ.isFetched])

    const onRead = useCallback((id) => {
        markLetterRead(id)
    }, [])

    const select = (i) => {
        if (i === selected) return
        setSelected(i)
        setStage('closed')
        setNotice('')
    }

    const next = () => {
        setSelected((s) => Math.min(s + 1, letters.length - 1))
        setStage('closed')
        setNotice('')
    }

    if (lettersQ.isPending) return <PageLoader />

    if (!meta) {
        return (
            <section className="mx-auto max-w-xl px-4 pb-10 pt-12 text-center">
                <h1 className="font-title text-4xl">Una carta para ti</h1>
                <p className="mt-3 font-semibold text-kw-ink/70">Todavía no hay cartas.</p>
            </section>
        )
    }

    const letter =
        bodyQ.data && stage === 'open'
            ? {
                ...meta,
                greeting: bodyQ.data.greeting,
                paragraphs: bodyQ.data.paragraphs ?? [],
                closing: bodyQ.data.closing,
                signature: bodyQ.data.signature,
                ps: bodyQ.data.ps,
            }
            : null

    return (
        <section className="mx-auto max-w-3xl px-4 pb-10 pt-8 text-center sm:pt-12">
            <h1 className="font-title text-4xl sm:text-5xl">
                {many ? 'Mis cartas para ti' : meta.title} <FiHeart className="inline text-kw-pink" />
            </h1>
            <p className="mt-1 font-semibold text-kw-ink/80">
                {many && stage !== 'open' ? 'Elige un sobre para abrirlo' : 'Escrita con todo mi corazón'}
            </p>
            {notice && <p className="mt-2 text-sm font-bold text-rose-500">{notice}</p>}

            {stage !== 'open' && (
                <LetterPicker letters={letters} selected={selected} onSelect={select} read={lettersRead} />
            )}

            <AnimatePresence mode="wait">
                {stage === 'open' && letter ? (
                    <LetterPaper
                        key={`paper-${letter.id}`}
                        letter={letter}
                        onClose={() => setStage('closed')}
                        onNext={next}
                        hasNext={selected < letters.length - 1}
                        onRead={onRead}
                    />
                ) : (
                    <Envelope
                        key={`envelope-${meta.id}`}
                        letter={meta}
                        opening={stage === 'opening'}
                        locked={locked}
                        onOpen={() => {
                            setNotice('')
                            setStage('opening')
                        }}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}