import { useNavigate } from 'react-router-dom'
import { clearAuthSession, getUser, getUserRole } from '../service/auth'
import '../styles/cart.css'

export const Profile = () => {
  const navigate = useNavigate()
  const user = getUser()
  const role = getUserRole()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <section className="profile-page">
      <h1>Meu Perfil</h1>
      <div className="profile-card">
        <p>
          <strong>Nome:</strong> {user.nome || 'Nao informado'}
        </p>
        <p>
          <strong>Email:</strong> {user.email || 'Nao informado'}
        </p>
        <p>
          <strong>Perfil:</strong> {role}
        </p>
        <button type="button" className="btn" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </section>
  )
}
