import { useEffect, useState } from 'react'
import { DataTable } from '../../components/admin/DataTable'
import { useI18n } from '../../context/LocaleContext'

const mockOrders = [
  { id: 'o-1001', cliente: 'Ana Paula', total: 249.8, status: 'pendente' },
  { id: 'o-1002', cliente: 'Carlos Lima', total: 89.9, status: 'processando' },
  { id: 'o-1003', cliente: 'Marina Souza', total: 430.5, status: 'enviado' },
]

const statusFlow = ['pendente', 'processando', 'enviado', 'entregue']
const toMoney = (value) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(value)
const nextStatus = (currentStatus) => statusFlow[(statusFlow.indexOf(currentStatus) + 1) % statusFlow.length]

export default function Orders() {
  const { t } = useI18n()
  const [orders, setOrders] = useState([])

  useEffect(() => { setOrders(mockOrders) }, [])

  const handleStatusChange = (orderId) => {
    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: nextStatus(order.status) } : order))
  }

  const statusLabel = (status) => ({ pendente: t('admin.pending'), processando: t('admin.processing'), enviado: t('admin.shipped'), entregue: t('admin.delivered') }[status] || status)

  const columns = [
    { key: 'id', header: t('admin.orders') },
    { key: 'cliente', header: t('admin.customer') },
    { key: 'total', header: t('admin.total'), render: (row) => toMoney(row.total) },
    { key: 'status', header: t('admin.status'), render: (row) => <span className={`status-pill status-${row.status}`}>{statusLabel(row.status)}</span> },
    { key: 'acoes', header: t('admin.actions'), render: (row) => <button type="button" className="btn btn-secondary" onClick={() => handleStatusChange(row.id)}>{t('admin.changeStatus')}</button> },
  ]

  return (
    <section>
      <div className="admin-section-header"><h2>{t('admin.orders')}</h2><p>{t('admin.ordersHint')}</p></div>
      <DataTable columns={columns} data={orders} emptyText={t('admin.noOrders')} />
    </section>
  )
}
