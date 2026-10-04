import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Card from '../ui/Card'
import ButtonLink from '../ui/ButtonLink'
import Sticker from '../ui/Sticker'
import { LETTER } from '../../data/letter'

export default function LetterPreview() {
    return (
        <Card tone="pink" tilt className="flex h-full flex-col">
            <Sticker name="decor/bow" float className="absolute -top-6 left-1/2 w-16 -translate-x-1/2" />
            <h2 className="mt-3 -rotate-1 font-title text-3xl">Una carta para ti</h2>

            <motion.div initial="rest" whileHover="open" whileTap="open" className="relative mt-5 flex-1">
                <motion.div
                    variants={{ rest: { rotate: -4, x: 0 }, open: { rotate: -9, x: -10 } }}
                    className="absolute inset-0 rounded-xl bg-white/70 shadow"
                />
                <motion.div
                    variants={{ rest: { rotate: 3, x: 0 }, open: { rotate: 7, x: 10 } }}
                    className="absolute inset-0 rounded-xl bg-pink-100 shadow"
                />
                <div
                    className="relative rounded-xl bg-white p-5 shadow-md"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #ffd9e6 27px, #ffd9e6 28px)',
                    }}
                >
                    <p className="line-clamp-5 font-title text-xl leading-7 text-kw-ink">{LETTER.preview}</p>
                </div>
            </motion.div>

            <div className="mt-5 flex items-end justify-between">
                <ButtonLink to="/carta">
                    Leer carta <FiArrowRight />
                </ButtonLink>
                <Sticker name="characters/cinnamoroll" float className="w-20 sm:w-24" />
            </div>
        </Card>
    )
}