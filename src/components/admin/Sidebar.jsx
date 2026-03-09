import { NavLink } from 'react-router-dom'

const items = [
  { to: '/admin', label: 'Visao geral', end: true },
  { to: '/admin/products', label: 'Produtos' },
  { to: '/admin/orders', label: 'Pedidos' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/categories', label: 'Categorias' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/store-info', label: 'Sobre a Loja' },
]

export function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">Vida Verde Painel</div>
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
