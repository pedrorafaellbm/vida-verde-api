import { useEffect, useState } from 'react'
import { useI18n } from '../../context/LocaleContext'
import { getErrorMessage, getStoreInfo, updateStoreInfo } from '../../service/adminApi'

export default function StoreInfo() {
  const { t } = useI18n()
  const defaultForm = { title: t('home.aboutTitle'), description: '', mission: '', quality: '', delivery: '' }
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadInfo = async () => {
      setLoading(true)
      setError('')
      try { setForm({ ...defaultForm, ...(await getStoreInfo() || {}) }) } catch (err) { setError(getErrorMessage(err, t('admin.storeInfoError'))) } finally { setLoading(false) }
    }
    loadInfo()
  }, [t])

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try { await updateStoreInfo(form); setMessage(t('admin.storeInfoSaved')) } catch (err) { setError(getErrorMessage(err, t('admin.saveStoreInfoError'))) } finally { setSaving(false) }
  }

  return (
    <section>
      <div className="admin-section-header"><h2>{t('admin.storeInfo')}</h2><p>{t('admin.storeInfoHint')}</p></div>
      {loading ? <div className="admin-empty">{t('admin.loadingContent')}</div> : <form className="admin-form admin-form-stacked" onSubmit={handleSubmit}><input value={form.title} onChange={(event) => handleChange('title', event.target.value)} placeholder={t('admin.titlePlaceholder')} required /><textarea value={form.description} onChange={(event) => handleChange('description', event.target.value)} placeholder={t('admin.mainDescriptionPlaceholder')} rows={4} /><textarea value={form.mission} onChange={(event) => handleChange('mission', event.target.value)} placeholder={t('admin.missionPlaceholder')} rows={3} /><textarea value={form.quality} onChange={(event) => handleChange('quality', event.target.value)} placeholder={t('admin.qualityPlaceholder')} rows={3} /><textarea value={form.delivery} onChange={(event) => handleChange('delivery', event.target.value)} placeholder={t('admin.deliveryPlaceholder')} rows={3} /><button type="submit" className="btn" disabled={saving}>{saving ? t('admin.saveBannerLoading') : t('admin.saveContent')}</button></form>}
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-success">{message}</p> : null}
    </section>
  )
}
