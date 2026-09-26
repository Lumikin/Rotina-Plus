import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login, loading, error, success } = useLogin();
  const [temaEscuro, setTemaEscuro] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await login(email.trim(), senha);

    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div
      className={`min-vh-100 d-flex flex-column ${
        temaEscuro ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      {/* Navbar com Logo e botões Entrar e Cadastrar */}
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
                  disabled={loading}
                />
              </div>

              <div className="mb-2">
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
                  placeholder="Digite sua senha"
                  disabled={loading}
                />
              </div>

              <div className="d-flex justify-content-end mb-4">
                <Link
                  to="/verify-code"
                  className={`small text-decoration-none ${
                    temaEscuro ? "text-info" : "text-primary"
                  }`}
                >
                  Esqueci minha senha
                </Link>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <button
                type="submit"
                className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3 mb-3"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <p className="text-center mb-0 small">
                Ainda não tem uma conta?{" "}
                <Link to="/register" className="text-info text-decoration-none fw-semibold">
                  Cadastre-se
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
