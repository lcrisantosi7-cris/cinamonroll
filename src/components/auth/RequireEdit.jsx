import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ReauthDialog from './ReauthDialog'

export default function RequireEdit() {
    const { canEdit } = useAuth()
    const navigate = useNavigate()

    if (canEdit) return <Outlet />
    return <ReauthDialog onCancel={() => navigate('/', { replace: true })} />
}