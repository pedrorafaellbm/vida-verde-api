import { useState } from 'react'
import { getApiErrorMessage, sendContactRequest } from '../service/api'

export const Contato = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await sendContactRequest({ nome, email, mensagem })
      setSuccessMessage('Mensagem enviada com sucesso.')
      setNome('')
      setEmail('')
      setMensagem('')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel enviar sua mensagem.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fale Conosco</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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

        {successMessage ? <p style={{ marginTop: 0, marginBottom: '12px', color: '#0f8a3b' }}>{successMessage}</p> : null}
        {errorMessage ? <p style={{ marginTop: 0, marginBottom: '12px', color: '#b00020' }}>{errorMessage}</p> : null}

        <button type="submit" disabled={isSubmitting} style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
