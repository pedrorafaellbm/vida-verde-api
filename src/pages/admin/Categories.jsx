import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { DataTable } from '../../components/admin/DataTable'

const mockCategories = [
  { id: 'c1', nome: 'Folhagens', descricao: 'Plantas para ambientes internos' },
  { id: 'c2', nome: 'Flores', descricao: 'Plantas floridas e ornamentais' },
  { id: 'c3', nome: 'Suculentas', descricao: 'Facil cuidado e pouca rega' },
]

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    setCategories(mockCategories)
  }, [])

  const resetForm = () => {
    setName('')
    setDescription('')
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingId
            ? { ...category, nome: name.trim(), descricao: description.trim() }
            : category
        )
      )
      resetForm()
      return
    }

    setCategories((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        nome: name.trim(),
        descricao: description.trim(),
      },
    ])
    resetForm()
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setName(category.nome)
    setDescription(category.descricao)
  }

  const handleDelete = () => {
    if (!selectedCategory) return
    setCategories((prev) => prev.filter((category) => category.id !== selectedCategory.id))
    setSelectedCategory(null)
    if (editingId === selectedCategory.id) {
      resetForm()
    }
  }

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'descricao', header: 'Descricao' },
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
        <p>CRUD de categorias de produto</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da categoria"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descricao"
        />
        <button type="submit" className="btn">
          {editingId ? 'Salvar Edicao' : 'Criar Categoria'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      <DataTable columns={columns} data={categories} emptyText="Nenhuma categoria cadastrada." />

      <ConfirmModal
        open={Boolean(selectedCategory)}
        title="Excluir categoria"
        message={`Deseja remover "${selectedCategory?.nome}"?`}
        onConfirm={handleDelete}
        onCancel={() => setSelectedCategory(null)}
      />
    </section>
  )
}
