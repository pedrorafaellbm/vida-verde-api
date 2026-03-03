import { useEffect, useState } from 'react'
import { DataTable } from '../../components/admin/DataTable'

const mockOrders = [
  { id: 'o-1001', cliente: 'Ana Paula', total: 249.8, status: 'pendente' },
  { id: 'o-1002', cliente: 'Carlos Lima', total: 89.9, status: 'processando' },
  { id: 'o-1003', cliente: 'Marina Souza', total: 430.5, status: 'enviado' },
]

const statusFlow = ['pendente', 'processando', 'enviado', 'entregue']

const toMoney = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const nextStatus = (currentStatus) => {
  const index = statusFlow.indexOf(currentStatus)
  return statusFlow[(index + 1) % statusFlow.length]
}

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(mockOrders)
  }, [])

  const handleStatusChange = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus(order.status) } : order
      )
    )
  }

  const columns = [
    { key: 'id', header: 'Pedido' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'total', header: 'Total', render: (row) => toMoney(row.total) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className={`status-pill status-${row.status}`}>{row.status}</span>,
    },
    {
      key: 'acoes',
      header: 'Acoes',
      render: (row) => (
        <button type="button" className="btn btn-secondary" onClick={() => handleStatusChange(row.id)}>
          Alterar Status
        </button>
      ),
    },
  ]

  return (
    <section>
      <div className="admin-section-header">
        <h2>Pedidos</h2>
        <p>Gerencie o fluxo de entrega dos pedidos</p>
      </div>
      <DataTable columns={columns} data={orders} emptyText="Nenhum pedido encontrado." />
    </section>
  )
}
