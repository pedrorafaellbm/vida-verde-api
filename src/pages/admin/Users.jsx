import { useEffect, useState } from 'react'
import { DataTable } from '../../components/admin/DataTable'
import { getUser } from '../../service/auth'
import {
  deleteUser,
  getErrorMessage,
  listAdminUsers,
  updateUserRole,
} from '../../service/adminApi'

const roleLabel = (role) => (role === 'admin' ? 'admin' : 'user')

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const currentUser = getUser()

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listAdminUsers()
      setUsers(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar usuarios.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const toggleRole = async (user) => {
    if (user.id === currentUser.id) {
      setError('Nao e permitido alterar seu proprio role por aqui.')
      return
    }

    const nextRole = user.role === 'admin' ? 'customer' : 'admin'
    try {
      const updated = await updateUserRole(user.id, nextRole)
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, role: updated.role } : item))
      )
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel alterar o role do usuario.'))
    }
  }

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser.id) {
      setError('Voce nao pode excluir sua propria conta.')
      return
    }

    const confirmed = window.confirm(`Deseja excluir o usuario "${user.nome}"?`)
    if (!confirmed) return

    try {
      await deleteUser(user.id)
      setUsers((prev) => prev.filter((item) => item.id !== user.id))
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel excluir o usuario.'))
    }
  }

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <span className="role-chip">{roleLabel(row.role)}</span>,
    },
    {
      key: 'acoes',
      header: 'Acoes',
      render: (row) => (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary" onClick={() => toggleRole(row)}>
            Alterar Role
          </button>
          <button type="button" className="btn" onClick={() => handleDeleteUser(row)}>
            Excluir
          </button>
        </div>
      ),
    },
  ]

  return (
    <section>
      <div className="admin-section-header">
        <h2>Usuarios</h2>
        <p>Controle de permissoes administrativas</p>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <div className="admin-empty">Carregando usuarios...</div>
      ) : (
        <DataTable columns={columns} data={users} emptyText="Nenhum usuario encontrado." />
      )}
    </section>
  )
}
