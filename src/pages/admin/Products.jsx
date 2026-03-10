import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { DataTable } from '../../components/admin/DataTable'
import { useI18n } from '../../context/LocaleContext'
import { createProduct, deleteProduct, getErrorMessage, listCategories, listProducts, updateProduct } from '../../service/adminApi'

const defaultForm = { nome: '', categoria: '', preco: '', estoque: '', descricao: '', imageFile: null }
const toMoney = (value) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(Number(value || 0))

export default function AdminProducts() {
  const { t } = useI18n()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [productsData, categoriesData] = await Promise.all([listProducts(), listCategories()])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(getErrorMessage(err, t('admin.productDataError')))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [t])

  const resetForm = () => { setForm(defaultForm); setEditingId(null) }
  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const resolveCategoryName = (product) => product?.category?.name || product?.categoria || ''

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({ nome: product.nome || '', categoria: resolveCategoryName(product), preco: String(product.preco ?? ''), estoque: String(product.estoque ?? ''), descricao: product.descricao || '', imageFile: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { nome: form.nome.trim(), categoria: form.categoria, preco: Number(form.preco), estoque: Number(form.estoque), descricao: form.descricao.trim(), imageFile: form.imageFile }
    try {
      if (editingId) await updateProduct(editingId, payload)
      else await createProduct(payload)
      await loadData()
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.saveProductError')))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return
    try {
      await deleteProduct(selectedProduct.id)
      setSelectedProduct(null)
      await loadData()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.deleteProductError')))
    }
  }

  const columns = [
    { key: 'imageUrl', header: t('admin.image'), render: (row) => row.imageUrl ? <img src={row.imageUrl} alt={row.nome} className="admin-product-thumb" /> : <span className="role-chip">{t('common.noImage')}</span> },
    { key: 'nome', header: t('admin.product') },
    { key: 'categoria', header: t('admin.category'), render: (row) => resolveCategoryName(row) || <span className="role-chip">{t('admin.withoutCategory')}</span> },
    { key: 'preco', header: t('admin.price'), render: (row) => toMoney(row.preco) },
    { key: 'estoque', header: t('admin.stock') },
    { key: 'acoes', header: t('admin.actions'), render: (row) => <div className="admin-actions"><button type="button" className="btn btn-secondary" onClick={() => handleEdit(row)}>{t('common.edit')}</button><button type="button" className="btn" onClick={() => setSelectedProduct(row)}>{t('common.delete')}</button></div> },
  ]

  return (
    <section>
      <div className="admin-section-header"><h2>{t('admin.products')}</h2></div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input value={form.nome} onChange={(e) => onChange('nome', e.target.value)} placeholder={t('admin.namePlaceholder')} required />
        <select value={form.categoria} onChange={(e) => onChange('categoria', e.target.value)} disabled={!categories.length}>
          <option value="">{t('admin.selectCategory')}</option>
          {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
        </select>
        <input type="number" min="0" step="0.01" value={form.preco} onChange={(e) => onChange('preco', e.target.value)} placeholder={t('admin.pricePlaceholder')} required />
        <input type="number" min="0" value={form.estoque} onChange={(e) => onChange('estoque', e.target.value)} placeholder={t('admin.stockPlaceholder')} required />
        <input value={form.descricao} onChange={(e) => onChange('descricao', e.target.value)} placeholder={t('admin.descriptionPlaceholder')} />
        <input type="file" accept="image/*" onChange={(e) => onChange('imageFile', e.target.files?.[0] || null)} required={!editingId} />
        <button type="submit" className="btn" disabled={saving}>{saving ? t('admin.saveBannerLoading') : editingId ? t('admin.saveEdit') : t('admin.createProduct')}</button>
        {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>{t('common.cancel')}</button>}
      </form>
      {!categories.length && <p className="admin-error">{t('admin.productsNeedCategory')}</p>}
      {error && <p className="admin-error">{error}</p>}
      {loading ? <div className="admin-empty">{t('admin.loadingProducts')}</div> : <DataTable columns={columns} data={products} emptyText={t('admin.noProducts')} />}
      <ConfirmModal open={Boolean(selectedProduct)} title={t('admin.confirmDeleteProduct')} message={`${t('admin.confirmDeleteProduct')} "${selectedProduct?.nome}"?`} onConfirm={handleDelete} onCancel={() => setSelectedProduct(null)} />
    </section>
  )
}
