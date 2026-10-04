import { createContext, useContext } from 'react'
import useAudio from '../hooks/useAudio'
import { TRACKS } from '../data/config'

const PlayerContext = createContext(null)

export function AudioProvider({ children }) {
    const player = useAudio(TRACKS)
    return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
}

export const usePlayer = () => useContext(PlayerContext)