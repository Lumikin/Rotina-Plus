import { loginUser } from "../services/authService";
import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function Enviar(email, senha) {
    const response = await loginUser(email, senha);     
    return response;
  }
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-sm border-0"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <div className="card-body p-4 p-md-5">
          <div classNa. me="text-center mb-4">
            <h1 className="h3 fw-bold text-info mb-1">Rotina Plus</h1>
            <p className="text-muted mb-0">Faça login para continuar</p>
          </div>

          <form onSubmit={"#"} noValidate>
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
              />
            </div>

            <button
              type="submit"
              className="btn btn-info text-white w-100 fw-semibold py-2 rounded-3"
              onClick={() => Enviar}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
