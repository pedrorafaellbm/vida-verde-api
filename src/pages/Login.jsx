import { useState } from "react";
import { api } from "../service/api";
import './login.css'


export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      // exemplo esperado do back
      // { token, role }
      const { token, role } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)

      alert('Login realizado com sucesso!')

      // redirects futuros por role
      // admin -> /admin
      // empresa -> /dashboard
      // comprador -> /home
    } catch {
      alert('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Entrar</h1>
        <p className="subtitle">Acesse sua conta</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="footer-text">
          Não tem conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  )
}
