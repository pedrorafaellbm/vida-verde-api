import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getUser, isAdmin } from '../service/auth'
import { Navbar } from './Navbar'

const formatUserName = () => {
  const user = getUser()
  return user.nome || 'Usuario'
}

export const Header = () => {
  const { cartItems } = useCart()
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="site-header">
      <div className="container header-top">
        <Link to="/home" className="logo-link">
          GreenStore
        </Link>

        <div className="header-actions">
          <span className="welcome-text">Ola, {formatUserName()}</span>
          <NavLink to="/products" className="header-link">
            Produtos
          </NavLink>
          <NavLink to="/cart" className="header-link cart-link">
            Carrinho
            <span className="cart-badge">{cartCount}</span>
          </NavLink>
          <NavLink to="/profile" className="header-link">
            Perfil
          </NavLink>
          {isAdmin() && (
            <NavLink to="/admin" className="header-link">
              Admin
            </NavLink>
          )}
        </div>
      </div>
      <Navbar />
    </header>
  )
}
