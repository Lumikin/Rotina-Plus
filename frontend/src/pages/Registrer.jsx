import { useEffect, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useVerifyCode } from "../hooks/useVerifyCode";

export default function Registrer() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [dataN, setDataN] = useState("");
  const [codigo, setCodigo] = useState("");
  const [etapa, setEtapa] = useState(1); // 1: Formulário | 2: Inserir Código
  const [executarRegister, setExecutarRegister] = useState(false);
  const [executarVerify, setExecutarVerify] = useState(false);

  // false = Claro | true = Escuro
  const [temaEscuro, setTemaEscuro] = useState(false);

  const { loading: loadingRegister, error: errorRegister, success: successRegister } = useRegister(
    nome,
    email,
    senha,
    dataN,
    executarRegister
  );

  const { loading: loadingVerify, error: errorVerify, success: successVerify } = useVerifyCode(
    email,
    codigo,
    executarVerify
  );

  // Quando o registro for bem-sucedido, vai para a etapa 2
  useEffect(() => {
    if (successRegister) {
      setEtapa(2);
      setExecutarRegister(false);
    }
  }, [successRegister]);

  // Quando a verificação for bem-sucedida, redireciona
  useEffect(() => {
    if (successVerify) {
      alert("Email verificado com sucesso! Redirecionando...");
      window.location.href = "/login";
    }
  }, [successVerify]);

  // Passo 1: Envia os dados e libera o campo de código
  function handleEnviarDados(e) {
    e.preventDefault();
    setExecutarRegister(false);
    setTimeout(() => {
      setExecutarRegister(true);
    }, 0);
  }

  // Passo 2: Valida o código recebido por e-mail
  function handleValidarCodigo(e) {
    e.preventDefault();
    setExecutarVerify(false);
    setTimeout(() => {
      setExecutarVerify(true);
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
        style={{ maxWidth: "420px", width: "100%", borderRadius: "12px" }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Botão de Alternância de Tema */}
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
            <h1 className="h3 fw-bold text-info mb-1">Rotina Plus</h1>
            <p className={temaEscuro ? "text-light mb-0" : "text-muted mb-0"}>
              {etapa === 1 ? "Crie sua conta para começar" : "Verificação de E-mail"}
            </p>
          </div>

          {etapa === 1 ? (
            /* campo de registro */
            <form onSubmit={handleEnviarDados}>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label fw-semibold">
                  Nome de usuário
                </label>
                <input
                  id="nome"
                  required
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  type="text"
                  placeholder="User"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={loadingRegister}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="dataN" className="form-label fw-semibold">
                  Data de nascimento
                </label>
                <input
                  required
                  id="dataN"
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  type="date"
                  value={dataN}
                  onChange={(e) => setDataN(e.target.value)}
                  disabled={loadingRegister}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>
                <input
                  id="email"
                  required
                  type="email"
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loadingRegister}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="senha" className="form-label fw-semibold">
                  Senha
                </label>
                <input
                  id="senha"
                  required
                  type="password"
                  className={`form-control ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  placeholder="Digite uma senha segura"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loadingRegister}
                />
              </div>

              {errorRegister && (
                <div className="alert alert-danger mb-3">
                  {errorRegister}
                </div>
              )}

              {successRegister && (
                <div className="alert alert-success mb-3">
                  {successRegister}
                </div>
              )} 

              <button
                type="submit"
                className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3"
                disabled={loadingRegister}
              >
                {loadingRegister ? "Enviando..." : "Enviar Código por E-mail"}
              </button>
            </form>
          ) : (
            /* codigo de verificação */
            <form onSubmit={handleValidarCodigo}>
              <div className="alert alert-info small text-center mb-3">
                Enviamos um código de verificação para o e-mail: <br />
                <strong>{email}</strong>
              </div>

              <div className="mb-4">
                <label htmlFor="codigo" className="form-label fw-bold">
                  Código de Verificação
                </label>
                <input
                  id="codigo"
                  required
                  className={`form-control text-center fw-bold fs-5 ${
                    temaEscuro ? "bg-dark text-white border-secondary" : ""
                  }`}
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  disabled={loadingVerify}
                />
              </div>

              {errorVerify && (
                <div className="alert alert-danger mb-3">
                  {errorVerify}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3 mb-2"
                disabled={loadingVerify}
              >
                {loadingVerify ? "Verificando..." : "Confirmar Código"}
              </button>

              <button
                type="button"
                className={`btn btn-link w-100 btn-sm text-decoration-none ${
                  temaEscuro ? "text-light" : "text-muted"
                }`}
                onClick={() => setEtapa(1)}
                disabled={loadingVerify}
              >
                Voltar e alterar e-mail
              </button>
            </form>
          )}

          <p className="text-center mt-4 mb-0 small">
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