import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../service/api";
import { useAuth } from "../context/AuthContext";
import { useI18n } from '../context/LocaleContext'
import "./login.css";

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { t } = useI18n()

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn({ email, senha });
      navigate("/inicio");
    } catch (err) {
      setError(getApiErrorMessage(err, t('auth.invalidCredentials')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>greenstore</h1>
        <div className="subtitle">{t('auth.buyerAccess')}</div>
        <div>
          <label>{t('auth.email')}</label>
          <input type="email" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>{t('auth.password')}</label>
          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} style={{ paddingRight: "2.5rem" }} />
            <span onClick={togglePassword} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#1da145", fontSize: "1.2rem" }}>
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>
        </div>
        <button onClick={login} disabled={loading}>{loading ? t('auth.loggingIn') : t('auth.login')}</button>
        {error && <div className="text-danger text-center mt-2">{error}</div>}
        <div className="footer-text mt-3">{t('auth.noAccount')} <a href="/register">{t('auth.signUp')}</a></div>
      </div>
    </div>
  );
};
