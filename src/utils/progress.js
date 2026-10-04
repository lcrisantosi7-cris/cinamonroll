const KEY = 'novia-progress-v1'
const EMPTY = { completed: {}, redeemed: {}, lettersRead: {}, opened: false }

const read = () => {
    try {
        return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY)) }
    } catch {
        return { ...EMPTY }
    }
}

const write = (data) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
        /* sin almacenamiento: se ignora */
    }
}

export const getProgress = () => read()

export const markCompleted = (id) => {
    const d = read()
    write({ ...d, completed: { ...d.completed, [id]: true } })
}

export const redeemCoupon = (id) => {
    const d = read()
    write({ ...d, redeemed: { ...d.redeemed, [id]: true } })
}

export const markOpened = () => write({ ...read(), opened: true })

export const markLetterRead = (id) => {
    const d = read()
    if (d.lettersRead?.[id]) return
    write({ ...d, lettersRead: { ...d.lettersRead, [id]: true } })
}