import { Suspense, useState } from 'react'
import PageLoader from '../ui/PageLoader'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AudioProvider } from '../../context/AudioContext'
import Background from './Background'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import IntroGate from './IntroGate'

const KEY = 'intro-ok'

const seen = () => {
    try {
        return sessionStorage.getItem(KEY) === '1'
    } catch {
        return false
    }
}

function Shell() {
    const location = useLocation()
    const outlet = useOutlet()
    const [entered, setEntered] = useState(seen)

    const onEnter = () => {
        try {
            sessionStorage.setItem(KEY, '1')
        } catch {
            /* sin almacenamiento: se ignora */
        }
        setEntered(true)
    }

    return (
        <div className="relative min-h-dvh overflow-x-clip">
            <ScrollProgress />
            <Background />
            <Navbar />

            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                <motion.main
                    key={location.pathname}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                >
                    <Suspense fallback={<PageLoader />}>{outlet}</Suspense>
                </motion.main>
            </AnimatePresence>

            <Footer />
            <BottomNav />

            <AnimatePresence>{!entered && <IntroGate onEnter={onEnter} />}</AnimatePresence>
        </div>
    )
}

export default function Layout() {
    return (
        <AudioProvider>
            <Shell />
        </AudioProvider>
    )
}