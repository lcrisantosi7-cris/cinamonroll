import confetti from 'canvas-confetti'

const HEART_PATH =
    'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z'

let heart = null

const getShape = () => {
    if (!heart) {
        try {
            heart = confetti.shapeFromPath({ path: HEART_PATH })
        } catch {
            heart = 'circle'
        }
    }
    return heart
}

export function heartBurst(opts = {}) {
    confetti({
        shapes: [getShape()],
        colors: ['#ff8fb8', '#ff5d97', '#ffd1e3', '#ffe27a'],
        scalar: 1.4,
        ticks: 220,
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
        ...opts,
    })
}

export function heartRain(duration = 2500) {
    const end = Date.now() + duration
    const frame = () => {
        heartBurst({ particleCount: 3, angle: 60, spread: 55, startVelocity: 55, origin: { x: 0, y: 0.7 } })
        heartBurst({ particleCount: 3, angle: 120, spread: 55, startVelocity: 55, origin: { x: 1, y: 0.7 } })
        if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
}

export function starBurst(opts = {}) {
    confetti({
        shapes: ['star'],
        colors: ['#ffe27a', '#ffffff', '#cfeaff', '#ffc2da'],
        scalar: 1.3,
        ticks: 200,
        particleCount: 40,
        spread: 90,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
        ...opts,
    })
}