import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PageLoader from '../ui/PageLoader'

export default function RequireAuth() {
    const { session, profile, loading } = useAuth()
    const location = useLocation()

    if (loading) return <PageLoader />
    if (!session || !profile) return <Navigate to="/login" replace state={{ from: location }} />
    return <Outlet />
}