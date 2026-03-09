import { useDeferredValue, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    if (location.pathname !== '/products') return
    setSearch(searchParams.get('search') || '')
  }, [location.pathname, searchParams])

  useEffect(() => {
    if (location.pathname !== '/products' && !deferredSearch) return
    const nextSearch = deferredSearch.trim()
    navigate(nextSearch ? `/products?search=${encodeURIComponent(nextSearch)}` : '/products', {
      replace: true,
    })
  }, [deferredSearch, location.pathname, navigate])

  return (
    <nav className="site-nav">
      <div className="container nav-content">
        <div className="nav-links">
          <NavLink to="/inicio" className="nav-item">
            Inicio
          </NavLink>
          <NavLink to="/products" className="nav-item">
            Catalogo
          </NavLink>
          <NavLink to="/destaques" className="nav-item">
            Destaques
          </NavLink>
          <NavLink to="/curtidos" className="nav-item">
            Curtidos
          </NavLink>
          <NavLink to="/endereco" className="nav-item">
            Endereco
          </NavLink>
          <NavLink to="/contato" className="nav-item">
            Contato
          </NavLink>
        </div>

        <label className="nav-search" aria-label="Buscar produtos">
          <span className="nav-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Buscar produtos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
    </nav>
  )
}
