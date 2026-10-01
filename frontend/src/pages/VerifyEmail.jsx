import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmailToken } from "../services/authService";
import Navbar from "../components/Navbar";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(() => (token ? "loading" : "error"));
  const [message, setMessage] = useState(() =>
    token ? "" : "Link de verificação inválido.",
  );
  const [temaEscuro, setTemaEscuro] = useState(false);
  const jaTentou = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || jaTentou.current) return;
    jaTentou.current = true;

    verifyEmailToken(token).then((result) => {
      if (result.success) {
        setStatus("success");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    });
  }, [token, navigate]);

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
          className={`card shadow-sm border-0 text-center ${
            temaEscuro ? "bg-secondary text-white" : "bg-white text-dark"
          }`}
          style={{ maxWidth: "420px", width: "100%" }}
        >
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold text-info mb-1">Rotina Plus</h1>
              <p className={temaEscuro ? "text-light mb-0" : "text-muted mb-0"}>
                Verificação de e-mail
              </p>
            </div>

            {status === "loading" && (
              <>
                <div className="spinner-border text-info mb-3" role="status">
                  <span className="visually-hidden">Carregando</span>
                </div>
                <p className={temaEscuro ? "text-light mb-0" : "text-muted mb-0"}>
                  Verificando sua conta...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="display-6 mb-3" role="status">
                  &#9989;
                </div>
                <h2 className="h5 fw-bold mb-2">Conta verificada!</h2>
                <p className={temaEscuro ? "text-light mb-0" : "text-muted mb-0"}>
                  Você já pode fazer login. Redirecionando...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="display-6 mb-3" role="alert">
                  &#128308;
                </div>
                <h2 className="h5 fw-bold mb-2">Não foi possível verificar</h2>
                <p className={temaEscuro ? "text-light mb-4" : "text-muted mb-4"}>{message}</p>
                <Link
                  to="/register"
                  className="btn btn-info text-white fw-semibold py-2 rounded-3"
                >
                  Criar conta novamente
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}