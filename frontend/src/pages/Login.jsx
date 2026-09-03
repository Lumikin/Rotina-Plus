import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [executar, setExecutar] = useState(false);

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
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-sm border-0"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <div className="card-body p-4 p-md-5">

          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-info mb-1">
              Rotina Plus
            </h1>

            <p className="text-muted mb-0">
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
                className="form-control"
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
                className="form-control"
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