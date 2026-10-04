import { FiHome, FiMail, FiImage, FiHeart, FiCalendar, FiGift, FiMessageCircle } from 'react-icons/fi'
import { LuGamepad2 } from 'react-icons/lu'
import { audio } from '../assets'

export const COUPLE = {
    startDate: '2026-03-16T00:00:00-05:00',
    her: { name: 'Mi amorcito, mi Vida, mi Todo <3', nickname: 'Pan con queso, mi camotito :3' },
    him: { name: 'Luis', nickname: 'Camote' },
}

// bar: true => va en la barra inferior del celular; el resto entra en "Más"
// desktop: false => no se muestra en el menú de PC (Mensajes sigue en el menú rápido del Inicio)
export const NAV = [
    { to: '/', label: 'Inicio', icon: FiHome, bar: true },
    { to: '/carta', label: 'Carta', icon: FiMail, bar: true, asset: 'icons/carta', tone: 'pink' },
    { to: '/galeria', label: 'Galería', icon: FiImage, bar: true, asset: 'icons/galeria', tone: 'sky' },
    { to: '/historia', label: 'Historia', icon: FiCalendar, bar: true, asset: 'icons/historia', tone: 'blue' },
    { to: '/cosas-que-amo', label: 'Lo que amo', icon: FiHeart, asset: 'icons/cosas-que-amo', tone: 'rose' },
    { to: '/mensajes', label: 'Mensajes', icon: FiMessageCircle, desktop: true, asset: 'icons/mensajes', tone: 'purple' },
    { to: '/juegos', label: 'Juegos', icon: LuGamepad2, asset: 'icons/juego-cinnamoroll', tone: 'sky' },
    { to: '/sorpresa', label: 'Sorpresa', icon: FiGift, asset: 'icons/sorpresa', tone: 'pink' },
]

const PLAYLIST = [
    { title: 'Eres mi persona favorita', file: 'eres-mi-persona-favorita' },
    { title: 'silly cat', file: 'silly-cat' },
    { title: 'Cute Circus', file: 'Cute-Circus' },
    { title: 'Mochi-Cat', file: 'Mochi-Cat' },
]

// Solo entran las canciones cuyo archivo existe en src/assets/audio
export const TRACKS = PLAYLIST.map((t) => ({ title: t.title, src: audio(t.file) })).filter(
    (t) => t.src
)

const her = COUPLE.her.nickname.toLowerCase()

export const PHRASES = {
    cinnamoroll: [
        `Hola, ${COUPLE.her.name}`,
        `Hoy estás hermosa, mi ${her}`,
        'Gracias por existir',
        'Te quiero muchísimo',
    ],
    pompompurin: [
        'Eres mi persona favorita',
        'Me haces muy feliz',
        'Gracias por quedarte',
        `Siempre contigo, mi ${her}`,
    ],
}
export const CONTACT = { whatsapp: '943759634' }