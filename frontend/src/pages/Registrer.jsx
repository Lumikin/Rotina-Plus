import { useState } from "react";
export function Registar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [dataN, setDataN] = useState("");

  return (
    <div className="container">
      <form onSubmit={"#"}>
        <input
          required
          className="form-control"
          type="text"
          placeholder="User"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <input
          required
          className="form-control"
          type="date"
          value={dataN}
          onChange={e => setDataN(e.target.value)}
        />
        <input
          required
          type="email"
          className="form-control"
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          className="form-control"
          value={senha}
          placeholder="SenhaSegura123@!"
          onChange={e => setSenha(e.target.value)}
        />

        <button type="submit" className="btn bg-info">
          Registrar
        </button>
      </form>
    </div>
  );
}
