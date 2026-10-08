import { LOVED_THINGS } from '../../src/data/lovedThings.js'
import { MESSAGES } from '../../src/data/messages.js'
import { LETTERS } from '../../src/data/letter.js'

export const REASONS = LOVED_THINGS
export { MESSAGES, LETTERS }

export const COUPONS = [
    { key: 'abrazo', title: 'Abrazo infinito', body: 'Válido para un abrazo largo y fuerte, cuando lo necesites.', icon: 'surprise/coupon-abrazo' },
    { key: 'pan-con-palta', title: 'Fecha de pan con palta', body: 'Una fecha de pan con palta, a tu manera.', icon: 'surprise/coupon-pan-con-palta' },
    { key: 'papa-camote', title: 'Fecha de papa y camote', body: 'Nuestra fecha especial, con el menú que tú elijas.', icon: 'surprise/coupon-papa-camote' },
    { key: 'pelicula', title: 'Maratón de películas', body: 'Tú eliges las películas y los snacks.', icon: 'surprise/coupon-pelicula' },
    { key: 'mimo', title: 'Un mimo a tu elección', body: 'Lo que se te antoje, cuando se te antoje.', icon: 'surprise/coupon-mimo' },
    { key: 'razon', title: 'Hoy tienes la razón', body: 'Muestra este cupón y ganas cualquier discusión.', icon: 'surprise/coupon-razon' },
]

export const SURPRISE = {
    title: 'Esto es para ti, Lilian',
    paragraphs: [
        'Llegaste hasta aquí, y eso me hace muy feliz.',
        'Hice esta página pensando en cada detalle de ti, de nosotros y de todo lo que hemos vivido.',
        'Gracias por cada risa, por cada fecha de pan con palta, por cada día de papa y camote.',
        'Contigo todo se siente más bonito. Esta no es la sorpresa más grande que tengo para ti, pero sí la que más cariño tiene.',
    ],
    signature: 'Con todo mi corazón, tu camote',
    photoCaption: 'Mi lugar favorito del mundo',
    reveal: null, // por ejemplo: { title: 'Y ahora, lo mejor', text: '...', date: 'Sábado 20 de diciembre' }
}

export const SETTINGS = { require_games: true }