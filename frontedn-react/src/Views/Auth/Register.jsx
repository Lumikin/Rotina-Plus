import connection from "../../api/connection.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [data, setData] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [error, setError] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function fazerCadastro() {
    try {
      console.log("Campos:", { nome, email, senha, data });
      if (!nome || !email || !senha || !data) {
        setError("Preencha todos os campos");
        return;
      }
      const cadastro = await connection.cadastro(nome, email, senha, data);
      console.log("Sucesso:", cadastro.data.message);
      setError("");
      setSucesso(cadastro.data.message);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log("Erro 400:", error.response.data.message);
          setSucesso("");
          setError(error.response.data.message);
        } else {
          console.log("Outro erro:", error.response.status);
        }
      } else {
        console.log("Erro de conexão");
      }
    }
  }

  return (
    <>
      <button onClick={() => navigate("/")}>Voltar</button>{" "}
      {/** Voltar para a pagina inicial "/" */}
      <button onClick={() => navigate("/login")}>Login</button>{" "}
      {/** Voltar para a pagina inicial "/" */}
      <h1> Cadastro </h1>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(n) => setNome(n.target.value)}
        required
      />
      <input
        type={
          /** Muda o tipo do campo caso seja true ou false */
          mostrarSenha ? "text" : "password"
        }
        placeholder="senha"
        value={senha}
        onChange={(s) => setSenha(s.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="date"
        value={data}
        onChange={(d) => setData(d.target.value)}
        required
      />
      <button onClick={() => setMostrarSenha(!mostrarSenha)}>
        {/** Muda o mostrarSenha para true */}
        {mostrarSenha ? "Ocultar Senha" : "Mostrar Senha"}
      </button>
      <button onClick={fazerCadastro}>Enviar</button>
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default Cadastro;
