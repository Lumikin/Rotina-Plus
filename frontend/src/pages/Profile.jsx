import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, KeyRound, TriangleAlert, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { logout, getUserId } from "../services/authService";
import {
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
  alterarSenha,
} from "../services/userService";
import { toInputDate } from "../utils/date";
import { useNomeUsuario } from "../hooks/useNomeUsuario";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [userId] = useState(getUserId);
  const [nomeUsuario, setNomeUsuario] = useNomeUsuario(userId);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ nome: "", email: "", dataNascimento: "" });
  const [salvando, setSalvando] = useState(false);
  const [msgDados, setMsgDados] = useState({ tipo: "", texto: "" });

  const [senhaForm, setSenhaForm] = useState({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
  const [trocando, setTrocando] = useState(false);
  const [msgSenha, setMsgSenha] = useState({ tipo: "", texto: "" });

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [msgExclusao, setMsgExclusao] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    async function carregar() {
      if (!userId) {
        setLoading(false);
        return;
      }
      const res = await buscarUsuario(userId);
      if (res.success && res.dados) {
        const d = Array.isArray(res.dados) ? res.dados[0] : res.dados;
        setForm({
          nome: d.nome ?? "",
          email: d.email ?? "",
          dataNascimento: toInputDate(d.dataNascimento),
        });
      } else {
        setMsgDados({ tipo: "erro", texto: res.message || "Não foi possível carregar os dados." });
      }
      setLoading(false);
    }
    carregar();
  }, [userId]);

  function sair() {
    logout();
    navigate("/login", { replace: true });
  }

  async function salvarDados(e) {
    e.preventDefault();
    setSalvando(true);
    setMsgDados({ tipo: "", texto: "" });
    const res = await atualizarUsuario(userId, {
      nome: form.nome.trim(),
      email: form.email.trim(),
    });
    setSalvando(false);
    if (res.success) {
      setMsgDados({ tipo: "ok", texto: res.message });
      setNomeUsuario(form.nome.trim());
    } else {
      setMsgDados({ tipo: "erro", texto: res.message });
    }
  }

  async function trocarSenha(e) {
    e.preventDefault();
    setTrocando(true);
    setMsgSenha({ tipo: "", texto: "" });
    const res = await alterarSenha(senhaForm);
    setTrocando(false);
    if (res.success) {
      setMsgSenha({ tipo: "ok", texto: res.message });
      setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    } else {
      setMsgSenha({ tipo: "erro", texto: res.message });
    }
  }

  async function excluirConta() {
    setExcluindo(true);
    setMsgExclusao({ tipo: "", texto: "" });
    const res = await deletarUsuario(userId);
    setExcluindo(false);
    if (res.success) {
      logout();
      navigate("/register", { replace: true });
    } else {
      setMsgExclusao({ tipo: "erro", texto: res.message });
    }
  }

  return (
    <>
      <Navbar nomeUsuario={nomeUsuario} onSair={sair} />
      <main className="profile-page">
        <section className="profile-shell">
          <header className="profile-header">
            <div>
              <h1>Gestão do usuário</h1>
              <p className="profile-subtitle">Veja e gerencie seus dados, senha e conta.</p>
            </div>
            <Link to="/dashboard" className="profile-back d-inline-flex align-items-center gap-1">
              <ArrowLeft size={16} aria-hidden="true" /> Voltar às tarefas
            </Link>
          </header>

          {loading && <div className="profile-state">Carregando dados...</div>}

          {!loading && !userId && (
            <div className="profile-error">Faça login para gerenciar sua conta.</div>
          )}

          {!loading && userId && (
            <>
              <section className="profile-card">
                <h2 className="d-flex align-items-center gap-2"><User size={20} aria-hidden="true" /> Meus dados</h2>
                <form onSubmit={salvarDados} className="profile-form">
                  <label>
                    Nome
                    <input
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      minLength={4}
                      maxLength={64}
                      required
                    />
                  </label>
                  <label>
                    E-mail
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Data de nascimento
                    <input type="date" value={form.dataNascimento} disabled title="Campo exibido apenas para consulta" />
                  </label>
                  {msgDados.texto && (
                    <div className={msgDados.tipo === "ok" ? "profile-ok" : "profile-error"}>
                      {msgDados.texto}
                    </div>
                  )}
                  <button type="submit" disabled={salvando}>
                    {salvando ? "Salvando..." : "Salvar alterações"}
                  </button>
                </form>
              </section>

              <section className="profile-card">
                <h2 className="d-flex align-items-center gap-2"><KeyRound size={20} aria-hidden="true" /> Alterar senha</h2>
                <form onSubmit={trocarSenha} className="profile-form">
                  <label>
                    Senha atual
                    <input
                      type="password"
                      value={senhaForm.senhaAtual}
                      onChange={(e) => setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Nova senha
                    <input
                      type="password"
                      value={senhaForm.novaSenha}
                      onChange={(e) => setSenhaForm({ ...senhaForm, novaSenha: e.target.value })}
                      minLength={4}
                      required
                    />
                  </label>
                  <label>
                    Confirmar nova senha
                    <input
                      type="password"
                      value={senhaForm.confirmarSenha}
                      onChange={(e) => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
                      minLength={4}
                      required
                    />
                  </label>
                  {msgSenha.texto && (
                    <div className={msgSenha.tipo === "ok" ? "profile-ok" : "profile-error"}>
                      {msgSenha.texto}
                    </div>
                  )}
                  <button type="submit" disabled={trocando}>
                    {trocando ? "Alterando..." : "Alterar senha"}
                  </button>
                </form>
              </section>

              <section className="profile-card profile-danger">
                <h2 className="d-flex align-items-center gap-2"><TriangleAlert size={20} aria-hidden="true" /> Zona de perigo</h2>
                <p>Excluir sua conta apaga seu acesso. Essa ação não pode ser desfeita.</p>
                {!confirmandoExclusao ? (
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => setConfirmandoExclusao(true)}
                  >
                    Excluir minha conta
                  </button>
                ) : (
                  <div className="danger-confirm">
                    <strong>Tem certeza? Digite novamente para confirmar.</strong>
                    <div className="danger-actions">
                      <button
                        type="button"
                        className="danger-button"
                        disabled={excluindo}
                        onClick={excluirConta}
                      >
                        {excluindo ? "Excluindo..." : "Sim, excluir"}
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setConfirmandoExclusao(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
                {msgExclusao.texto && <div className="profile-error">{msgExclusao.texto}</div>}
              </section>
            </>
          )}
        </section>
      </main>
    </>
  );
}
