import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../service/api";
import "./register.css";

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", {
        nome: form.name,
        email: form.email,
        senha: form.password,
        cpf: form.cpf,
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Crie sua conta</h1>
        <p className="subtitle">Cadastro de comprador</p>


        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Nome completo"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            onChange={handleChange}
            required
          />

          <input
            name="cpf"
            placeholder="CPF"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="footer-text">
          Ja tem conta? <a href="/login">Entrar</a>
        </div>
      </div>
    </div>
  );
}
