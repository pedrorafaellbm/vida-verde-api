import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { DataTable } from '../../components/admin/DataTable'
import { useI18n } from '../../context/LocaleContext'
import { createCategory, deleteCategory, getErrorMessage, listCategories, updateCategory } from '../../service/adminApi'

export default function Categories() {
  const { t } = useI18n()
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
      setError(getErrorMessage(err, t('admin.categoriesError')))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCategories() }, [t])

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
      if (editingId) await updateCategory(editingId, { name: normalizedName })
      else await createCategory({ name: normalizedName })
      await loadCategories()
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.saveCategoryError')))
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
      if (editingId === selectedCategory.id) resetForm()
      await loadCategories()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.deleteCategoryError')))
    }
  }

  const columns = [
    { key: 'name', header: t('admin.name') },
    { key: 'acoes', header: t('admin.actions'), render: (row) => <div className="admin-actions"><button type="button" className="btn btn-secondary" onClick={() => startEdit(row)}>{t('common.edit')}</button><button type="button" className="btn" onClick={() => setSelectedCategory(row)}>{t('common.delete')}</button></div> },
  ]

  return (
    <section>
      <div className="admin-section-header">
        <h2>{t('admin.categories')}</h2>
        <p>{t('admin.createCategoryHint')}</p>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder={t('admin.categoryNamePlaceholder')} required />
        <button type="submit" className="btn">{editingId ? t('admin.saveEdit') : t('admin.createCategory')}</button>
        {editingId ? <button type="button" className="btn btn-secondary" onClick={resetForm}>{t('common.cancel')}</button> : null}
      </form>
      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <div className="admin-empty">{t('admin.loadingCategories')}</div> : <DataTable columns={columns} data={categories} emptyText={t('admin.noCategories')} />}
      <ConfirmModal open={Boolean(selectedCategory)} title={t('admin.confirmDeleteCategory')} message={`${t('admin.confirmDeleteCategory')} "${selectedCategory?.name}"?`} onConfirm={handleDelete} onCancel={() => setSelectedCategory(null)} />
    </section>
  )
}
