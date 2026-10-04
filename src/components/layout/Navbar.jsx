import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { NAV } from '../../data/config'
import { img } from '../../assets'
import MusicPlayer from './MusicPlayer'
import UserMenu from './UserMenu'

export default function Navbar() {
    const { scrollY } = useScroll()
    const [compact, setCompact] = useState(false)
    useMotionValueEvent(scrollY, 'change', (y) => setCompact(y > 24))
    const logo = img('characters/cinnamoroll')

    return (
        <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
            <div
                className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border-2 border-white/80 bg-white/80 px-3 backdrop-blur-md transition-all duration-300 sm:px-5 ${compact ? 'py-1 shadow-xl shadow-sky-300/40' : 'py-2 shadow-lg shadow-sky-200/50'
                    }`}
            >
                <Link to="/" className="flex shrink-0 items-center gap-2">
                    {logo && (
                        <motion.img
                            src={logo}
                            alt=""
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            className="size-9 object-contain"
                        />
                    )}
                    <span className="whitespace-nowrap font-title text-lg leading-[1.05]">
                        Cinnamoroll
                        <span className="block">
                            <span className="text-kw-pink">&amp;</span> Pompompurin
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-0.5 lg:flex">
                    {NAV.filter((n) => n.desktop !== false).map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${isActive ? 'text-kw-pink-deep' : 'text-kw-ink/80 hover:text-kw-pink-deep'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 rounded-full bg-kw-pink-soft"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        <Icon /> {label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <MusicPlayer />
                    <UserMenu />
                </div>
            </div>
        </header>
    )
}