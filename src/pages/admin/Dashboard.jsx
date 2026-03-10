import { useEffect, useState } from 'react'
import { StatCard } from '../../components/admin/StatCard'
import { useI18n } from '../../context/LocaleContext'
import { getErrorMessage, listAdminUsers, listProducts } from '../../service/adminApi'

const mockOrders = 132
const mockRevenue = 18450.9
const formatCurrency = (value) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(value)

export default function Dashboard() {
  const { t } = useI18n()
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: mockOrders, totalUsers: 0, totalRevenue: mockRevenue })
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [products, users] = await Promise.all([listProducts(), listAdminUsers()])
        setStats((prev) => ({ ...prev, totalProducts: products.length, totalUsers: users.length }))
      } catch (err) {
        setError(getErrorMessage(err, t('admin.dashboardError')))
      }
    }
    load()
  }, [t])

  return (
    <section>
      <div className="admin-section-header">
        <h2>{t('admin.dashboard')}</h2>
        <p>{t('admin.dashboardHint')}</p>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-stats-grid">
        <StatCard title={t('admin.totalProducts')} value={stats.totalProducts} />
        <StatCard title={t('admin.totalOrders')} value={stats.totalOrders} helper={t('admin.temporaryMock')} />
        <StatCard title={t('admin.totalUsers')} value={stats.totalUsers} />
        <StatCard title={t('admin.totalRevenue')} value={formatCurrency(stats.totalRevenue)} helper={t('admin.temporaryMock')} />
      </div>
    </section>
  )
}
