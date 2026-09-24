import { useState } from "react";
import Navbar from "../components/Navbar";

export default function VerifyCode() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setSenha] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMensagem("Senha redefinida com sucesso!");
    }, 1000);
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
                Recuperação de Senha
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Campo de E-mail Adicionado */}
              <div className="mb-3">
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
                />
              </div>

              {/* Campo do Código */}
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
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  placeholder="Digite o código de 6 dígitos"
                />
              </div>

              {/* Campo da Nova Senha */}
              <div className="mb-4">
                <label htmlFor="novaSenha" className="form-label">
                  Nova Senha
                </label>
                <input
                  id="novaSenha"
                  required
                  value={novaSenha}
                  onChange={e => setSenha(e.target.value)}
                  type="password"
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  placeholder="Digite sua nova senha"
                />
              </div>

              {mensagem && <div className="alert alert-success">{mensagem}</div>}

              <button
                type="submit"
                className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3 mb-3"
                disabled={loading}
              >
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </button>

              <p className="text-center mb-0 small">
                Lembrou a senha?{" "}
                <a href="/login" className="text-info text-decoration-none fw-semibold">
                  Voltar ao Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}