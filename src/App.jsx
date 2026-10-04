import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import RequireAuth from './components/auth/RequireAuth'
import RequireEdit from './components/auth/RequireEdit'
import Home from './pages/Home'
import Login from './pages/Login'

const Letter = lazy(() => import('./pages/Letter'))
const Gallery = lazy(() => import('./pages/Gallery'))
const LovedThings = lazy(() => import('./pages/LovedThings'))
const Story = lazy(() => import('./pages/Story'))
const Messages = lazy(() => import('./pages/Messages'))
const Games = lazy(() => import('./pages/Games'))
const Surprise = lazy(() => import('./pages/Surprise'))
const Panel = lazy(() => import('./pages/Panel'))
const CinnamorollGame = lazy(() => import('./games/CinnamorollGame'))
const StrawberryGame = lazy(() => import('./games/StrawberryGame'))
const PompompurinGame = lazy(() => import('./games/PompompurinGame'))

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/carta" element={<Letter />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/cosas-que-amo" element={<LovedThings />} />
          <Route path="/historia" element={<Story />} />
          <Route path="/mensajes" element={<Messages />} />
          <Route path="/juegos" element={<Games />} />
          <Route path="/juegos/cinnamoroll" element={<CinnamorollGame />} />
          <Route path="/juegos/fresitas" element={<StrawberryGame />} />
          <Route path="/juegos/pompompurin" element={<PompompurinGame />} />
          <Route path="/sorpresa" element={<Surprise />} />
          <Route element={<RequireEdit />}>
            <Route path="/panel" element={<Panel />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}