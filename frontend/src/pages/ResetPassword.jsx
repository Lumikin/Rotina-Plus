import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (novaSenha !== confirmarSenha) {
      setError("A nova senha e a confirmação não são iguais.");
      return;
    }

    if (novaSenha.length < 4) {
      setError("A nova senha deve ter no minimo 4 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({
        token,
        novaSenha,
        confirmarSenha,
      });

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div
        className={`min-vh-100 d-flex flex-column ${
          temaEscuro ? "bg-dark text-white" : "bg-light text-dark"
        }`}
      >
        <Navbar temaEscuro={temaEscuro} toggleTema={() => setTemaEscuro(!temaEscuro)} />

        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3">
          <div
            className={`card shadow-sm border-0 text-center ${
              temaEscuro ? "bg-secondary text-white" : "bg-white text-dark"
            }`}
            style={{ maxWidth: "420px", width: "100%" }}
          >
            <div className="card-body p-4 p-md-5">
              <div className="display-6 mb-3" role="alert">
                &#128308;
              </div>
              <h1 className="h5 fw-bold mb-2">Link inválido</h1>
              <p className={temaEscuro ? "text-light mb-4" : "text-muted mb-4"}>
               Link de redefinição inválido. Solicite um novo.
              </p>
              <Link
                to="/esqueci-senha"
                className="btn btn-info text-white fw-semibold py-2 rounded-3"
              >
                Solicitar novo link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
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
                Escolha uma nova senha
              </p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="novaSenha" className="form-label">
                  Nova senha
                </label>
                <input
                  id="novaSenha"
                  required
                  minLength={4}
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  type="password"
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  placeholder="Digite a nova senha"
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirmarSenha" className="form-label">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmarSenha"
                  required
                  minLength={4}
                  value={confirmarSenha}
                  onChange={e => setConfirmarSenha(e.target.value)}
                  type="password"
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  placeholder="Repita a nova senha"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3 mb-3"
                disabled={loading}
              >
                {loading ? "Alterando..." : "Alterar senha"}
              </button>

              <p className="text-center mb-0 small">
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