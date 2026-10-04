let ctx = null
let muted = false
try {
    muted = localStorage.getItem('sfx-muted') === '1'
} catch {
    /* sin almacenamiento */
}

const audio = () => {
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return null
        ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
}

function tone({ f = 440, to, dur = 0.12, type = 'sine', vol = 0.07, delay = 0 }) {
    if (muted) return
    const a = audio()
    if (!a) return
    const t = a.currentTime + delay
    const o = a.createOscillator()
    const g = a.createGain()
    o.type = type
    o.frequency.setValueAtTime(f, t)
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(a.destination)
    o.start(t)
    o.stop(t + dur + 0.02)
}

export const sfx = {
    flap: () => tone({ f: 380, to: 620, dur: 0.1, type: 'triangle', vol: 0.05 }),
    star: () => {
        tone({ f: 880, dur: 0.1 })
        tone({ f: 1320, dur: 0.14, delay: 0.07, vol: 0.06 })
    },
    pop: () => tone({ f: 520, to: 900, dur: 0.09, type: 'triangle' }),
    bad: () => tone({ f: 220, to: 90, dur: 0.22, type: 'sawtooth', vol: 0.05 }),
    find: () => {
        tone({ f: 660, dur: 0.1, type: 'triangle' })
        tone({ f: 990, dur: 0.16, type: 'triangle', delay: 0.08 })
    },
    miss: () => tone({ f: 200, to: 160, dur: 0.08, type: 'sine', vol: 0.04 }),
    lose: () => {
        tone({ f: 330, to: 200, dur: 0.3, type: 'triangle' })
        tone({ f: 220, to: 120, dur: 0.35, type: 'triangle', delay: 0.18 })
    },
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone({ f, dur: 0.22, delay: i * 0.12 })),
}

export const isMuted = () => muted
export const setMuted = (m) => {
    muted = m
    try {
        localStorage.setItem('sfx-muted', m ? '1' : '0')
    } catch {
        /* sin almacenamiento */
    }
}