import { imgList } from '../assets'

const CAPTIONS = {
    'gallery/tu-y-yo': 'Nuestro foto juntos :3',
    'gallery/cena-romantica': 'Nuestra Cena/Almuerzo romantica :3',
    'gallery/cine': 'Nuestro cine juntos :3',
    'gallery/foto-parque': 'Nuestro paseo por el parque de leyendas :3',
    'gallery/platillo-juntos': 'Mi lugar favorito',
}

export const GALLERY = imgList('gallery').map(({ name, src }) => ({
    src,
    caption: CAPTIONS[name] ?? '',
}))