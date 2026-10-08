import { FiHeart } from 'react-icons/fi'
import { img } from '../../assets'

export default function NodeIcon({ iconKey = 'generico', className = '' }) {
    const url = img(`icons/hito-${iconKey}`) ?? img('icons/hito-generico')
    return url ? (
        <img src={url} alt="" draggable={false} className={`object-contain ${className}`} />
    ) : (
        <FiHeart className={className} />
    )
}