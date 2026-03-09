import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Navbar } from './NavBar'

export const Header = () => {
  const { cartItems } = useCart()
  const { user, isAdmin } = useAuth()
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="site-header">
      <div className="container header-top">
        <Link to="/inicio" className="logo-link">
          Vida Verde
        </Link>

        <div className="header-actions">
          <span className="welcome-text">Ola, {user?.nome || 'Visitante'}</span>
          <NavLink to="/curtidos" className="header-link">
            Curtidos
          </NavLink>
          <NavLink to="/carrinho" className="header-link cart-link">
            Carrinho
            <span className="cart-badge">{cartCount}</span>
          </NavLink>
          <NavLink to="/perfil" className="header-link">
            Perfil
          </NavLink>
          {isAdmin ? (
            <NavLink to="/admin" className="header-link">
              Painel
            </NavLink>
          ) : null}
        </div>
      </div>
      <Navbar />
    </header>
  )
}
