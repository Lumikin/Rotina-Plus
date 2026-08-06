import connection from "../../api/connection.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function fazerLogin() {
    try {
      if (!email || !senha) {
        setError("Preencha todos os campos");
        return;
      }
      const login = await connection.login(email, senha);
      setError("");
      setSucesso(login.message);
      console.log(login.message);
      localStorage.setItem('token', login.token)
    } catch (error) {
      setSucesso("");
      if (error.response) {
        console.log(error.response.data.message);
        setError(error.response.data.message);
      } else {
        setError("Erro de conexão");
      }
    }
  }

  return (
    <>
      <button onClick={() => navigate("/")}>Voltar</button>{" "}
      {/** Voltar para a pagina inicial "/" */}
      <button onClick={() => navigate("/cadastro")}>Cadastrar</button>{" "}
      {/** ir para a página de Cadastro "/cadastro" */}
      <h1> Login </h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type={mostrarSenha ? "text" : "password"}
        placeholder="senha"
        value={senha}
        onChange={(s) => setSenha(s.target.value)}
        required
      />
      <button onClick={() => setMostrarSenha(!mostrarSenha)}>
        {mostrarSenha ? "Ocultar Senha" : "Mostrar Senha"}
      </button>
      <button onClick={fazerLogin}> Login </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
    </>
  );
}

export default Login;
