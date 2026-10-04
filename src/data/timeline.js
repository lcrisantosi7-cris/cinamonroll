import { FiHeart, FiMail, FiCoffee, FiSmile } from 'react-icons/fi'
import { imgList } from '../assets'

export const TIMELINE = [
    {
        id: 'enamorados',
        icon: FiHeart,
        title: 'Nos hicimos enamorados',
        date: '2026-03-16',
        text: 'El día en que decidimos empezar esta historia juntos.',
        draft: false,
    },
    { id: 'primer-beso', icon: FiHeart, title: 'Nuestro primer beso', date: null, text: '', draft: true },
    { id: 'te-amo', icon: FiMail, title: 'Primer te amo', date: null, text: '', draft: true },
    { id: 'pan-con-palta', icon: FiCoffee, title: 'Fecha de pan con palta', date: null, text: '', draft: true },
    { id: 'papa-camote', icon: FiSmile, title: 'Fecha de papa y camote', date: null, text: '', draft: true },

    // Para agregar un recuerdo nuevo, copia un bloque, cambia el id y llena fecha y texto:
    // { id: 'primer-viaje', icon: FiHeart, title: 'Nuestro primer viaje', date: '2026-05-10', text: '...', draft: false },
]

// Solo los recuerdos completos (los borradores se ven únicamente con npm run dev), por fecha
export const TIMELINE_VISIBLE = TIMELINE.filter((m) => !m.draft || import.meta.env.DEV).sort((a, b) => {
    if (a.date && b.date) return a.date.localeCompare(b.date)
    if (a.date) return -1
    if (b.date) return 1
    return 0
})

const PHOTOS = imgList('timeline')

// Fotos de un recuerdo: timeline/{id}.jpg, timeline/{id}-1.jpg, timeline/{id}-2.jpg...
export const photosOf = (item) => {
    const re = new RegExp(`^timeline/${item.id}(-\\d+)?$`)
    return PHOTOS.filter((p) => re.test(p.name)).map((p) => ({ src: p.src, caption: item.title }))
}