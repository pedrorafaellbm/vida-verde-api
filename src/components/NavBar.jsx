import { useDeferredValue, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../context/LocaleContext'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const deferredSearch = useDeferredValue(search)
  const { t } = useI18n()

  useEffect(() => {
    if (location.pathname !== '/products') return
    setSearch(searchParams.get('search') || '')
  }, [location.pathname, searchParams])

  useEffect(() => {
    if (location.pathname !== '/products' && !deferredSearch) return
    const nextSearch = deferredSearch.trim()
    navigate(nextSearch ? `/products?search=${encodeURIComponent(nextSearch)}` : '/products', { replace: true })
  }, [deferredSearch, location.pathname, navigate])

  return (
    <nav className="site-nav">
      <div className="container nav-content">
        <div className="nav-links">
          <NavLink to="/inicio" className="nav-item">{t('nav.home')}</NavLink>
          <NavLink to="/products" className="nav-item">{t('nav.catalog')}</NavLink>
          <NavLink to="/destaques" className="nav-item">{t('nav.featured')}</NavLink>
          <NavLink to="/curtidos" className="nav-item">{t('nav.favorites')}</NavLink>
          <NavLink to="/endereco" className="nav-item">{t('nav.address')}</NavLink>
          <NavLink to="/contato" className="nav-item">{t('nav.contact')}</NavLink>
        </div>

        <label className="nav-search" aria-label={t('common.searchProducts')}>
          <span className="nav-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </span>
          <input type="search" placeholder={t('nav.searchPlaceholder')} value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      </div>
    </nav>
  )
}
