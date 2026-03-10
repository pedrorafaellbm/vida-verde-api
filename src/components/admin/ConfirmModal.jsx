import { useI18n } from '../../context/LocaleContext'

export function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  const { t } = useI18n()
  if (!open) return null

  return (
    <div className="admin-modal-overlay" role="presentation">
      <div className="admin-modal">
        <h3>{title || t('common.confirm')}</h3>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>{t('common.cancel')}</button>
          <button type="button" className="btn" onClick={onConfirm}>{t('common.confirm')}</button>
        </div>
      </div>
    </div>
  )
}
