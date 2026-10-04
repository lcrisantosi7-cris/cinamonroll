import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import GameShell from '../components/games/GameShell'
import GameSide from '../components/games/GameSide'
import GameCanvas from '../components/games/GameCanvas'
import GameOverlay, { PrimaryButton } from '../components/games/GameOverlay'
import Hud from '../components/games/Hud'
import ButtonLink from '../components/ui/ButtonLink'
import { Sprite } from './icons'
import { SPRITES } from './sprites'
import { burst, cloudShape, drawParticles, drawSprite, drawThing, stepParticles } from './draw'
import useRaf from '../hooks/useRaf'
import useSprites from '../hooks/useSprites'
import { markCompleted } from '../utils/progress'
import { sfx } from '../utils/sfx'
import { GAMES } from '../data/games'

const W = 360
const H = 560
const CX = 96
const R = 20
const OW = 68
const GRAVITY = 950
const FLAP = -310
const KEYS = ['characters/cinnamoroll', 'games/estrella']
const GAME = GAMES.find((x) => x.id === 'cinnamoroll')

const LEVELS = [
    { name: 'Mañana', goal: 5, speed: 105, gap: 205, spacing: 220, sky: ['#bfe3ff', '#fff1f6'], cloud: 'rgba(255,255,255,0.65)', storm: '#9aa3d6', night: false },
    { name: 'Atardecer', goal: 8, speed: 130, gap: 185, spacing: 205, sky: ['#ffcf9e', '#ffb3d1'], cloud: 'rgba(255,236,245,0.6)', storm: '#a874b8', night: false },
    { name: 'Noche', goal: 12, speed: 155, gap: 170, spacing: 195, sky: ['#1f2060', '#6a3f9a'], cloud: 'rgba(190,180,255,0.25)', storm: '#3f3680', night: true },
]

const NIGHT_STARS = Array.from({ length: 34 }, (_, i) => ({
    x: (i * 83) % W,
    y: (i * 47) % (H * 0.75),
    r: 0.8 + (i % 3) * 0.5,
}))

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

const newState = (level) => ({
    level,
    y: H / 2,
    vy: 0,
    t: 0,
    scroll: 0,
    stars: 0,
    obstacles: [],
    dist: LEVELS[level].spacing - 20,
    finishing: false,
    home: null,
    running: false,
    started: false,
    squash: 0,
    trail: 0,
    fx: [],
})

function doFlap(s) {
    if (!s.running) return
    s.started = true
    s.vy = FLAP
    s.squash = 1
    sfx.flap()
    burst(s.fx, CX - 14, s.y + 14, { n: 3, colors: ['#ffffff', '#cfeaff'], speed: 40, size: 3, life: 0.45, gravity: 120 })
}

function storm(ctx, x, top, bottom, fromTop, color) {
    const h = bottom - top
    if (h <= 0) return
    ctx.fillStyle = color
    ctx.fillRect(x + 8, top, OW - 16, h)
    for (let y = top; y <= bottom; y += 30) {
        ctx.beginPath()
        ctx.arc(x + 14, y, 14, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + OW - 14, y, 14, 0, Math.PI * 2)
        ctx.fill()
    }
    const cx = x + OW / 2
    const cy = fromTop ? bottom - 22 : top + 22
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(cx - 9, cy - 2, 5.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + 9, cy - 2, 5.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#2b2f5a'
    ctx.beginPath()
    ctx.arc(cx - 8, cy - 1, 2.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + 8, cy - 1, 2.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#2b2f5a'
    ctx.lineWidth = 2.4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - 15, cy - 11)
    ctx.lineTo(cx - 4, cy - 7)
    ctx.moveTo(cx + 15, cy - 11)
    ctx.lineTo(cx + 4, cy - 7)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy + 12, 5, Math.PI * 1.15, Math.PI * 1.85)
    ctx.stroke()
}

function draw(ctx, s, sprites) {
    const L = LEVELS[s.level]

    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, L.sky[0])
    sky.addColorStop(1, L.sky[1])
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    if (L.night) {
        ctx.fillStyle = '#ffffff'
        for (const [i, st] of NIGHT_STARS.entries()) {
            ctx.globalAlpha = 0.45 + 0.45 * Math.sin(s.t * 2 + i)
            ctx.beginPath()
            ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.globalAlpha = 1
        ctx.fillStyle = '#fff6d6'
        ctx.beginPath()
        ctx.arc(W - 70, 80, 26, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = L.sky[0]
        ctx.beginPath()
        ctx.arc(W - 60, 74, 24, 0, Math.PI * 2)
        ctx.fill()
    } else {
        const sun = ctx.createRadialGradient(W - 70, 80, 6, W - 70, 80, 80)
        sun.addColorStop(0, 'rgba(255,248,200,0.95)')
        sun.addColorStop(1, 'rgba(255,248,200,0)')
        ctx.fillStyle = sun
        ctx.beginPath()
        ctx.arc(W - 70, 80, 80, 0, Math.PI * 2)
        ctx.fill()
    }

    ctx.fillStyle = L.cloud
    for (let i = 0; i < 5; i++) {
        const span = W + 140
        const x = ((((i * 110 - s.scroll * 0.15) % span) + span) % span) - 70
        cloudShape(ctx, x, 70 + i * 100, 46)
    }
    for (let i = 0; i < 4; i++) {
        const span = W + 180
        const x = ((((i * 150 - s.scroll * 0.35) % span) + span) % span) - 90
        cloudShape(ctx, x, 120 + i * 120, 62)
    }

    for (const o of s.obstacles) {
        storm(ctx, o.x, 0, o.gapY, true, L.storm)
        storm(ctx, o.x, o.gapY + L.gap, H, false, L.storm)
        if (!o.got) {
            const sy = o.gapY + L.gap / 2 + Math.sin(s.t * 5 + o.gapY) * 4
            ctx.save()
            ctx.shadowColor = '#ffe27a'
            ctx.shadowBlur = 18
            drawThing(ctx, sprites, 'star', o.x + OW / 2, sy, 42, Math.sin(s.t * 2 + o.gapY) * 0.2)
            ctx.restore()
        }
    }

    if (s.home) {
        const hx = s.home.x
        ctx.fillStyle = '#fff6fa'
        for (let i = 0; i < 6; i++) {
            ctx.beginPath()
            ctx.arc(hx + 70, 40 + i * 95, 72, 0, Math.PI * 2)
            ctx.fill()
        }
        drawSprite(ctx, SPRITES.heart, hx + 46, H / 2 - 20, 64, Math.sin(s.t * 3) * 0.1)
        ctx.fillStyle = '#e8457f'
        ctx.font = '26px "Patrick Hand", cursive'
        ctx.textAlign = 'center'
        ctx.fillText('Su nube', hx + 50, H / 2 + 36)
    }

    drawParticles(ctx, s.fx)

    const im = sprites.current['characters/cinnamoroll']
    const rot = clamp(s.vy / 650, -0.45, 0.7)
    ctx.save()
    ctx.translate(CX, s.y)
    ctx.rotate(rot)
    ctx.scale(1 + s.squash * 0.12, 1 - s.squash * 0.16)
    if (im) {
        const w = 84
        const h = (w * im.height) / im.width
        ctx.drawImage(im, -w / 2, -h / 2, w, h)
    } else {
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(0, 0, 26, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#4b6b94'
        ctx.beginPath()
        ctx.arc(-8, -2, 3, 0, Math.PI * 2)
        ctx.arc(8, -2, 3, 0, Math.PI * 2)
        ctx.fill()
    }
    ctx.restore()

    if (s.running && !s.started) {
        ctx.save()
        ctx.globalAlpha = 0.65 + 0.35 * Math.sin(s.t * 4)
        ctx.fillStyle = 'rgba(255,255,255,0.92)'
        ctx.beginPath()
        ctx.roundRect(W / 2 - 100, H * 0.7, 200, 48, 24)
        ctx.fill()
        ctx.fillStyle = '#24478f'
        ctx.font = '28px "Patrick Hand", cursive'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Toca para volar', W / 2, H * 0.7 + 25)
        ctx.restore()
    }
}

export default function CinnamorollGame() {
    const canvasRef = useRef(null)
    const [sprites, ready] = useSprites(KEYS)
    const g = useRef(newState(0))
    const [phase, setPhase] = useState('ready')
    const [hud, setHud] = useState({ level: 0, stars: 0 })

    const end = (next) => {
        g.current.running = false
        setPhase(next)
    }

    const begin = (level) => {
        const s = newState(level)
        s.running = true
        g.current = s
        setHud({ level, stars: 0 })
        setPhase('playing')
    }

    const step = (dt) => {
        const s = g.current
        if (!s.running) return
        const L = LEVELS[s.level]

        s.t += dt
        s.squash = Math.max(0, s.squash - dt * 4)
        stepParticles(s.fx, dt)

        if (!s.started) {
            s.y = H / 2 + Math.sin(s.t * 3) * 8
            return
        }

        s.vy += GRAVITY * dt
        s.y += s.vy * dt
        if (s.y < R) {
            s.y = R
            s.vy = 0
        }
        if (s.y > H - R) {
            sfx.lose()
            burst(s.fx, CX, H - 30, { n: 12, colors: ['#ffffff'], speed: 120, life: 0.6 })
            return end('lost')
        }

        const move = L.speed * dt
        s.scroll += move
        s.obstacles.forEach((o) => {
            o.x -= move
        })
        s.obstacles = s.obstacles.filter((o) => o.x > -OW - 10)
        if (s.home) s.home.x -= move

        s.trail -= dt
        if (s.trail <= 0) {
            s.trail = 0.05
            burst(s.fx, CX - 20, s.y + 6, { n: 1, colors: ['#ffc2da', '#ffffff'], speed: 18, size: 3, life: 0.5, gravity: -10, vx0: -L.speed * 0.7 })
        }

        if (!s.finishing) {
            s.dist += move
            if (s.dist >= L.spacing) {
                s.dist = 0
                s.obstacles.push({ x: W + 20, gapY: 70 + Math.random() * (H - L.gap - 140), got: false })
            }
        }

        for (const o of s.obstacles) {
            const overlapX = CX + R > o.x && CX - R < o.x + OW
            if (overlapX && (s.y - R < o.gapY || s.y + R > o.gapY + L.gap)) {
                sfx.lose()
                burst(s.fx, CX, s.y, { n: 14, colors: ['#ffffff', '#ffc2da'], speed: 150, life: 0.7 })
                navigator.vibrate?.(60)
                return end('lost')
            }

            const sx = o.x + OW / 2
            const sy = o.gapY + L.gap / 2
            if (!o.got && Math.hypot(CX - sx, s.y - sy) < 32) {
                o.got = true
                s.stars += 1
                sfx.star()
                navigator.vibrate?.(12)
                burst(s.fx, sx, sy, { n: 10, colors: ['#ffe27a'], speed: 150, size: 6, life: 0.7, shape: 'star' })
                setHud({ level: s.level, stars: s.stars })
                if (s.stars >= L.goal) {
                    if (s.level < LEVELS.length - 1) {
                        sfx.win()
                        return end('levelup')
                    }
                    s.finishing = true
                    s.home = { x: W + 140 }
                }
            }
        }

        if (s.home && s.home.x <= CX + 20) {
            markCompleted('cinnamoroll')
            sfx.win()
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.5 },
                colors: ['#ff8fb8', '#ffe27a', '#7cc4ff', '#ffffff'],
                disableForReducedMotion: true,
            })
            end('won')
        }
    }

    useRaf((dt) => {
        step(dt)
        draw(canvasRef.current.getContext('2d'), g.current, sprites)
    }, phase === 'playing')

    useEffect(() => {
        draw(canvasRef.current.getContext('2d'), g.current, sprites)
    }, [phase, ready, sprites])

    useEffect(() => {
        const onKey = (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && g.current.running) {
                e.preventDefault()
                doFlap(g.current)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const star = <Sprite name="star" className="size-14" />
    const views = {
        ready: {
            image: 'characters/cinnamoroll',
            title: 'Ayuda a Cinnamoroll',
            text: 'Toca para aletear, esquiva las nubes de tormenta, junta estrellas y llega a su nube.',
            label: 'Empezar',
            onClick: () => begin(0),
        },
        levelup: {
            icon: star,
            title: `¡Nivel ${hud.level + 1} superado!`,
            text: `Ahora es el ${LEVELS[Math.min(hud.level + 1, LEVELS.length - 1)].name.toLowerCase()}. ¿Lista?`,
            label: 'Siguiente nivel',
            onClick: () => begin(hud.level + 1),
        },
        lost: {
            icon: <Sprite name="heart" className="size-14" />,
            title: '¡Ay, choqué!',
            text: 'No pasa nada, inténtalo otra vez.',
            label: `Reintentar nivel ${hud.level + 1}`,
            onClick: () => begin(hud.level),
        },
        won: {
            icon: <Sprite name="heart" className="size-16" />,
            title: '¡Llegó a su nube!',
            text: GAME.reward,
            label: 'Jugar otra vez',
            onClick: () => begin(0),
        },
    }
    const view = views[phase]

    return (
        <GameShell
            title="Vuelo a la nube"
            subtitle={`Nivel ${hud.level + 1}: ${LEVELS[hud.level].name}`}
            hud={
                <Hud
                    level={hud.level + 1}
                    levels={LEVELS.length}
                    icon={<Sprite name="star" className="size-5" />}
                    value={hud.stars}
                    goal={LEVELS[hud.level].goal}
                />
            }
            side={
                <GameSide
                    image="characters/cinnamoroll"
                    steps={[
                        'Toca la pantalla (o la barra espaciadora) para aletear.',
                        'Esquiva las nubes de tormenta.',
                        'Pasa por el centro del hueco para juntar la estrella.',
                        'En el nivel 3, cuando llegues a la meta, aparece su nube.',
                    ]}
                    tip="Aletea con toques cortos y suaves: es más fácil mantener la altura."
                />
            }
        >
            <GameCanvas ref={canvasRef} width={W} height={H} onPointerDown={() => doFlap(g.current)} />
            <AnimatePresence mode="wait">
                {view && (
                    <GameOverlay key={phase} image={view.image} icon={view.icon} title={view.title} text={view.text}>
                        <PrimaryButton onClick={view.onClick}>{view.label}</PrimaryButton>
                        {phase === 'won' && <ButtonLink to="/juegos" variant="blue">Volver a los juegos</ButtonLink>}
                    </GameOverlay>
                )}
            </AnimatePresence>
        </GameShell>
    )
}