import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../service/api";
import { useI18n } from '../context/LocaleContext'
import "./register.css";

export function Register() {
  const navigate = useNavigate();
  const { t } = useI18n()
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", { nome: form.name, email: form.email, senha: form.password, cpf: form.cpf });
      alert(t('auth.registerSuccess'));
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>{t('auth.registerTitle')}</h1>
        <p className="subtitle">{t('auth.registerSubtitle')}</p>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder={t('auth.fullName')} onChange={handleChange} required />
          <input name="email" type="email" placeholder={t('auth.email')} onChange={handleChange} required />
          <input name="password" type="password" placeholder={t('auth.password')} onChange={handleChange} required />
          <input name="cpf" placeholder={t('auth.cpf')} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? t('auth.registering') : t('auth.register')}</button>
        </form>
        <div className="footer-text">{t('auth.alreadyAccount')} <a href="/login">{t('auth.login')}</a></div>
      </div>
    </div>
  );
}
