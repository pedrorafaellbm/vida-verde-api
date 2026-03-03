import { NavLink } from 'react-router-dom'

const items = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Produtos' },
  { to: '/admin/orders', label: 'Pedidos' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/categories', label: 'Categorias' },
]

export function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">Vida Verde Admin</div>
      <nav className="admin-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'admin-nav-link active' : 'admin-nav-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
