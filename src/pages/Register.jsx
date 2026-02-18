import { useState } from "react";
import { api } from "../service/api";
import "./register.css";

export function Register() {
  const [role, setRole] = useState("comprador");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "empresa") {
        await api.post("/auth/register/empresa", {
          nome: form.name,
          email: form.email,
          senha: form.password,
          nomeEmpresa: form.companyName,
          cnpj: form.cnpj,
        });
      }

      if (role === "comprador") {
        await api.post("/auth/register/comprador", {
          nome: form.name,
          email: form.email,
          senha: form.password,
          cpf: form.cpf,
        });
      }

      alert("Cadastro realizado com sucesso!");
      window.location.href = "/login";
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
        <p className="subtitle">Plantei Marketplace</p>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="comprador">Comprador</option>
          <option value="empresa">Empresa</option>
        </select>

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

          {role === "empresa" && (
            <>
              <input
                name="companyName"
                placeholder="Nome da empresa"
                onChange={handleChange}
                required
              />
              <input
                name="cnpj"
                placeholder="CNPJ"
                onChange={handleChange}
                required
              />
            </>
          )}

          {role === "comprador" && (
            <input
              name="cpf"
              placeholder="CPF"
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
