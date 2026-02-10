import { useState } from "react";
import { RoleSelect } from "../components/RoleSelect";
import { api } from "../service/api";
import './register.css'

export function Register() {
  const [role, setRole] = useState('comprador')
  const [form, setForm] = useState({})

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (role === 'admin') return

    try {
      await api.post('/auth/register', { ...form, role })
      alert('Cadastro realizado com sucesso!')
    } catch {
      alert('Erro ao cadastrar')
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Crie sua conta</h1>
        <p className="subtitle">Plantei Marketplace</p>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="comprador">Comprador</option>
          <option value="empresa">Empresa</option>
        </select>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nome completo" onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Senha" onChange={handleChange} />

          {role === 'empresa' && (
            <>
              <input name="companyName" placeholder="Nome da empresa" onChange={handleChange} />
              <input name="cnpj" placeholder="CNPJ" onChange={handleChange} />
            </>
          )}

          {role === 'comprador' && (
            <input name="cpf" placeholder="CPF" onChange={handleChange} />
          )}

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  )
}