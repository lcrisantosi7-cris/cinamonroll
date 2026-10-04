import { COUPLE } from './config'
import { imgList } from '../assets'

export const FINAL = {
    requireGames: true, // pon false para que la sorpresa esté abierta sin jugar
    title: `Esto es para ti, ${COUPLE.her.name}`,
    // Cada frase se muestra como una escena. Mejor cortas.
    paragraphs: [
        'Llegaste hasta aquí, y eso me hace muy feliz.',
        'Hice esta página pensando en cada detalle de ti, de nosotros y de todo lo que hemos vivido.',
        'Gracias por cada risa, por cada fecha de pan con palta, por cada día de papa y camote.',
        'Contigo todo se siente más bonito. Esta no es la sorpresa más grande que tengo para ti, pero sí la que más cariño tiene.',
    ],
    signature: `Con todo mi corazón, tu ${COUPLE.him.nickname.toLowerCase()}`,
    photoCaption: 'Mi lugar favorito del mundo',
    // Nombre de un archivo en src/assets/video (sin extensión). Ejemplo: 'mensaje'
    video: 'src/assets/video/mensaje.mp4',
    // Tu regalo real, por ejemplo: { title: 'Y ahora, lo mejor', text: 'Aquí va el plan que preparé para ti.', date: 'Sábado 20 de diciembre' }
    reveal: null,
    coupons: [
        { id: 'abrazo', title: 'Abrazo infinito', text: 'Válido para un abrazo largo y fuerte, cuando lo necesites.', img: 'surprise/coupon-abrazo' },
        { id: 'pan-con-palta', title: 'Fecha de pan con palta', text: 'Una fecha de pan con palta, a tu manera.', img: 'surprise/coupon-pan-con-palta' },
        { id: 'papa-camote', title: 'Fecha de papa y camote', text: 'Nuestra fecha especial, con el menú que tú elijas.', img: 'surprise/coupon-papa-camote' },
        { id: 'pelicula', title: 'Maratón de películas', text: 'Tú eliges las películas y los snacks.', img: 'surprise/coupon-pelicula' },
        { id: 'mimo', title: 'Un mimo a tu elección', text: 'Lo que se te antoje, cuando se te antoje.', img: 'surprise/coupon-mimo' },
        { id: 'razon', title: 'Hoy tienes la razón', text: 'Muestra este cupón y ganas cualquier discusión.', img: 'surprise/coupon-razon' },
    ],
}

// Fotos finales: surprise/final-photo, surprise/final-photo-2, final-photo-3...
export const FINAL_PHOTOS = imgList('surprise').filter((p) =>
    /^surprise\/final-photo(-\d+)?$/.test(p.name)
)