import { useEffect, useState } from 'react'
import { getErrorMessage, getStoreInfo, updateStoreInfo } from '../../service/adminApi'

const defaultForm = {
  title: 'Sobre a Loja',
  description: '',
  mission: '',
  quality: '',
  delivery: '',
}

export default function StoreInfo() {
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadInfo = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getStoreInfo()
        setForm({ ...defaultForm, ...(data || {}) })
      } catch (err) {
        setError(getErrorMessage(err, 'Nao foi possivel carregar as informacoes da loja.'))
      } finally {
        setLoading(false)
      }
    }

    loadInfo()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await updateStoreInfo(form)
      setMessage('Informacoes da loja atualizadas com sucesso.')
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel salvar as informacoes da loja.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <div className="admin-section-header">
        <h2>Sobre a Loja</h2>
        <p>Edite o conteudo institucional exibido na home.</p>
      </div>

      {loading ? (
        <div className="admin-empty">Carregando conteudo...</div>
      ) : (
        <form className="admin-form admin-form-stacked" onSubmit={handleSubmit}>
          <input value={form.title} onChange={(event) => handleChange('title', event.target.value)} placeholder="Titulo" required />
          <textarea
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
            placeholder="Descricao principal"
            rows={4}
          />
          <textarea
            value={form.mission}
            onChange={(event) => handleChange('mission', event.target.value)}
            placeholder="Missao"
            rows={3}
          />
          <textarea
            value={form.quality}
            onChange={(event) => handleChange('quality', event.target.value)}
            placeholder="Qualidade"
            rows={3}
          />
          <textarea
            value={form.delivery}
            onChange={(event) => handleChange('delivery', event.target.value)}
            placeholder="Entrega"
            rows={3}
          />
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar conteudo'}
          </button>
        </form>
      )}

      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-success">{message}</p> : null}
    </section>
  )
}
