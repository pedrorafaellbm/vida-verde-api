import { useEffect, useState } from 'react'
import { StatCard } from '../../components/admin/StatCard'
import { getErrorMessage, listAdminUsers, listProducts } from '../../service/adminApi'

const mockOrders = 132
const mockRevenue = 18450.9

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: mockOrders,
    totalUsers: 0,
    totalRevenue: mockRevenue,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [products, users] = await Promise.all([listProducts(), listAdminUsers()])
        setStats((prev) => ({
          ...prev,
          totalProducts: products.length,
          totalUsers: users.length,
        }))
      } catch (err) {
        setError(getErrorMessage(err, 'Nao foi possivel carregar todos os indicadores.'))
      }
    }

    load()
  }, [])

  return (
    <section>
      <div className="admin-section-header">
        <h2>Dashboard</h2>
        <p>Visao geral da operacao</p>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-stats-grid">
        <StatCard title="Total de Produtos" value={stats.totalProducts} />
        <StatCard title="Total de Pedidos" value={stats.totalOrders} helper="Mock temporario" />
        <StatCard title="Total de Usuarios" value={stats.totalUsers} />
        <StatCard
          title="Faturamento Total"
          value={formatCurrency(stats.totalRevenue)}
          helper="Mock temporario"
        />
      </div>
    </section>
  )
}
