import { useEffect, useState } from "react";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [executar, setExecutar] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);

  const { loading, error, success } = useLogin(
    email,
    senha,
    executar
  );

  function handleSubmit(e) {
    e.preventDefault();

    setExecutar(false);

    setTimeout(() => {
      setExecutar(true);
    }, 0);
  }

  return (
    <div
      className={`d-flex align-items-center justify-content-center min-vh-100 ${
        temaEscuro ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div
        className={`card shadow-sm border-0 ${
          temaEscuro ? "bg-secondary text-white" : "bg-white text-dark"
        }`}
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Botão para alternar o Tema */}
          <div className="d-flex justify-content-end mb-2">
            <button
              type="button"
              className={`btn btn-sm ${
                temaEscuro ? "btn-outline-light" : "btn-outline-dark"
              }`}
              onClick={() => setTemaEscuro(!temaEscuro)}
            >
              {temaEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
            </button>
          </div>

          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-info mb-1">
              Rotina Plus
            </h1>

            <p className={temaEscuro ? "text-light mb-0" : "text-muted mb-0"}>
              Faça login para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>

              <input
                id="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className={`form-control ${
                  temaEscuro ? "bg-dark text-white border-secondary" : ""
                }`}
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>

              <input
                id="senha"
                required
                value={senha}
                onChange={e => setSenha(e.target.value)}
                type="password"
                className={`form-control ${
                  temaEscuro ? "bg-dark text-white border-secondary" : ""
                }`}
                placeholder="Digite uma senha"
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}