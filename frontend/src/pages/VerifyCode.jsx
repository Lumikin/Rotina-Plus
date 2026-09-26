import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVerifyCode } from "../hooks/useVerifyCode";
import Navbar from "../components/Navbar";

export default function VerifyCode() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const navigate = useNavigate();

  const {
    verify,
    resend,
    loading,
    resending,
    error,
    success,
  } = useVerifyCode();

  async function handleSolicitarCodigo(e) {
    e.preventDefault();
    const result = await resend(email.trim());
    if (result.success) {
      setEtapa(2);
    }
  }

  async function handleValidarCodigo(e) {
    e.preventDefault();
    const result = await verify(email.trim(), codigo.trim());
    if (result.success) {
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    }
  }

  return (
    <div
      className={`min-vh-100 d-flex flex-column ${
        temaEscuro ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      {/* Navbar Oficial */}
      <Navbar temaEscuro={temaEscuro} toggleTema={() => setTemaEscuro(!temaEscuro)} />

      {/* Conteúdo Centralizado */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3">
        <div
          className={`card shadow-sm border-0 ${
            temaEscuro ? "bg-secondary text-white" : "bg-white text-dark"
          }`}
          style={{ maxWidth: "420px", width: "100%" }}
        >
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold text-info mb-1">Rotina Plus</h1>
              <p className={temaEscuro ? "text-light mb-0" : "text-muted mb-0"}>
                {etapa === 1 ? "Solicitar código de verificação" : "Verificar código"}
              </p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {etapa === 1 ? (
              <form onSubmit={handleSolicitarCodigo}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    E-mail
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
                    disabled={resending}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3 mb-3"
                  disabled={resending}
                >
                  {resending ? "Enviando..." : "Enviar código"}
                </button>

                <p className="text-center mb-0 small">
                  Lembrou a senha?{" "}
                  <Link to="/login" className="text-info text-decoration-none fw-semibold">
                    Voltar ao Login
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleValidarCodigo}>
                <div className="alert alert-info small text-center mb-3">
                  Enviamos um código para: <br />
                  <strong>{email}</strong>
                </div>

                <div className="mb-3">
                  <label htmlFor="codigo" className="form-label">
                    Código recebido por e-mail
                  </label>
                  <input
                    id="codigo"
                    required
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    type="text"
                    maxLength="6"
                    className={`form-control text-center fw-bold ${
                      temaEscuro ? "bg-dark text-white border-secondary" : ""
                    }`}
                    placeholder="Digite o código de 6 dígitos"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3 mb-2"
                  disabled={loading}
                >
                  {loading ? "Verificando..." : "Verificar código"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-info w-100 btn-sm fw-semibold mb-2"
                  onClick={() => resend(email.trim())}
                  disabled={loading || resending}
                >
                  {resending ? "Reenviando..." : "Reenviar código"}
                </button>

                <button
                  type="button"
                  className={`btn btn-link w-100 btn-sm text-decoration-none ${
                    temaEscuro ? "text-light" : "text-muted"
                  }`}
                  onClick={() => setEtapa(1)}
                  disabled={loading || resending}
                >
                  Alterar e-mail
                </button>

                <p className="text-center mb-0 small mt-2">
                  Código verificado?{" "}
                  <Link to="/login" className="text-info text-decoration-none fw-semibold">
                    Voltar ao Login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
