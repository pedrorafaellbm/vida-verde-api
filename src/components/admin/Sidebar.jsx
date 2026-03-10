import { NavLink } from 'react-router-dom'
import { useI18n } from '../../context/LocaleContext'

export function Sidebar() {
  const { t } = useI18n()
  const items = [
    { to: '/admin', label: t('admin.dashboard'), end: true },
    { to: '/admin/products', label: t('admin.products') },
    { to: '/admin/orders', label: t('admin.orders') },
    { to: '/admin/users', label: t('admin.users') },
    { to: '/admin/categories', label: t('admin.categories') },
    { to: '/admin/banners', label: t('admin.banners') },
    { to: '/admin/store-info', label: t('admin.storeInfo') },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">greenstore admin</div>
      <nav className="admin-nav">
        {items.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>{item.label}</NavLink>)}
      </nav>
    </aside>
  )
}
