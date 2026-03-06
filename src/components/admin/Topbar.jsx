import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function Topbar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header className="admin-topbar">
      <div>
        <h1 className="admin-title">Painel Administrativo</h1>
        <p className="admin-subtitle">Gestao da loja de plantas</p>
      </div>

      <div className="admin-topbar-actions">
        <span className="admin-user">Admin: {user.nome || 'Usuario'}</span>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/home')}>
          Ver Loja
        </button>
        <button type="button" className="btn" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  )
}
