import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/LocaleContext'
import '../styles/cart.css'

export const Profile = () => {
  const navigate = useNavigate()
  const { user, role, signOut } = useAuth()
  const { t } = useI18n()
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
      <h1>{t('profile.title')}</h1>
      <div className="profile-card">
        <div className="profile-avatar" style={{ backgroundColor: avatarColor }}>{initial}</div>
        <p><strong>{t('profile.name')}:</strong> {user.nome || t('profile.notProvided')}</p>
        <p><strong>{t('profile.email')}:</strong> {user.email || t('profile.notProvided')}</p>
        <p><strong>{t('profile.role')}:</strong> {role}</p>
        <button type="button" className="btn" onClick={handleLogout}>{t('profile.logout')}</button>
      </div>
    </section>
  )
}
