import { useQuery } from '@tanstack/react-query'
import { fetchProgress } from '../lib/content'

export default function useProgress() {
    const q = useQuery({ queryKey: ['progress'], queryFn: fetchProgress, staleTime: 30_000 })
    return {
        isPending: q.isPending,
        completed: q.data?.completed ?? {},
        giftOpened: q.data?.giftOpened ?? false,
        lettersRead: q.data?.lettersRead ?? {},
    }
}