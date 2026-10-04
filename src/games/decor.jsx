import { img } from '../assets'

const ART = {
    cloud: (
        <>
            <ellipse cx="50" cy="84" rx="40" ry="7" fill="rgba(150,190,230,0.3)" />
            <g fill="#fff" stroke="#dbeafe" strokeWidth="2">
                <circle cx="30" cy="62" r="20" />
                <circle cx="52" cy="46" r="26" />
                <circle cx="74" cy="62" r="20" />
                <rect x="30" y="60" width="44" height="22" rx="10" stroke="none" />
            </g>
        </>
    ),
    tree: (
        <>
            <rect x="43" y="58" width="14" height="36" rx="5" fill="#a8693a" />
            <g fill="#6fcf86" stroke="#4aa862" strokeWidth="2">
                <circle cx="50" cy="36" r="28" />
                <circle cx="28" cy="52" r="20" />
                <circle cx="72" cy="52" r="20" />
            </g>
            <circle cx="40" cy="28" r="8" fill="rgba(255,255,255,0.3)" />
        </>
    ),
    house: (
        <>
            <rect x="20" y="48" width="60" height="42" rx="4" fill="#ffe3b8" stroke="#e0b27a" strokeWidth="2" />
            <path d="M12 52L50 14L88 52Z" fill="#ff9ec3" stroke="#e8457f" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="42" y="64" width="16" height="26" rx="4" fill="#b97a4a" />
            <rect x="25" y="56" width="12" height="12" rx="2" fill="#cfeaff" stroke="#7cc4ff" strokeWidth="1.5" />
            <rect x="63" y="56" width="12" height="12" rx="2" fill="#cfeaff" stroke="#7cc4ff" strokeWidth="1.5" />
        </>
    ),
    flower: (
        <>
            <path d="M50 94V50" stroke="#5fbf6e" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="62" cy="76" rx="12" ry="6" fill="#7ad28a" transform="rotate(-30 62 76)" />
            <g fill="#ff9ec3" stroke="#e8457f" strokeWidth="1.5">
                {[0, 72, 144, 216, 288].map((a) => (
                    <ellipse key={a} cx="50" cy="22" rx="9" ry="14" transform={`rotate(${a} 50 36)`} />
                ))}
            </g>
            <circle cx="50" cy="36" r="9" fill="#ffd966" stroke="#e0a82e" strokeWidth="1.5" />
        </>
    ),
    bush: (
        <>
            <g fill="#6fcf86" stroke="#4aa862" strokeWidth="2">
                <circle cx="28" cy="68" r="22" />
                <circle cx="54" cy="58" r="26" />
                <circle cx="76" cy="70" r="20" />
            </g>
            <g fill="#ff6b86">
                <circle cx="40" cy="60" r="3.5" />
                <circle cx="64" cy="52" r="3.5" />
                <circle cx="72" cy="74" r="3.5" />
            </g>
        </>
    ),
    mushroom: (
        <>
            <rect x="40" y="52" width="20" height="38" rx="9" fill="#fff3e0" stroke="#e8cfa8" strokeWidth="2" />
            <path d="M10 60Q50 0 90 60Z" fill="#ff7a8a" stroke="#d9556a" strokeWidth="2.5" strokeLinejoin="round" />
            <g fill="#fff">
                <circle cx="34" cy="44" r="6" />
                <circle cx="58" cy="30" r="5" />
                <circle cx="72" cy="48" r="5" />
            </g>
        </>
    ),
    cupcake: (
        <>
            <path d="M24 54L76 54L68 92L32 92Z" fill="#ffc2da" stroke="#e8457f" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M38 56L40 90M50 56V90M62 56L60 90" stroke="rgba(232,69,127,0.35)" strokeWidth="2" />
            <g fill="#fff0f5" stroke="#ffb3d1" strokeWidth="2">
                <ellipse cx="50" cy="48" rx="30" ry="14" />
                <ellipse cx="50" cy="34" rx="22" ry="12" />
                <ellipse cx="50" cy="22" rx="14" ry="9" />
            </g>
            <circle cx="50" cy="13" r="6" fill="#e8344f" />
        </>
    ),
    cake: (
        <>
            <rect x="14" y="56" width="72" height="34" rx="8" fill="#ffe3b8" stroke="#e0b27a" strokeWidth="2.5" />
            <path d="M12 56Q12 40 30 40H70Q88 40 88 56Q80 66 74 56Q68 70 60 56Q52 68 46 56Q38 70 32 56Q24 66 12 56Z" fill="#ffd1e3" stroke="#ff9ec3" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="34" y="22" width="6" height="18" rx="2" fill="#9ad7ff" />
            <rect x="58" y="22" width="6" height="18" rx="2" fill="#9ad7ff" />
            <path d="M37 12q-4 6 0 9q4-3 0-9ZM61 12q-4 6 0 9q4-3 0-9Z" fill="#ffd966" />
        </>
    ),
    donut: (
        <>
            <path fillRule="evenodd" d="M50 10a40 40 0 1 0 .01 0ZM50 38a12 12 0 1 1-.01 0Z" fill="#f2b36b" stroke="#d98f43" strokeWidth="2.5" />
            <path fillRule="evenodd" d="M50 17a33 33 0 1 0 .01 0ZM50 38a12 12 0 1 1-.01 0Z" fill="#ff9ec3" />
            <g strokeLinecap="round" strokeWidth="4">
                <path d="M28 40l6-3" stroke="#fff" />
                <path d="M60 24l6 3" stroke="#9ad7ff" />
                <path d="M72 52l6-2" stroke="#ffd966" />
                <path d="M34 70l5 4" stroke="#fff" />
                <path d="M62 74l6 2" stroke="#9ad7ff" />
            </g>
        </>
    ),
    teapot: (
        <>
            <path d="M72 54Q94 48 90 32Q82 44 70 46Z" fill="#cfeaff" stroke="#7cc4ff" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M20 56Q0 54 8 74Q14 84 24 80" fill="none" stroke="#7cc4ff" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="46" cy="62" rx="30" ry="26" fill="#cfeaff" stroke="#7cc4ff" strokeWidth="2.5" />
            <ellipse cx="46" cy="38" rx="18" ry="7" fill="#ff9ec3" stroke="#e8457f" strokeWidth="2" />
            <circle cx="46" cy="29" r="5" fill="#ff9ec3" stroke="#e8457f" strokeWidth="2" />
            <g fill="#ff9ec3">
                <circle cx="34" cy="62" r="3.5" />
                <circle cx="48" cy="72" r="3.5" />
                <circle cx="60" cy="58" r="3.5" />
            </g>
        </>
    ),
    lollipop: (
        <>
            <rect x="47" y="50" width="6" height="44" rx="3" fill="#fff" stroke="#e6e0ff" strokeWidth="1.5" />
            <circle cx="50" cy="32" r="28" fill="#ff9ec3" stroke="#e8457f" strokeWidth="2.5" />
            <path d="M50 32a4 4 0 1 1 8 0a8 8 0 1 1-16 0a12 12 0 1 1 24 0a16 16 0 1 1-32 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </>
    ),
    ferris: (
        <>
            <path d="M50 44L28 94M50 44L72 94" stroke="#9ad7ff" strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="44" r="38" fill="none" stroke="#ff8fb8" strokeWidth="4" />
            <g stroke="#ffd966" strokeWidth="3">
                <path d="M50 6V82M12 44H88M23 17L77 71M23 71L77 17" />
            </g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
                const x = 50 + 38 * Math.cos((a * Math.PI) / 180)
                const y = 44 + 38 * Math.sin((a * Math.PI) / 180)
                return (
                    <circle key={a} cx={x} cy={y} r="7" fill={['#ffd1e3', '#cfeaff', '#fff1b8', '#e3d5ff'][i % 4]} stroke="#e8457f" strokeWidth="1.5" />
                )
            })}
            <circle cx="50" cy="44" r="6" fill="#ff8fb8" />
        </>
    ),
    tent: (
        <>
            <rect x="16" y="52" width="68" height="38" rx="4" fill="#ffe3b8" stroke="#e0b27a" strokeWidth="2" />
            <path d="M8 54L50 10L92 54Z" fill="#ff9ec3" stroke="#e8457f" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M30 32L36 54H46L42 22ZM58 22L54 54H64L70 32Z" fill="#fff" opacity="0.85" />
            <path d="M42 90V70Q50 58 58 70V90Z" fill="#b97a4a" />
            <path d="M50 10V0L62 5L50 9" fill="#ffd966" stroke="#e0a82e" strokeWidth="1.5" />
        </>
    ),
    balloon: (
        <>
            <path d="M50 66Q44 80 52 96" fill="none" stroke="#7a8bb0" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="50" cy="36" rx="24" ry="30" fill="#ff8fb8" stroke="#e8457f" strokeWidth="2.5" />
            <path d="M44 66L50 60L56 66Z" fill="#e8457f" />
            <ellipse cx="40" cy="24" rx="5" ry="9" fill="rgba(255,255,255,0.5)" transform="rotate(20 40 24)" />
        </>
    ),
    gift: (
        <>
            <rect x="18" y="46" width="64" height="44" rx="6" fill="#9ad7ff" stroke="#5aa9e0" strokeWidth="2.5" />
            <rect x="12" y="34" width="76" height="16" rx="5" fill="#7cc4ff" stroke="#5aa9e0" strokeWidth="2.5" />
            <rect x="45" y="34" width="10" height="56" fill="#ffd966" />
            <path d="M50 34C36 12 20 22 32 32C38 36 46 34 50 34ZM50 34C64 12 80 22 68 32C62 36 54 34 50 34Z" fill="#ffe27a" stroke="#e0a82e" strokeWidth="2" strokeLinejoin="round" />
        </>
    ),
    star: (
        <path
            d="M50 6l11 28 30 2-23 19 8 29-26-16-26 16 8-29-23-19 30-2z"
            fill="#ffe27a"
            stroke="#f5b83d"
            strokeWidth="3"
            strokeLinejoin="round"
        />
    ),
}

// Si pones games/decor-<tipo>.png (ej. decor-arbol no, decor-tree), reemplaza el dibujo
export default function Decor({ t }) {
    const url = img(`games/decor-${t}`)
    if (url) return <img src={url} alt="" draggable={false} className="size-full object-contain" />
    return (
        <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
            {ART[t]}
        </svg>
    )
}