import { useState } from "react";
import { useRegister } from "../hooks/useRegister";

export function Registrar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [dataN, setDataN] = useState("");
  const [executar, setExecutar] = useState(false);

  const { loading, error, success } = useRegister(
    nome,
    email,
    senha,
    dataN,
    executar
  );

  function Enviar(e) {
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
              Crie sua conta para começar!
            </p>
          </div>

          <form onSubmit={Enviar}>

            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome de usuário
              </label>

              <input
                id="nome"
                required
                className="form-control"
                type="text"
                placeholder="User"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dataN" className="form-label">
                Data de nascimento
              </label>

              <input
                id="dataN"
                required
                className="form-control"
                type="date"
                value={dataN}
                onChange={e => setDataN(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>

              <input
                id="email"
                required
                type="email"
                className="form-control"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>

              <input
                id="senha"
                required
                type="password"
                className="form-control"
                placeholder="Digite uma senha segura"
                value={senha}
                onChange={e => setSenha(e.target.value)}
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
              className="btn btn-info text-white w-100 fw-semibold py-2"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>

          </form>

          <p className="text-center text-muted mt-4 mb-0 small">
            Já tem uma conta?{" "}

            <a
              href="/login"
              className="text-info text-decoration-none fw-semibold"
            >
              Entrar
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}

