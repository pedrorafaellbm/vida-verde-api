export function ConfirmModal({
  open,
  title = 'Confirmar acao',
  message = 'Tem certeza?',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="admin-modal-overlay" role="presentation">
      <div className="admin-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
