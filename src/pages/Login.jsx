import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

export const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const login = async () => {
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao realizar login')
      }

      // 🔐 Salvar dados no localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      // 🚀 Redirecionar para Home
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Email ou senha inválidos')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🌱 Vida Verde</h1>
        <div className="subtitle">Acesso do usuário</div>

        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Senha</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{ paddingRight: '2.5rem' }}
            />
            <span
              onClick={togglePassword}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#1da145',
                fontSize: '1.2rem'
              }}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </span>
          </div>
        </div>

        <button onClick={login}>
          Entrar
        </button>

        {error && (
          <div className="text-danger text-center mt-2">
            {error}
          </div>
        )}
        <div className="footer-text mt-3">
          Não tem conta? <a href="/register">Cadastre-se</a>
        </div>
      </div>
    </div>
  )
}