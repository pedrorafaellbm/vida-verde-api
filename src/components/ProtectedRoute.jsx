import { Navigate, useLocation } from 'react-router-dom'
import { getToken, isAdmin } from '../service/auth'

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}
