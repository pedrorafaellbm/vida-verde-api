import { useState } from 'react'
import { api } from '../service/api'

const extractErrorMessage = (error) => {
  return error?.response?.data?.error || error?.response?.data?.mensagem || 'Nao foi possivel enviar sua mensagem.'
}

export const Contato = () => {
  const [email, setEmail] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage('')
    setIsSubmitting(true)

    try {
      const preferredEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/contato'
      const fallbackEndpoint = preferredEndpoint === '/contato' ? '/contact' : '/contato'
      const payload = { email, assunto, mensagem }

      try {
        await api.post(preferredEndpoint, payload)
      } catch (firstError) {
        const status = firstError?.response?.status
        if (status === 404 || status === 405) {
          await api.post(fallbackEndpoint, payload)
        } else {
          throw firstError
        }
      }

      setStatusMessage('Mensagem enviada com sucesso.')
      setEmail('')
      setAssunto('')
      setMensagem('')
    } catch (error) {
      setStatusMessage(extractErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fale Conosco</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              minHeight: '48px',
              fontSize: '1.1rem',
              padding: '12px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Assunto</label>
          <input
            type="text"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            required
            style={{
              width: '100%',
              minHeight: '48px',
              fontSize: '1.1rem',
              padding: '12px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Mensagem</label>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            required
            rows={5}
            style={{
              width: '100%',
              fontSize: '1.05rem',
              padding: '12px',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        {statusMessage ? <p style={{ marginTop: 0, marginBottom: '12px' }}>{statusMessage}</p> : null}

        <button type="submit" disabled={isSubmitting} style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
