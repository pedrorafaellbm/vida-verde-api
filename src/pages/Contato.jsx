import React, { useState } from "react";

export const Contato = () => {
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, assunto });
    alert("Mensagem enviada (front-end)");
    setEmail("");
    setAssunto("");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Fale Conosco</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",          // ocupa toda a largura
              minHeight: "48px",      // mantém a altura original
              fontSize: "1.1rem",
              padding: "12px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Assunto
          </label>
          <input
            type="text"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            required
            style={{
              width: "100%",
              minHeight: "48px",
              fontSize: "1.1rem",
              padding: "12px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: "14px 28px", fontSize: "1.1rem" }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};