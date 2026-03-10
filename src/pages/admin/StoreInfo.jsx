import { useEffect, useState } from 'react'
import { useI18n } from '../../context/LocaleContext'
import {
  createStoreInfoCard,
  deleteStoreInfoCard,
  getErrorMessage,
  getStoreInfo,
  listStoreInfoCards,
  updateStoreInfo,
  updateStoreInfoCard,
} from '../../service/adminApi'

const defaultForm = { title: 'Sobre a Loja', description: '', mission: '', quality: '', delivery: '' }
const defaultCardForm = { title: '', body: '', position: 0 }

export default function StoreInfo() {
  const { t } = useI18n()
  const [form, setForm] = useState(defaultForm)
  const [cards, setCards] = useState([])
  const [cardForm, setCardForm] = useState(defaultCardForm)
  const [editingCard, setEditingCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cardLoading, setCardLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [cardError, setCardError] = useState('')

  useEffect(() => {
    const loadInfo = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getStoreInfo()
        setForm({ ...defaultForm, ...(data || {}) })
        if (data?.cards) setCards(data.cards)
      } catch (err) {
        setError(getErrorMessage(err, t('admin.storeInfoError')))
      } finally {
        setLoading(false)
      }
    }

    const loadCards = async () => {
      setCardLoading(true)
      try {
        const data = await listStoreInfoCards()
        setCards(data)
      } catch (err) {
        setCardError(getErrorMessage(err, t('admin.cardsError')))
      } finally {
        setCardLoading(false)
      }
    }

    loadInfo()
    loadCards()
  }, [t])

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const handleCardChange = (field, value) => setCardForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await updateStoreInfo(form)
      setMessage(t('admin.storeInfoSaved'))
    } catch (err) {
      setError(getErrorMessage(err, t('admin.saveStoreInfoError')))
    } finally {
      setSaving(false)
    }
  }

  const resetCardForm = () => {
    setCardForm(defaultCardForm)
    setEditingCard(null)
    setCardError('')
  }

  const handleCardSubmit = async (event) => {
    event.preventDefault()
    setCardError('')
    try {
      if (editingCard) {
        await updateStoreInfoCard(editingCard.id, cardForm)
      } else {
        await createStoreInfoCard(cardForm)
      }
      const next = await listStoreInfoCards()
      setCards(next)
      resetCardForm()
      setMessage(t('admin.cardSaved'))
    } catch (err) {
      setCardError(getErrorMessage(err, t('admin.saveCard')))
    }
  }

  const handleEditCard = (card) => {
    setEditingCard(card)
    setCardForm({ title: card.title, body: card.body, position: card.position })
    setCardError('')
  }

  const handleRemoveCard = async (card) => {
    setCardError('')
    try {
      await deleteStoreInfoCard(card.id)
      setCards((prev) => prev.filter((item) => item.id !== card.id))
    } catch (err) {
      setCardError(getErrorMessage(err, t('admin.deleteCard')))
    }
  }

  return (
    <section>
      <div className="admin-section-header">
        <h2>{t('admin.storeInfo')}</h2>
        <p>{t('admin.storeInfoHint')}</p>
      </div>

      {loading ? (
        <div className="admin-empty">{t('admin.loadingContent')}</div>
      ) : (
        <form className="admin-form admin-form-stacked" onSubmit={handleSubmit}>
          <input value={form.title} onChange={(event) => handleChange('title', event.target.value)} placeholder={t('admin.titlePlaceholder')} required />
          <textarea value={form.description} onChange={(event) => handleChange('description', event.target.value)} placeholder={t('admin.mainDescriptionPlaceholder')} rows={4} />
          <textarea value={form.mission} onChange={(event) => handleChange('mission', event.target.value)} placeholder={t('admin.missionPlaceholder')} rows={3} />
          <textarea value={form.quality} onChange={(event) => handleChange('quality', event.target.value)} placeholder={t('admin.qualityPlaceholder')} rows={3} />
          <textarea value={form.delivery} onChange={(event) => handleChange('delivery', event.target.value)} placeholder={t('admin.deliveryPlaceholder')} rows={3} />
          <button type="submit" className="btn" disabled={saving}>
            {saving ? t('admin.saveBannerLoading') : t('admin.saveContent')}
          </button>
        </form>
      )}

      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-success">{message}</p> : null}

      <div className="admin-section-header" style={{ marginTop: '2rem' }}>
        <h3>{t('admin.cardsTitle')}</h3>
        <p>{t('admin.cardsTitle')}</p>
      </div>

      <form className="admin-form admin-form-stacked" onSubmit={handleCardSubmit}>
        <input value={cardForm.title} onChange={(event) => handleCardChange('title', event.target.value)} placeholder={t('admin.cardTitleLabel')} required />
        <textarea
          value={cardForm.body}
          onChange={(event) => handleCardChange('body', event.target.value)}
          placeholder={t('admin.cardBodyLabel')}
          rows={3}
          required
        />
        <input
          type="number"
          min="0"
          value={cardForm.position}
          onChange={(event) => handleCardChange('position', Number(event.target.value))}
          placeholder={t('admin.cardPositionLabel')}
        />
        <button type="submit" className="btn">
          {editingCard ? t('admin.editCard') : t('admin.addCard')}
        </button>
        {editingCard ? (
          <button type="button" className="btn btn-secondary" onClick={resetCardForm}>
            {t('common.cancel')}
          </button>
        ) : null}
      </form>

      {cardError ? <p className="admin-error">{cardError}</p> : null}

      {cardLoading ? (
        <div className="admin-empty">{t('admin.loadingContent')}</div>
      ) : cards.length ? (
        <div className="admin-card-grid">
          {cards.map((card) => (
            <article key={card.id} className="admin-card">
              <h4>{card.title}</h4>
              <p>{card.body}</p>
              <p className="admin-card-position">
                {t('admin.cardPositionLabel')}: {card.position}
              </p>
              <div className="admin-card-actions">
                <button type="button" className="btn btn-secondary" onClick={() => handleEditCard(card)}>
                  {t('admin.editCard')}
                </button>
                <button type="button" className="btn" onClick={() => handleRemoveCard(card)}>
                  {t('admin.deleteCard')}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty">{t('admin.noBanners')}</p>
      )}
    </section>
  )
}
