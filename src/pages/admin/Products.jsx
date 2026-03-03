import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { DataTable } from '../../components/admin/DataTable'
import {
  createProduct,
  deleteProduct,
  getErrorMessage,
  listProducts,
  updateProduct,
} from '../../service/adminApi'

const defaultForm = {
  nome: '',
  preco: '',
  estoque: '',
  descricao: '',
  imageFile: null,
}

const toMoney = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0))

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listProducts()
      setProducts(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar os produtos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId(null)
  }

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      nome: product.nome || '',
      preco: String(product.preco ?? ''),
      estoque: String(product.estoque ?? ''),
      descricao: product.descricao || '',
      imageFile: null,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      nome: form.nome.trim(),
      preco: Number(form.preco),
      estoque: Number(form.estoque),
      descricao: form.descricao.trim(),
      imageFile: form.imageFile,
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      await loadProducts()
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel salvar o produto.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return
    try {
      await deleteProduct(selectedProduct.id)
      setProducts((prev) => prev.filter((item) => item.id !== selectedProduct.id))
      setSelectedProduct(null)
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel excluir o produto.'))
    }
  }

  const columns = [
    {
      key: 'imageUrl',
      header: 'Imagem',
      render: (row) =>
        row.imageUrl ? (
          <img src={row.imageUrl} alt={row.nome} className="admin-product-thumb" />
        ) : (
          <span className="role-chip">sem imagem</span>
        ),
    },
    { key: 'nome', header: 'Produto' },
    { key: 'preco', header: 'Preco', render: (row) => toMoney(row.preco) },
    { key: 'estoque', header: 'Estoque' },
    {
      key: 'acoes',
      header: 'Acoes',
      render: (row) => (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary" onClick={() => handleEdit(row)}>
            Editar
          </button>
          <button type="button" className="btn" onClick={() => setSelectedProduct(row)}>
            Excluir
          </button>
        </div>
      ),
    },
  ]

  return (
    <section>
      <div className="admin-section-header">
        <h2>Produtos</h2>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          value={form.nome}
          onChange={(e) => onChange('nome', e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.preco}
          onChange={(e) => onChange('preco', e.target.value)}
          placeholder="Preco"
          required
        />
        <input
          type="number"
          min="0"
          value={form.estoque}
          onChange={(e) => onChange('estoque', e.target.value)}
          placeholder="Estoque"
          required
        />
        <input
          value={form.descricao}
          onChange={(e) => onChange('descricao', e.target.value)}
          placeholder="Descricao"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange('imageFile', e.target.files?.[0] || null)}
          required={!editingId}
        />
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Salvando...' : editingId ? 'Salvar Edicao' : 'Criar Produto'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <div className="admin-empty">Carregando produtos...</div>
      ) : (
        <DataTable columns={columns} data={products} emptyText="Nenhum produto cadastrado." />
      )}

      <ConfirmModal
        open={Boolean(selectedProduct)}
        title="Excluir produto"
        message={`Deseja remover "${selectedProduct?.nome}"?`}
        onConfirm={handleDelete}
        onCancel={() => setSelectedProduct(null)}
      />
    </section>
  )
}
