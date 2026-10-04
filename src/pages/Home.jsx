import Hero from '../components/home/Hero'
import QuickMenu from '../components/home/QuickMenu'
import LetterPreview from '../components/home/LetterPreview'
import GalleryPreview from '../components/home/GalleryPreview'
import LovedThingsPreview from '../components/home/LovedThingsPreview'
import TimelinePreview from '../components/home/TimelinePreview'
import DaysCounter from '../components/home/DaysCounter'
import GamesSurprise from '../components/home/GamesSurprise'
import Reveal from '../components/ui/Reveal'

export default function Home() {
    return (
        <>
            <Hero />
            <QuickMenu />

            <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-5 px-4 md:grid-cols-2 lg:grid-cols-3">
                <Reveal className="h-full min-w-0"><LetterPreview /></Reveal>
                <Reveal className="h-full min-w-0" delay={0.1}><GalleryPreview /></Reveal>
                <Reveal className="h-full min-w-0 md:col-span-2 lg:col-span-1" delay={0.2}><LovedThingsPreview /></Reveal>
            </div>

            <div className="mx-auto mt-5 grid max-w-7xl grid-cols-1 gap-5 px-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <Reveal className="h-full min-w-0"><TimelinePreview /></Reveal>
                <Reveal className="h-full min-w-0" delay={0.1}><DaysCounter /></Reveal>
            </div>

            <div className="mx-auto mt-5 grid max-w-7xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
                <GamesSurprise />
            </div>
        </>
    )
}