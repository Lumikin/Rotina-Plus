import { useState } from "react";
import ModalVerificacao from "../components/ModalVerificacao";

export function Registrar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [dataN, setDataN] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const handleEnviar = (e) => {
    e.preventDefault();
    setModalAberto(true);
  };

  const handleConfirmarCodigo = (codigo) => {
    console.log("Código inserido:", codigo);
    setModalAberto(false);
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100" 
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div
        className="card shadow border-0"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "16px" }}
      >
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1" style={{ color: "#0bc2d7" }}>
              Rotina Plus
            </h1>
            <p style={{ color: "#475569" }} className="mb-0">
              Crie sua conta para começar
            </p>
          </div>

          <form onSubmit={handleEnviar}>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ color: "#0F172A" }}>
                Nome de usuário
              </label>
              <input
                id="nome"
                required
                className="form-control"
                type="text"
                placeholder="User"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ color: "#0F172A" }}>
                Data de nascimento
              </label>
              <input
                required
                id="dataN"
                className="form-control"
                type="date"
                value={dataN}
                onChange={(e) => setDataN(e.target.value)}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ color: "#0F172A" }}>
                Email
              </label>
              <input
                id="email"
                required
                type="email"
                className="form-control"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-bold" style={{ color: "#0F172A" }}>
                Senha
              </label>
              <input
                id="senha"
                required
                type="password"
                className="form-control"
                placeholder="Digite uma senha segura"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold py-2 shadow-sm"
              style={{
                backgroundColor: "#0bc2d7",
                borderColor: "#0bc2d7",
                color: "#17264a",
                borderRadius: "8px",
              }}
            >
              Registrar
            </button>
          </form>

          <p className="text-center mt-4 mb-0 small" style={{ color: "#475569" }}>
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-decoration-none fw-bold"
              style={{ color: "#26b9ca" }}
            >
              Entrar
            </a>
          </p>
        </div>
      </div>

      <ModalVerificacao
        visible={modalAberto}
        email={email}
        onClose={() => setModalAberto(false)}
        onConfirm={handleConfirmarCodigo}
      />
    </div>
  );
}