import NodeIcon from '../story/NodeIcon'
import { TIMELINE_ICONS } from '../../data/timelineIcons'

export default function IconPicker({ value, onChange }) {
    return (
        <div role="radiogroup" aria-label="Ícono del recuerdo" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {TIMELINE_ICONS.map(({ key, label }) => {
                const on = value === key
                return (
                    <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => onChange(key)}
                        className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2 text-[11px] font-bold transition active:scale-95 ${on ? 'border-kw-pink bg-kw-pink-soft' : 'border-transparent bg-white/80'
                            }`}
                    >
                        <span className="grid size-10 place-items-center">
                            <NodeIcon iconKey={key} className="size-9" />
                        </span>
                        {label}
                    </button>
                )
            })}
        </div>
    )
}