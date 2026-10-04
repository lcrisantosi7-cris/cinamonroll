const imageFiles = import.meta.glob('./images/**/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const audioFiles = import.meta.glob('./audio/*.{mp3,ogg,m4a,wav}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const toMap = (files, base) =>
  Object.fromEntries(
    Object.entries(files).map(([path, url]) => [path.slice(base.length).replace(/\.[^.]+$/, ''), url])
  )

const images = toMap(imageFiles, './images/')
const audios = toMap(audioFiles, './audio/')
const videoFiles = import.meta.glob('./video/*.{mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const videos = toMap(videoFiles, './video/')
export const video = (name) => videos[name] ?? null

// Único punto de acceso a los archivos. En la fase 2 (backend privado) solo cambia esto.
export const img = (name) => images[name] ?? null
export const audio = (name) => audios[name] ?? null

export const imgList = (folder) =>
  Object.keys(images)
    .filter((k) => k.startsWith(`${folder}/`))
    .sort()
    .map((name) => ({ name, src: images[name] }))

// Compatibilidad con las páginas que aún usan rutas '/images/...'
export const resolveImage = (src) => {
  if (!src) return null
  if (src.startsWith('/images/')) return img(src.slice('/images/'.length).replace(/\.[^.]+$/, ''))
  return src
}