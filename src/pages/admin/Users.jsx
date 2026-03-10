import { useEffect, useState } from 'react'
import { DataTable } from '../../components/admin/DataTable'
import { getUser } from '../../service/auth'
import { deleteUser, getErrorMessage, listAdminUsers, updateUserRole } from '../../service/adminApi'
import { useI18n } from '../../context/LocaleContext'

const roleLabel = (role, t) => (role === 'admin' ? t('admin.adminLabel') : t('admin.userLabelChip'))

export default function Users() {
  const { t } = useI18n()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const currentUser = getUser()

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try { setUsers(await listAdminUsers()) } catch (err) { setError(getErrorMessage(err, t('admin.usersError'))) } finally { setLoading(false) }
  }

  useEffect(() => { loadUsers() }, [t])

  const toggleRole = async (user) => {
    if (user.id === currentUser.id) { setError(t('admin.selfRoleError')); return }
    const nextRole = user.role === 'admin' ? 'customer' : 'admin'
    try {
      const updated = await updateUserRole(user.id, nextRole)
      setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, role: updated.role } : item)))
    } catch (err) {
      setError(getErrorMessage(err, t('admin.changeRoleError')))
    }
  }

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser.id) { setError(t('admin.selfDeleteError')); return }
    const confirmed = window.confirm(`${t('admin.confirmDeleteProduct')} "${user.nome}"?`)
    if (!confirmed) return
    try {
      await deleteUser(user.id)
      setUsers((prev) => prev.filter((item) => item.id !== user.id))
    } catch (err) {
      setError(getErrorMessage(err, t('admin.deleteUserError')))
    }
  }

  const columns = [
    { key: 'nome', header: t('admin.name') },
    { key: 'email', header: t('profile.email') },
    { key: 'role', header: t('admin.role'), render: (row) => <span className="role-chip">{roleLabel(row.role, t)}</span> },
    { key: 'acoes', header: t('admin.actions'), render: (row) => <div className="admin-actions"><button type="button" className="btn btn-secondary" onClick={() => toggleRole(row)}>{t('admin.changeRole')}</button><button type="button" className="btn" onClick={() => handleDeleteUser(row)}>{t('common.delete')}</button></div> },
  ]

  return (
    <section>
      <div className="admin-section-header"><h2>{t('admin.users')}</h2><p>{t('admin.permissionsHint')}</p></div>
      {error && <p className="admin-error">{error}</p>}
      {loading ? <div className="admin-empty">{t('admin.loadingUsers')}</div> : <DataTable columns={columns} data={users} emptyText={t('admin.noUsers')} />}
    </section>
  )
}
