import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { DataTable } from '../../components/admin/DataTable'
import { useI18n } from '../../context/LocaleContext'
import { createBanner, deleteBanner, getErrorMessage, listBanners, updateBanner } from '../../service/adminApi'

const defaultForm = { title: '', description: '', link: '', button_text: '', image_url: '', imageFile: null }

export default function Banners() {
  const { t } = useI18n()
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadBanners = async () => {
    setLoading(true)
    setError('')
    try { setBanners(await listBanners()) } catch (err) { setError(getErrorMessage(err, t('admin.bannersError'))) } finally { setLoading(false) }
  }

  useEffect(() => { loadBanners() }, [t])

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const resetForm = () => { setForm(defaultForm); setEditingId(null) }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateBanner(editingId, form)
      else await createBanner(form)
      await loadBanners()
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.saveBannerError')))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingId(banner.id)
    setForm({ title: banner.title || '', description: banner.description || '', link: banner.link || '', button_text: banner.button_text || '', image_url: banner.image_url || banner.imageUrl || '', imageFile: null })
  }

  const handleDelete = async () => {
    if (!selectedBanner) return
    try {
      await deleteBanner(selectedBanner.id)
      setSelectedBanner(null)
      await loadBanners()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.deleteBannerError')))
    }
  }

  const columns = [
    { key: 'image', header: t('admin.image'), render: (row) => row.image_url || row.imageUrl ? <img src={row.image_url || row.imageUrl} alt={row.title} className="admin-product-thumb" /> : '-' },
    { key: 'title', header: t('admin.title') },
    { key: 'link', header: t('admin.destination'), render: (row) => row.link || '-' },
    { key: 'acoes', header: t('admin.actions'), render: (row) => <div className="admin-actions"><button type="button" className="btn btn-secondary" onClick={() => handleEdit(row)}>{t('common.edit')}</button><button type="button" className="btn" onClick={() => setSelectedBanner(row)}>{t('common.delete')}</button></div> },
  ]

  return (
    <section>
      <div className="admin-section-header"><h2>{t('admin.banners')}</h2><p>{t('admin.bannersHint')}</p></div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input value={form.title} onChange={(event) => onChange('title', event.target.value)} placeholder={t('admin.titlePlaceholder')} required />
        <input value={form.description} onChange={(event) => onChange('description', event.target.value)} placeholder={t('admin.descriptionPlaceholder')} />
        <input value={form.link} onChange={(event) => onChange('link', event.target.value)} placeholder={t('admin.destinationPlaceholder')} />
        <input value={form.button_text} onChange={(event) => onChange('button_text', event.target.value)} placeholder={t('admin.buttonTextPlaceholder')} />
        <input value={form.image_url} onChange={(event) => onChange('image_url', event.target.value)} placeholder={t('admin.imageUrlPlaceholder')} />
        <input type="file" accept="image/*" onChange={(event) => onChange('imageFile', event.target.files?.[0] || null)} />
        <button type="submit" className="btn" disabled={saving}>{saving ? t('admin.saveBannerLoading') : editingId ? t('admin.saveBanner') : t('admin.createBanner')}</button>
        {editingId ? <button type="button" className="btn btn-secondary" onClick={resetForm}>{t('common.cancel')}</button> : null}
      </form>
      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <div className="admin-empty">{t('admin.loadingBanners')}</div> : <DataTable columns={columns} data={banners} emptyText={t('admin.noBanners')} />}
      <ConfirmModal open={Boolean(selectedBanner)} title={t('admin.confirmDeleteBanner')} message={`${t('admin.confirmDeleteBanner')} "${selectedBanner?.title}"?`} onConfirm={handleDelete} onCancel={() => setSelectedBanner(null)} />
    </section>
  )
}
