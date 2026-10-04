import { SPRITES, IMG_NAME } from './sprites'

const cache = new Map()
const pathOf = (d) => {
    let p = cache.get(d)
    if (!p) {
        p = new Path2D(d)
        cache.set(d, p)
    }
    return p
}

export function drawSprite(ctx, parts, x, y, size, rot = 0, alpha = 1) {
    ctx.save()
    ctx.translate(x, y)
    if (rot) ctx.rotate(rot)
    const k = size / 100
    ctx.scale(k, k)
    ctx.translate(-50, -50)
    ctx.globalAlpha *= alpha
    for (const p of parts) {
        const path = pathOf(p.d)
        if (p.fill) {
            if (Array.isArray(p.fill)) {
                const g = ctx.createLinearGradient(0, 0, 0, 100)
                g.addColorStop(0, p.fill[0])
                g.addColorStop(1, p.fill[1])
                ctx.fillStyle = g
            } else {
                ctx.fillStyle = p.fill
            }
            ctx.fill(path)
        }
        if (p.stroke) {
            ctx.strokeStyle = p.stroke
            ctx.lineWidth = p.lw ?? 2
            ctx.lineJoin = 'round'
            ctx.lineCap = 'round'
            ctx.stroke(path)
        }
    }
    ctx.restore()
}

export function drawImg(ctx, im, x, y, size, rot = 0) {
    const r = im.width / im.height
    const w = r >= 1 ? size : size * r
    const h = r >= 1 ? size / r : size
    ctx.save()
    ctx.translate(x, y)
    if (rot) ctx.rotate(rot)
    ctx.drawImage(im, -w / 2, -h / 2, w, h)
    ctx.restore()
}

// Dibuja tu imagen si existe; si no, el dibujo vectorial
export function drawThing(ctx, sprites, type, x, y, size, rot = 0, alpha = 1) {
    const im = sprites.current[IMG_NAME[type]]
    if (im) {
        ctx.save()
        ctx.globalAlpha *= alpha
        drawImg(ctx, im, x, y, size, rot)
        ctx.restore()
    } else {
        drawSprite(ctx, SPRITES[type], x, y, size, rot, alpha)
    }
}

export function cloudShape(ctx, x, y, s) {
    const dots = [[0, 0, 0.5], [0.45, 0.1, 0.4], [-0.45, 0.12, 0.38], [0.1, -0.25, 0.38]]
    for (const [dx, dy, r] of dots) {
        ctx.beginPath()
        ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2)
        ctx.fill()
    }
}

export function drawBasket(ctx, x, y, w, squash = 0) {
    const h = w * 0.55
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(1 + squash * 0.12, 1 - squash * 0.12)

    ctx.fillStyle = '#b87a30'
    ctx.beginPath()
    ctx.ellipse(0, -h * 0.35, w * 0.5, h * 0.18, 0, 0, Math.PI * 2)
    ctx.fill()

    const g = ctx.createLinearGradient(0, -h * 0.35, 0, h * 0.5)
    g.addColorStop(0, '#f0b868')
    g.addColorStop(1, '#c98a3e')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(-w * 0.5, -h * 0.35)
    ctx.quadraticCurveTo(-w * 0.45, h * 0.55, -w * 0.28, h * 0.5)
    ctx.lineTo(w * 0.28, h * 0.5)
    ctx.quadraticCurveTo(w * 0.45, h * 0.55, w * 0.5, -h * 0.35)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = 'rgba(140,90,30,0.45)'
    ctx.lineWidth = 1.5
    for (let i = -3; i <= 3; i++) {
        ctx.beginPath()
        ctx.moveTo(i * w * 0.14, -h * 0.3)
        ctx.lineTo(i * w * 0.1, h * 0.48)
        ctx.stroke()
    }
    for (let j = 0; j < 3; j++) {
        const yy = -h * 0.1 + j * h * 0.22
        ctx.beginPath()
        ctx.moveTo(-w * 0.46 + j * 4, yy)
        ctx.lineTo(w * 0.46 - j * 4, yy)
        ctx.stroke()
    }

    ctx.fillStyle = '#e2a458'
    ctx.beginPath()
    ctx.ellipse(0, -h * 0.35, w * 0.5, h * 0.14, 0, 0, Math.PI)
    ctx.fill()
    ctx.strokeStyle = '#a56a26'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(0, -h * 0.35, w * 0.5, h * 0.18, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
}

export function burst(list, x, y, o = {}) {
    const { n = 10, colors = ['#ffffff'], speed = 140, size = 4, life = 0.7, shape = 'dot', gravity = 200, vx0 = 0 } = o
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const v = speed * (0.4 + Math.random() * 0.6)
        list.push({
            x,
            y,
            vx: Math.cos(a) * v + vx0,
            vy: Math.sin(a) * v,
            g: gravity,
            life,
            max: life,
            size: size * (0.7 + Math.random() * 0.6),
            color: colors[Math.floor(Math.random() * colors.length)],
            shape,
            rot: Math.random() * 6,
            vr: (Math.random() - 0.5) * 8,
        })
    }
}

export function stepParticles(list, dt) {
    for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.life -= dt
        if (p.life <= 0) {
            list.splice(i, 1)
            continue
        }
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += p.g * dt
        p.rot += p.vr * dt
    }
}

export function drawParticles(ctx, list) {
    for (const p of list) {
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.life / p.max)
        if (p.shape === 'star') {
            drawSprite(ctx, SPRITES.star, p.x, p.y, p.size * 2.4, p.rot)
        } else {
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.restore()
    }
}