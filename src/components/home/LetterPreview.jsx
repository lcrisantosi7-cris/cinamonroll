import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiArrowRight, FiHeart } from 'react-icons/fi'
import Card from '../ui/Card'
import ButtonLink from '../ui/ButtonLink'
import Sticker from '../ui/Sticker'
import { fetchLetterBody, fetchLetters } from '../../lib/content'

const isLocked = (letter) =>
    !!letter.unlockAt && new Date(letter.unlockAt) > new Date()

export default function LetterPreview() {
    const { data: letters } = useQuery({
        queryKey: ['letters'],
        queryFn: fetchLetters,
    })

    const first = letters?.find((letter) => !isLocked(letter))

    const { data: body } = useQuery({
        queryKey: ['letter-body', first?.id],
        queryFn: () => fetchLetterBody(first.id),
        enabled: !!first,
    })

    const text = body
        ? [body.greeting, ...(body.paragraphs ?? [])]
            .filter(Boolean)
            .slice(0, 3)
            .join(' ')
        : 'Una carta escrita con todo mi corazón, solo para ti.'

    return (
        <Card
            tone="pink"
            tilt
            className="flex h-full min-h-[24rem] flex-col overflow-visible"
        >
            <Sticker
                name="decor/bow"
                float
                className="absolute -top-6 left-1/2 z-10 w-14 -translate-x-1/2 sm:w-16"
            />

            <div className="mt-3 flex items-center justify-center gap-2">
                <FiHeart className="shrink-0 text-kw-pink" />
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-kw-ink/55">
                    Para alguien especial
                </span>
            </div>

            <h2 className="mt-2 text-center font-title text-3xl leading-tight text-kw-ink sm:text-4xl">
                Una carta para ti
            </h2>

            <div className="relative mt-5 flex min-h-36 flex-1 items-stretch px-1 pb-1">
                <motion.div
                    aria-hidden="true"
                    variants={{
                        rest: { rotate: -4, x: -2, y: 2 },
                        open: { rotate: -7, x: -5, y: -2 },
                    }}
                    className="absolute inset-1 rounded-2xl bg-white/70 shadow-md"
                />

                <motion.div
                    aria-hidden="true"
                    variants={{
                        rest: { rotate: 3, x: 2, y: 1 },
                        open: { rotate: 6, x: 5, y: -2 },
                    }}
                    className="absolute inset-1 rounded-2xl bg-pink-100 shadow-md"
                />

                <motion.div
                    initial="rest"
                    whileHover="open"
                    className="relative flex min-h-36 w-full flex-col overflow-hidden rounded-2xl border border-pink-100 bg-[#fffdfd] p-4 shadow-sm sm:p-5"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #f9dce6 27px, #f9dce6 28px)',
                        backgroundPosition: '0 8px',
                    }}
                >
                    <p className="font-title text-lg leading-7 text-kw-ink/80 sm:text-xl">
                        Mi persona favorita...
                    </p>

                    <p className="mt-1 line-clamp-4 break-words font-title text-lg leading-7 text-kw-ink sm:text-xl">
                        {text}
                    </p>

                    <span className="mt-auto self-end pt-2 font-title text-sm text-kw-pink-deep">
                        Con todo mi amor ♡
                    </span>
                </motion.div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
                <ButtonLink to="/carta">
                    Leer carta <FiArrowRight />
                </ButtonLink>

                <Sticker
                    name="characters/cinnamoroll"
                    float
                    className="w-16 shrink-0 sm:w-20"
                />
            </div>
        </Card>
    )
}