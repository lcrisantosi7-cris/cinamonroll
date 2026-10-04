import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import Envelope from '../components/letter/Envelope'
import LetterPaper from '../components/letter/LetterPaper'
import LetterPicker from '../components/letter/LetterPicker'
import { LETTERS } from '../data/letter'
import { getProgress, markLetterRead } from '../utils/progress'

const OPEN_MS = 2100

const isLocked = (l) => !!l.unlockAt && new Date(l.unlockAt) > new Date()

export default function Letter() {
    const [selected, setSelected] = useState(0)
    const [stage, setStage] = useState('closed') // closed | opening | open
    const [read, setRead] = useState(() => getProgress().lettersRead)
    const letter = LETTERS[selected]
    const many = LETTERS.length > 1

    useEffect(() => {
        if (stage !== 'opening') return
        const t = setTimeout(() => setStage('open'), OPEN_MS)
        return () => clearTimeout(t)
    }, [stage])

    const onRead = useCallback((id) => {
        markLetterRead(id)
        setRead((r) => (r[id] ? r : { ...r, [id]: true }))
    }, [])

    const select = (i) => {
        if (i === selected) return
        setSelected(i)
        setStage('closed')
    }

    const next = () => {
        setSelected((s) => Math.min(s + 1, LETTERS.length - 1))
        setStage('closed')
    }

    return (
        <section className="mx-auto max-w-3xl px-4 pb-10 pt-8 text-center sm:pt-12">
            <h1 className="font-title text-4xl sm:text-5xl">
                {many ? 'Mis cartas para ti' : letter.title}{' '}
                <FiHeart className="inline text-kw-pink" />
            </h1>
            <p className="mt-1 font-semibold text-kw-ink/80">
                {many && stage !== 'open' ? 'Elige un sobre para abrirlo' : 'Escrita con todo mi corazón'}
            </p>

            {stage !== 'open' && (
                <LetterPicker letters={LETTERS} selected={selected} onSelect={select} read={read} />
            )}

            <AnimatePresence mode="wait">
                {stage === 'open' ? (
                    <LetterPaper
                        key={`paper-${letter.id}`}
                        letter={letter}
                        onClose={() => setStage('closed')}
                        onNext={next}
                        hasNext={selected < LETTERS.length - 1}
                        onRead={onRead}
                    />
                ) : (
                    <Envelope
                        key={`envelope-${letter.id}`}
                        letter={letter}
                        opening={stage === 'opening'}
                        locked={isLocked(letter)}
                        onOpen={() => setStage('opening')}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}