import { NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav className="site-nav">
      <div className="container nav-content">
        <NavLink to="/home" className="nav-item">
          Home
        </NavLink>
        <NavLink to="/products" className="nav-item">
          Catálogo
        </NavLink>
        <NavLink to="/endereco" className="nav-item">
          Endereço
        </NavLink>
        <NavLink to="/contato" className="nav-item">
          Contato
        </NavLink>
      </div>
    </nav>
  )
}
