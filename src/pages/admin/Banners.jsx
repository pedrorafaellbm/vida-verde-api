import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { DataTable } from '../../components/admin/DataTable'
import {
  createBanner,
  deleteBanner,
  getErrorMessage,
  listBanners,
  updateBanner,
} from '../../service/adminApi'

const defaultForm = {
  title: '',
  description: '',
  link: '',
  button_text: '',
  image_url: '',
  imageFile: null,
}

export default function Banners() {
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
    try {
      const data = await listBanners()
      setBanners(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar os banners.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingId) {
        await updateBanner(editingId, form)
      } else {
        await createBanner(form)
      }
      await loadBanners()
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel salvar o banner.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingId(banner.id)
    setForm({
      title: banner.title || '',
      description: banner.description || '',
      link: banner.link || '',
      button_text: banner.button_text || '',
      image_url: banner.image_url || banner.imageUrl || '',
      imageFile: null,
    })
  }

  const handleDelete = async () => {
    if (!selectedBanner) return
    try {
      await deleteBanner(selectedBanner.id)
      setSelectedBanner(null)
      await loadBanners()
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel excluir o banner.'))
    }
  }

  const columns = [
    {
      key: 'image',
      header: 'Imagem',
      render: (row) =>
        row.image_url || row.imageUrl ? (
          <img src={row.image_url || row.imageUrl} alt={row.title} className="admin-product-thumb" />
        ) : (
          '-'
        ),
    },
    { key: 'title', header: 'Titulo' },
    { key: 'link', header: 'Destino', render: (row) => row.link || '-' },
    {
      key: 'acoes',
      header: 'Acoes',
      render: (row) => (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary" onClick={() => handleEdit(row)}>
            Editar
          </button>
          <button type="button" className="btn" onClick={() => setSelectedBanner(row)}>
            Excluir
          </button>
        </div>
      ),
    },
  ]

  return (
    <section>
      <div className="admin-section-header">
        <h2>Banners</h2>
        <p>Controle os slides principais da home.</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input value={form.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Titulo" required />
        <input
          value={form.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="Descricao"
        />
        <input value={form.link} onChange={(event) => onChange('link', event.target.value)} placeholder="Link de destino" />
        <input
          value={form.button_text}
          onChange={(event) => onChange('button_text', event.target.value)}
          placeholder="Texto do botao"
        />
        <input
          value={form.image_url}
          onChange={(event) => onChange('image_url', event.target.value)}
          placeholder="URL da imagem"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onChange('imageFile', event.target.files?.[0] || null)}
        />
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Salvando...' : editingId ? 'Salvar Banner' : 'Criar Banner'}
        </button>
        {editingId ? (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancelar
          </button>
        ) : null}
      </form>

      {error ? <p className="admin-error">{error}</p> : null}

      {loading ? (
        <div className="admin-empty">Carregando banners...</div>
      ) : (
        <DataTable columns={columns} data={banners} emptyText="Nenhum banner cadastrado." />
      )}

      <ConfirmModal
        open={Boolean(selectedBanner)}
        title="Excluir banner"
        message={`Deseja remover "${selectedBanner?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setSelectedBanner(null)}
      />
    </section>
  )
}
