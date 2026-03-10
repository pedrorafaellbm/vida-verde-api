import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../context/LocaleContext'

export function Topbar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useI18n()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header className="admin-topbar">
      <div>
        <h1 className="admin-title">{t('admin.panelTitle')}</h1>
        <p className="admin-subtitle">{t('admin.panelSubtitle')}</p>
      </div>
      <div className="admin-topbar-actions">
        <span className="admin-user">{t('admin.userLabel')}: {user.nome || t('common.visitor')}</span>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/inicio')}>{t('nav.viewStore')}</button>
        <button type="button" className="btn" onClick={handleLogout}>{t('nav.logout')}</button>
      </div>
    </header>
  )
}
