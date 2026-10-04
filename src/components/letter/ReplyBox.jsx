import { useState } from 'react'
import { FiCheck, FiSend } from 'react-icons/fi'
import Card from '../ui/Card'
import { CONTACT, COUPLE } from '../../data/config'
import { heartBurst } from '../../utils/confettiHearts'

export default function ReplyBox({ letter }) {
    const [text, setText] = useState('')
    const [sent, setSent] = useState(false)

    if (!CONTACT.whatsapp) return null

    const send = () => {
        const msg = `Sobre tu carta "${letter.title}": ${text.trim()}`
        window.open(
            `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`,
            '_blank',
            'noopener'
        )
        setSent(true)
        heartBurst({ particleCount: 40, spread: 80, origin: { y: 0.8 } })
    }

    return (
        <Card tone="blue" className="mt-8 text-left">
            <h3 className="font-title text-2xl">Cuéntame qué sentiste</h3>
            <p className="text-sm font-semibold text-kw-ink/70">
                Tu mensaje le llega a {COUPLE.him.name} por WhatsApp.
            </p>
            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value)
                    setSent(false)
                }}
                maxLength={500}
                rows={3}
                placeholder="Escribe aquí..."
                className="mt-3 w-full resize-none rounded-2xl border-2 border-kw-sky-deep/40 bg-white/90 p-3 font-body text-base outline-none transition focus:border-kw-pink"
            />
            <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-kw-ink/50">{text.length}/500</span>
                <button
                    type="button"
                    onClick={send}
                    disabled={!text.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-kw-pink px-5 py-2 font-bold text-white shadow-lg transition active:scale-95 disabled:bg-kw-ink/30"
                >
                    {sent ? <FiCheck /> : <FiSend />} {sent ? 'Enviado' : 'Enviar'}
                </button>
            </div>
        </Card>
    )
}