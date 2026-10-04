import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import GameShell from '../components/games/GameShell'
import GameSide from '../components/games/GameSide'
import GameCanvas, { pointerX } from '../components/games/GameCanvas'
import GameOverlay, { PrimaryButton } from '../components/games/GameOverlay'
import Hud from '../components/games/Hud'
import ButtonLink from '../components/ui/ButtonLink'
import { Sprite } from './icons'
import { SPRITES } from './sprites'
import { burst, drawBasket, drawParticles, drawSprite, drawThing, stepParticles } from './draw'
import useRaf from '../hooks/useRaf'
import useSprites from '../hooks/useSprites'
import { markCompleted } from '../utils/progress'
import { sfx } from '../utils/sfx'
import { GAMES } from '../data/games'

const W = 360
const H = 560
const START = 0 // fresitas con las que empieza cada nivel (pon 1 si se siente difícil)
const BAD = ['rock', 'bolt', 'burr', 'lemon']
const KEYS = [
    'characters/cinnamoroll', 'games/fresa', 'games/fresa-dorada',
    'games/roca', 'games/rayo', 'games/erizo', 'games/limon',
]
const GAME = GAMES.find((x) => x.id === 'fresitas')

const LEVELS = [
    { goal: 8, speed: 150, every: 0.9, bad: 0.2 },
    { goal: 12, speed: 185, every: 0.75, bad: 0.3 },
    { goal: 16, speed: 220, every: 0.62, bad: 0.4 },
]

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

const newState = (level) => ({
    level,
    x: W / 2,
    targetX: W / 2,
    keys: 0,
    count: START,
    items: [],
    floaters: [],
    fx: [],
    spawn: 0.4,
    caught: false,
    streak: 0,
    shake: 0,
    flash: 0,
    bounce: 0,
    t: 0,
    running: false,
})

const hill = (ctx, dx, y, color, amp) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(-40 + dx, y)
    ctx.quadraticCurveTo(W * 0.25 + dx, y - amp, W * 0.5 + dx, y)
    ctx.quadraticCurveTo(W * 0.75 + dx, y + amp, W + 40 + dx, y - amp * 0.4)
    ctx.lineTo(W + 40, H + 20)
    ctx.lineTo(-40, H + 20)
    ctx.closePath()
    ctx.fill()
}

function draw(ctx, s, sprites) {
    ctx.save()
    if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake * 8, (Math.random() - 0.5) * s.shake * 8)
    }

    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#ffd1e3')
    sky.addColorStop(0.55, '#fff0d9')
    sky.addColorStop(1, '#fff9e8')
    ctx.fillStyle = sky
    ctx.fillRect(-20, -20, W + 40, H + 40)

    const sun = ctx.createRadialGradient(W * 0.8, 90, 8, W * 0.8, 90, 90)
    sun.addColorStop(0, 'rgba(255,244,190,0.95)')
    sun.addColorStop(1, 'rgba(255,244,190,0)')
    ctx.fillStyle = sun
    ctx.beginPath()
    ctx.arc(W * 0.8, 90, 90, 0, Math.PI * 2)
    ctx.fill()

    const off = (s.x - W / 2) * -0.06
    hill(ctx, off * 0.5, H - 160, '#cdeccb', 60)
    hill(ctx, off, H - 120, '#a9e0b4', 50)

    for (let i = 0; i < 8; i++) {
        const bx = i * 52 + 20 + off * 1.4
        ctx.fillStyle = '#7fcf94'
        ctx.beginPath()
        ctx.arc(bx, H - 10, 22, 0, Math.PI * 2)
        ctx.arc(bx + 16, H - 14, 17, 0, Math.PI * 2)
        ctx.fill()
        drawSprite(ctx, SPRITES.strawberry, bx + 4, H - 24, 14)
    }

    for (const it of s.items) {
        const size = it.type === 'golden' ? 50 : 44
        if (it.type === 'golden') {
            ctx.save()
            ctx.shadowColor = '#ffd966'
            ctx.shadowBlur = 20
            drawThing(ctx, sprites, it.type, it.x, it.y, size, Math.sin(it.rot) * 0.4)
            ctx.restore()
        } else {
            drawThing(ctx, sprites, it.type, it.x, it.y, size, Math.sin(it.rot) * 0.4)
        }
    }

    const im = sprites.current['characters/cinnamoroll']
    if (im) {
        const r = im.width / im.height
        const dh = r >= 1 ? 100 / r : 100
        ctx.drawImage(im, s.x - 50, H - 24 - dh, 100, dh)
    } else {
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(s.x, H - 64, 36, 0, Math.PI * 2)
        ctx.fill()
    }
    drawBasket(ctx, s.x, H - 34, 84, s.bounce)

    drawParticles(ctx, s.fx)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const f of s.floaters) {
        ctx.globalAlpha = Math.min(1, f.life * 2)
        ctx.font = '700 24px "Patrick Hand", cursive'
        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.strokeText(f.text, f.x - 10, f.y)
        ctx.fillStyle = f.bad ? '#d93a5f' : '#e8457f'
        ctx.fillText(f.text, f.x - 10, f.y)
        drawSprite(ctx, SPRITES.strawberry, f.x + 14, f.y - 1, 20, 0, f.bad ? 0.55 : 1)
    }
    ctx.globalAlpha = 1

    if (s.streak >= 3) {
        ctx.font = '700 26px "Patrick Hand", cursive'
        ctx.lineWidth = 5
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.strokeText(`Racha x${s.streak}`, W / 2, 28)
        ctx.fillStyle = '#e8457f'
        ctx.fillText(`Racha x${s.streak}`, W / 2, 28)
    }

    if (s.flash > 0) {
        const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75)
        v.addColorStop(0, 'rgba(255,60,90,0)')
        v.addColorStop(1, `rgba(255,60,90,${0.55 * s.flash})`)
        ctx.fillStyle = v
        ctx.fillRect(-20, -20, W + 40, H + 40)
    }
    ctx.restore()
}

export default function StrawberryGame() {
    const canvasRef = useRef(null)
    const [sprites, ready] = useSprites(KEYS)
    const g = useRef(newState(0))
    const [phase, setPhase] = useState('ready')
    const [hud, setHud] = useState({ level: 0, count: START })

    const end = (next) => {
        g.current.running = false
        setPhase(next)
    }

    const begin = (level) => {
        const s = newState(level)
        s.running = true
        g.current = s
        setHud({ level, count: START })
        setPhase('playing')
    }

    const step = (dt) => {
        const s = g.current
        if (!s.running) return
        const L = LEVELS[s.level]

        s.t += dt
        s.targetX = clamp(s.targetX + s.keys * 340 * dt, 44, W - 44)
        s.x += (s.targetX - s.x) * Math.min(1, 14 * dt)
        s.flash = Math.max(0, s.flash - dt * 2)
        s.shake = Math.max(0, s.shake - dt * 3)
        s.bounce = Math.max(0, s.bounce - dt * 5)
        stepParticles(s.fx, dt)

        s.spawn -= dt
        if (s.spawn <= 0) {
            s.spawn = L.every * (0.8 + Math.random() * 0.4)
            const bad = s.caught && Math.random() < L.bad
            const golden = !bad && s.caught && Math.random() < 0.07
            s.items.push({
                x: 26 + Math.random() * (W - 52),
                y: -24,
                vy: L.speed * (0.85 + Math.random() * 0.4),
                type: bad ? BAD[Math.floor(Math.random() * BAD.length)] : golden ? 'golden' : 'strawberry',
                bad,
                rot: Math.random() * 6,
                vr: (Math.random() - 0.5) * 4,
            })
        }

        const remaining = []
        for (const it of s.items) {
            it.y += it.vy * dt
            it.rot += it.vr * dt
            const hit = Math.abs(it.x - s.x) < 46 && it.y > H - 100 && it.y < H - 50
            if (!hit) {
                if (it.y < H + 30) remaining.push(it)
                continue
            }

            s.bounce = 1
            if (it.bad) {
                s.count -= 1
                s.streak = 0
                s.flash = 1
                s.shake = 1
                sfx.bad()
                navigator.vibrate?.(50)
                burst(s.fx, it.x, H - 70, { n: 10, colors: ['#9a78e0', '#8a8fa6'], speed: 130, life: 0.6 })
                s.floaters.push({ x: it.x, y: H - 110, text: '-1', bad: true, life: 0.9 })
            } else {
                const gain = it.type === 'golden' ? 3 : 1
                s.count += gain
                s.caught = true
                s.streak += 1
                sfx.pop()
                navigator.vibrate?.(10)
                burst(s.fx, it.x, H - 70, { n: 8, colors: ['#ff8aa0', '#ffffff'], speed: 120, life: 0.6 })
                if (gain === 3) burst(s.fx, it.x, H - 70, { n: 8, colors: ['#ffe27a'], speed: 150, size: 6, shape: 'star', life: 0.8 })
                s.floaters.push({ x: it.x, y: H - 110, text: `+${gain}`, bad: false, life: 0.9 })
            }
            setHud({ level: s.level, count: s.count })
        }
        s.items = remaining

        for (const f of s.floaters) {
            f.y -= 45 * dt
            f.life -= dt
        }
        s.floaters = s.floaters.filter((f) => f.life > 0)

        if (s.count < 0) {
            sfx.lose()
            return end('lost')
        }
        if (s.count >= L.goal) {
            sfx.win()
            if (s.level < LEVELS.length - 1) return end('levelup')
            markCompleted('fresitas')
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.5 },
                colors: ['#ff8fb8', '#ff5d97', '#ffffff', '#bfeccb'],
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
        const down = (e) => {
            if (e.code === 'ArrowLeft') g.current.keys = -1
            if (e.code === 'ArrowRight') g.current.keys = 1
        }
        const up = (e) => {
            if (e.code === 'ArrowLeft' && g.current.keys === -1) g.current.keys = 0
            if (e.code === 'ArrowRight' && g.current.keys === 1) g.current.keys = 0
        }
        window.addEventListener('keydown', down)
        window.addEventListener('keyup', up)
        return () => {
            window.removeEventListener('keydown', down)
            window.removeEventListener('keyup', up)
        }
    }, [])

    const onPointer = (e) => {
        g.current.targetX = clamp(pointerX(e, canvasRef.current, W), 44, W - 44)
    }

    const berry = <Sprite name="strawberry" className="size-14" />
    const views = {
        ready: {
            image: 'characters/cinnamoroll',
            title: 'Atrapa las fresitas',
            text: 'Mueve a Cinnamoroll con el dedo. Cada fresa suma 1, pero la roca, el rayo, el erizo y el limón te quitan una. ¡Si llegas a -1, pierdes!',
            label: 'Empezar',
            onClick: () => begin(0),
        },
        levelup: {
            icon: berry,
            title: `¡Nivel ${hud.level + 1} superado!`,
            text: `Siguiente meta: ${LEVELS[Math.min(hud.level + 1, LEVELS.length - 1)].goal} fresitas.`,
            label: 'Siguiente nivel',
            onClick: () => begin(hud.level + 1),
        },
        lost: {
            icon: <Sprite name="heart" className="size-14" />,
            title: '¡Se quedó sin fresitas!',
            text: 'Llegaste a -1. ¡Inténtalo otra vez!',
            label: `Reintentar nivel ${hud.level + 1}`,
            onClick: () => begin(hud.level),
        },
        won: {
            icon: <Sprite name="golden" className="size-16" />,
            title: '¡Ganaste las fresitas!',
            text: GAME.reward,
            label: 'Jugar otra vez',
            onClick: () => begin(0),
        },
    }
    const view = views[phase]

    return (
        <GameShell
            title="Atrapa las fresitas"
            subtitle="Arrastra para mover a Cinnamoroll"
            hud={
                <Hud
                    level={hud.level + 1}
                    levels={LEVELS.length}
                    icon={<Sprite name="strawberry" className="size-5" />}
                    value={hud.count}
                    goal={LEVELS[hud.level].goal}
                />
            }
            side={
                <GameSide
                    image="characters/cinnamoroll"
                    steps={[
                        'Mueve el mouse (o usa las flechas) para mover la canasta.',
                        'Cada fresita suma 1 y la fresa dorada suma 3.',
                        'La roca, el rayo, el erizo y el limón restan 1.',
                        'Si el contador llega a -1, pierdes. Alcanza la meta para pasar de nivel.',
                    ]}
                    tip="Los objetos malos solo aparecen después de tu primera fresita de cada nivel."
                />
            }
        >
            <GameCanvas
                ref={canvasRef}
                width={W}
                height={H}
                onPointerMove={onPointer}
                onPointerDown={onPointer}
            />
            <AnimatePresence mode="wait">
                {view && (
                    <GameOverlay key={phase} image={view.image} icon={view.icon} title={view.title} text={view.text}>
                        <PrimaryButton onClick={view.onClick}>{view.label}</PrimaryButton>
                        {phase === 'won' && <ButtonLink to="/juegos" variant="pink">Volver a los juegos</ButtonLink>}
                    </GameOverlay>
                )}
            </AnimatePresence>
        </GameShell>
    )
}