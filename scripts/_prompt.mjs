import { stdin, stdout } from 'node:process'

// Pide un texto sin mostrarlo en pantalla
export function askHidden(question) {
    return new Promise((resolve) => {
        stdout.write(question)
        stdin.setRawMode(true)
        stdin.resume()
        stdin.setEncoding('utf8')
        let text = ''
        const onData = (ch) => {
            if (ch === '\r' || ch === '\n') {
                stdin.setRawMode(false)
                stdin.pause()
                stdin.off('data', onData)
                stdout.write('\n')
                resolve(text)
            } else if (ch === '\u0003') {
                process.exit(1)
            } else if (ch === '\u007f' || ch === '\b') {
                text = text.slice(0, -1)
            } else {
                text += ch
            }
        }
        stdin.on('data', onData)
    })
}