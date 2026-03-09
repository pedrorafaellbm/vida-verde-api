import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { DataTable } from '../../components/admin/DataTable'
import {
  createCategory,
  deleteCategory,
  getErrorMessage,
  listCategories,
  updateCategory,
} from '../../service/adminApi'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listCategories()
      setCategories(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar categorias.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const resetForm = () => {
    setName('')
    setEditingId(null)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedName = name.trim()
    if (!normalizedName) return

    try {
      if (editingId) {
        await updateCategory(editingId, { name: normalizedName })
      } else {
        await createCategory({ name: normalizedName })
      }

      await loadCategories()
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel salvar a categoria.'))
    }
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setName(category.name || '')
    setError('')
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      await deleteCategory(selectedCategory.id)
      setSelectedCategory(null)
      if (editingId === selectedCategory.id) {
        resetForm()
      }
      await loadCategories()
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel excluir a categoria.'))
    }
  }

  const columns = [
    { key: 'name', header: 'Nome' },
    {
      key: 'acoes',
      header: 'Acoes',
      render: (row) => (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary" onClick={() => startEdit(row)}>
            Editar
          </button>
          <button type="button" className="btn" onClick={() => setSelectedCategory(row)}>
            Excluir
          </button>
        </div>
      ),
    },
  ]

  return (
    <section>
      <div className="admin-section-header">
        <h2>Categorias</h2>
        <p>Gerencie os grupos exibidos no catalogo e na pagina inicial.</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nome da categoria"
          required
        />
        <button type="submit" className="btn">
          {editingId ? 'Salvar edicao' : 'Criar categoria'}
        </button>
        {editingId ? (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancelar
          </button>
        ) : null}
      </form>

      {error ? <p className="admin-error">{error}</p> : null}

      {loading ? (
        <div className="admin-empty">Carregando categorias...</div>
      ) : (
        <DataTable columns={columns} data={categories} emptyText="Nenhuma categoria cadastrada." />
      )}

      <ConfirmModal
        open={Boolean(selectedCategory)}
        title="Excluir categoria"
        message={`Deseja remover "${selectedCategory?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setSelectedCategory(null)}
      />
    </section>
  )
}
