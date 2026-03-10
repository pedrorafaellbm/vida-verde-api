import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/LocaleContext'
import { Navbar } from './NavBar'

export const Header = () => {
  const { cartItems } = useCart()
  const { user, isAdmin } = useAuth()
  const { t } = useI18n()
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="site-header">
      <div className="container header-top">
        <Link to="/inicio" className="logo-link">greenstore</Link>

        <div className="header-actions">
          <span className="welcome-text">{t('nav.hello')}, {user?.nome || t('common.visitor')}</span>
          <NavLink to="/curtidos" className="header-link">{t('nav.favorites')}</NavLink>
          <NavLink to="/carrinho" className="header-link cart-link">{t('nav.cart')}<span className="cart-badge">{cartCount}</span></NavLink>
          <NavLink to="/perfil" className="header-link">{t('nav.profile')}</NavLink>
          {isAdmin ? <NavLink to="/admin" className="header-link">{t('nav.panel')}</NavLink> : null}
        </div>
      </div>
      <Navbar />
    </header>
  )
}
