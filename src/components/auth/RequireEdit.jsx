import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ReauthDialog from './ReauthDialog'

export default function RequireEdit() {
    const { canEdit, profile } = useAuth()
    const navigate = useNavigate()

    if (!['admin', 'photo_uploader'].includes(profile?.role)) return <Navigate to="/" replace />
    if (canEdit) return <Outlet />
    return <ReauthDialog onCancel={() => navigate('/', { replace: true })} />
}