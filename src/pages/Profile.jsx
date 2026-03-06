import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/cart.css'

export const Profile = () => {
  const navigate = useNavigate()
  const { user, role, signOut } = useAuth()
  const initial = (user?.nome || 'U').charAt(0).toUpperCase()

  const avatarColor = (() => {
    const palette = ['#2f6d52', '#245440', '#3e7e63', '#4c8f73', '#2d7a8c']
    const source = user?.nome || 'usuario'
    const hash = source.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return palette[hash % palette.length]
  })()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <section className="profile-page">
      <h1>Meu Perfil</h1>
      <div className="profile-card">
        <div className="profile-avatar" style={{ backgroundColor: avatarColor }}>
          {initial}
        </div>
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
