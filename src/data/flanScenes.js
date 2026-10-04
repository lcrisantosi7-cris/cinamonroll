const d = (t, x, y, size) => ({ t, x, y, size })
// i = índice del dibujo detrás del que se esconde; dx y dy van de -1 a 1 (1 = borde del dibujo)
const f = (i, dx = 0, dy = 0.9) => ({ i, dx, dy })

export const SCENES = [
    {
        title: 'El jardín de nubes',
        bg: 'from-sky-200 via-sky-100 to-emerald-100',
        ground: 'bg-linear-to-b from-emerald-200 to-emerald-300',
        time: 60,
        decor: [
            d('cloud', 15, 10, 22), d('cloud', 74, 9, 26), d('cloud', 46, 24, 18),
            d('tree', 13, 50, 28), d('tree', 86, 46, 30), d('house', 62, 56, 24),
            d('flower', 32, 72, 14), d('flower', 56, 82, 13), d('flower', 80, 74, 12),
            d('bush', 45, 64, 16), d('bush', 21, 86, 16), d('bush', 88, 90, 16), d('mushroom', 38, 91, 12),
        ],
        flans: [f(3, 0.4, 0.8), f(4, -0.7, 0.2), f(1, 0.2, 0.8), f(5, 0, 0.9), f(10, 0.6, 0.2)],
    },
    {
        title: 'La pastelería',
        bg: 'from-pink-200 via-rose-100 to-amber-100',
        ground: 'bg-linear-to-b from-pink-200 to-pink-300',
        time: 75,
        decor: [
            d('cupcake', 18, 20, 20), d('cake', 70, 18, 24), d('cake', 45, 42, 28),
            d('donut', 86, 46, 16), d('cupcake', 20, 56, 20), d('teapot', 64, 64, 22),
            d('lollipop', 36, 80, 18), d('teapot', 80, 84, 22), d('lollipop', 10, 86, 14), d('donut', 52, 12, 14),
        ],
        flans: [f(0, 0.1, 0.8), f(1, 0.2, 0.85), f(2, 0, 0.9), f(4, 0.5, 0.3), f(5, 0, 0.9), f(6, 0.8, 0.1), f(7, 0.1, 0.9)],
    },
    {
        title: 'El parque de diversiones',
        bg: 'from-violet-200 via-pink-100 to-yellow-100',
        ground: 'bg-linear-to-b from-violet-200 to-violet-300',
        time: 90,
        decor: [
            d('ferris', 22, 28, 36), d('tent', 76, 34, 30), d('tent', 48, 64, 32),
            d('balloon', 10, 60, 16), d('balloon', 90, 64, 16), d('gift', 30, 84, 18),
            d('lollipop', 72, 86, 16), d('star', 86, 10, 12), d('star', 12, 8, 11),
            d('balloon', 60, 48, 14), d('gift', 52, 14, 14),
        ],
        flans: [f(0, 0.1, 0.9), f(1, 0, 0.85), f(2, 0, 0.9), f(3, 0.2, 0.8), f(4, 0.2, 0.8), f(5, 0.7, 0.1), f(6, -0.8, 0.1), f(9, -0.8, 0.2), f(10, 0, 0.9)],
    },
]

// Posición (en %) de un flan según el dibujo que lo esconde
export const flanPos = (scene, fl) => {
    const dc = scene.decor[fl.i]
    return { x: dc.x + fl.dx * (dc.size / 2), y: dc.y + fl.dy * 0.375 * dc.size }
}