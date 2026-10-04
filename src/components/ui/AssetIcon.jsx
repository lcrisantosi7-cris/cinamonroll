import { img } from '../../assets'

export default function AssetIcon({ name, fallback: Fallback, className = '', imgClassName = '' }) {
    const url = name ? img(name) : null
    if (url) {
        return <img src={url} alt="" draggable={false} loading="lazy" decoding="async" className={imgClassName} />
    }
    return Fallback ? <Fallback className={className} /> : null
}