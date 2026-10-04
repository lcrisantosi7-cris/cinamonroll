const circle = (cx, cy, r) =>
    `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`

const spikes = (cx, cy, n, ro, ri) =>
    Array.from({ length: n * 2 }, (_, i) => {
        const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2
        const r = i % 2 ? ri : ro
        return `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`
    }).join('') + 'Z'

const INK = '#4a1f2b'

const happy = (y = 58) => [
    { d: circle(41, y, 2.8), fill: INK },
    { d: circle(59, y, 2.8), fill: INK },
    { d: circle(33, y + 8, 4.2), fill: 'rgba(255,120,160,0.75)' },
    { d: circle(67, y + 8, 4.2), fill: 'rgba(255,120,160,0.75)' },
    { d: `M45 ${y + 8}q5 5 10 0`, stroke: INK, lw: 2.2 },
]

const angry = (y = 56) => [
    { d: circle(40, y, 3.2), fill: '#ffffff' },
    { d: circle(60, y, 3.2), fill: '#ffffff' },
    { d: circle(41, y + 0.5, 1.7), fill: INK },
    { d: circle(59, y + 0.5, 1.7), fill: INK },
    { d: `M31 ${y - 8}l12 5M69 ${y - 8}l-12 5`, stroke: INK, lw: 2.6 },
    { d: `M43 ${y + 14}q7-6 14 0`, stroke: INK, lw: 2.4 },
]

const SEEDS = [[32, 46], [44, 42], [56, 42], [68, 46], [28, 60], [72, 60], [40, 78], [60, 78], [50, 84]]
const BERRY = 'M50 92C18 70 10 44 22 32c8-8 20-6 28 0 8-6 20-8 28 0 12 12 4 38-28 60z'
const LEAVES = 'M50 34L33 16l12 7 5-15 5 15 12-7z'
const HEART = 'M50 88C14 62 8 38 22 26c10-8 22-4 28 6 6-10 18-14 28-6 14 12 8 36-28 62z'

const berry = (fill, stroke, seed) => [
    { d: BERRY, fill, stroke, lw: 2.5 },
    ...SEEDS.map(([x, y]) => ({ d: circle(x, y, 1.9), fill: seed })),
    ...happy(58),
    { d: LEAVES, fill: '#5fbf6e', stroke: '#3f9a52', lw: 2 },
]

export const SPRITES = {
    strawberry: berry(['#ff8aa0', '#e8344f'], '#c42a43', '#ffe9a8'),
    golden: [
        ...berry(['#fff3a8', '#f5b82e'], '#d9921e', '#ffffff'),
        { d: spikes(82, 16, 5, 11, 4.5), fill: '#ffffff', stroke: '#f5b82e', lw: 1.5 },
    ],
    rock: [
        { d: 'M16 70L22 44L44 28L70 32L86 54L82 78L56 88L28 84Z', fill: ['#c3c7d6', '#7c8196'], stroke: '#5c6178', lw: 3 },
        { d: 'M30 46L44 36L58 38', stroke: 'rgba(255,255,255,0.55)', lw: 3 },
        ...angry(58),
    ],
    bolt: [
        { d: 'M60 4L22 56H46L36 96L80 40H56Z', fill: ['#fff27a', '#ffb62e'], stroke: '#d98a12', lw: 3 },
        { d: circle(42, 52, 2.3), fill: INK },
        { d: circle(53, 52, 2.3), fill: INK },
        { d: 'M38 46l7 3M57 46l-7 3', stroke: INK, lw: 2.2 },
    ],
    burr: [
        { d: spikes(50, 52, 12, 46, 32), fill: ['#9a78e0', '#5a3d9e'], stroke: '#41297a', lw: 3 },
        ...angry(54),
    ],
    lemon: [
        { d: 'M6 54L16 47Q30 22 50 22Q70 22 84 47L94 54L84 61Q70 86 50 86Q30 86 16 61Z', fill: ['#fff59a', '#f4c823'], stroke: '#c9a415', lw: 3 },
        ...angry(54),
    ],
    star: [
        { d: spikes(50, 54, 5, 44, 19), fill: ['#fff3a8', '#ffcf3d'], stroke: '#f0a81e', lw: 3 },
        ...happy(54),
    ],
    heart: [{ d: HEART, fill: ['#ff9ec3', '#e8457f'], stroke: '#c92f68', lw: 2.5 }],
    flan: [
        { d: 'M6 88Q50 100 94 88Q94 78 50 78Q6 78 6 88Z', fill: ['#ffffff', '#e9e0ff'], stroke: '#cdbff5', lw: 2.5 },
        { d: 'M20 82Q16 56 28 44Q38 30 50 30Q62 30 72 44Q84 56 80 82Z', fill: ['#ffe08a', '#ffc65a'], stroke: '#e0a23a', lw: 2.5 },
        { d: 'M24 54Q50 18 76 54Q72 62 67 56Q63 66 57 58Q50 68 44 58Q38 64 33 57Q28 62 24 54Z', fill: ['#c46a22', '#8e4513'], stroke: '#7a3a10', lw: 2 },
        { d: 'M36 40Q44 34 52 34', stroke: 'rgba(255,255,255,0.7)', lw: 3 },
        { d: circle(41, 73, 2.4), fill: INK },
        { d: circle(59, 73, 2.4), fill: INK },
        { d: circle(34, 78, 3.4), fill: 'rgba(255,120,160,0.7)' },
        { d: circle(66, 78, 3.4), fill: 'rgba(255,120,160,0.7)' },
        { d: 'M46 77q4 3 8 0', stroke: INK, lw: 2 },
    ],
}

// Si existe una imagen tuya con este nombre en src/assets/images/games/, reemplaza al dibujo
export const IMG_NAME = {
    strawberry: 'games/fresa',
    golden: 'games/fresa-dorada',
    rock: 'games/roca',
    bolt: 'games/rayo',
    burr: 'games/erizo',
    lemon: 'games/limon',
    star: 'games/estrella',
    heart: 'games/corazon',
    flan: 'games/flan',
}