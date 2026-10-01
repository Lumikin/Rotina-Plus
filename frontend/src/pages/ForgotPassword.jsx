import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await forgotPassword(email.trim());

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-vh-100 d-flex flex-column ${
        temaEscuro ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <Navbar temaEscuro={temaEscuro} toggleTema={() => setTemaEscuro(!temaEscuro)} />

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
                Recuperar senha
              </p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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
                  disabled={loading}
                />
                <div className="form-text">Enviaremos um botão para você escolher uma nova senha.</div>
              </div>

              <button
                type="submit"
                className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3 mb-3"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </button>

              <p className="text-center mb-0 small">
                Lembrou a senha?{" "}
                <Link to="/login" className="text-info text-decoration-none fw-semibold">
                  Voltar ao Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}