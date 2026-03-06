import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../service/api";
import { useAuth } from "../context/AuthContext";
import "./login.css";

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

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
      await signIn({
        email,
        senha,
      });

      navigate("/home");
    } catch (err) {
      setError(getApiErrorMessage(err, "Email ou senha invalidos"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Vida Verde</h1>
        <div className="subtitle">Acesso do comprador</div>

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
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={togglePassword}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#1da145",
                fontSize: "1.2rem",
              }}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>
        </div>

        <button onClick={login} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <div className="text-danger text-center mt-2">{error}</div>}

        <div className="footer-text mt-3">
          Nao tem conta? <a href="/register">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
};
