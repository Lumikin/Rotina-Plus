import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  listarTarefasUsuario,
  criarTask,
  atualizarTask,
  concluirTask,
  deletarTask,
} from "../services/taskService";
import {api_rotinaplus} from "../services/api";
import {logout} from "../services/authService";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const PRIORIDADES = ["Baixa", "Media", "Alta"];
const STATUS = ["Pendente", "Em andamento", "Concluida"];

function getUserId() {
  try {
    const token = localStorage.getItem("token");
    return JSON.parse(atob(token.split(".")[1])).userId ?? null;
  } catch {
    return null;
  }
}

function formatarData(data) {
  if (!data) return "Sem prazo";
  const [ano, mes, dia] = String(data).slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Sem prazo";
}

function hoje() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId] = useState(getUserId);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState("atuais"); // "atuais" | "futuras"
  const [criando, setCriando] = useState(false);
  const [salvandoId, setSalvandoId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataTarefa: "",
    prioridade: "Media",
  });
  const [editForm, setEditForm] = useState({
    nome: "",
    descricao: "",
    dataTarefa: "",
    prioridade: "Media",
    status: "Pendente",
  });

  async function carregar() {
    setLoading(true);
    setErro("");
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    try {
      const data = await listarTarefasUsuario(userId);
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setTasks([]);
      setErro("Não foi possível carregar as tarefas.");
    }
    setLoading(false);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function buscarNome() {
      if (!userId) return;
      try {
        const res = await api_rotinaplus.get(`/api/users/${userId}`);
        const nome = res.data?.result?.[0]?.nome ?? res.data?.result?.nome ?? "";
        if (nome) setNomeUsuario(nome);
      } catch {
        // mantém vazio, não quebra a tela
      }
    }
    buscarNome();
  }, [userId]);

  function sair() {
    logout();
    navigate("/login", {replace: true});
  }

  async function criar(e) {
    e.preventDefault();
    setCriando(true);
    setErro("");
    const ok = await criarTask({userId, ...form, status: "Em andamento"});
    setCriando(false);
    if (!ok) {
      setErro("Não foi possível criar a tarefa.");
      return;
    }
    setForm({nome: "", descricao: "", dataTarefa: "", prioridade: "Media"});
    carregar();
  }

  async function trocarStatus(id, novo, atual) {
    setSalvandoId(id);
    setErro("");
    const usaConcluir =
      (atual !== "Concluida" && novo === "Concluida") ||
      (atual === "Concluida" && novo === "Em andamento");
    const ok = usaConcluir
      ? await concluirTask(id)
      : await atualizarTask(id, {status: novo});
    setSalvandoId(null);
    if (!ok) {
      setErro("Não foi possível atualizar a tarefa.");
      return;
    }
    carregar();
  }

  function comecarEditar(task) {
    setEditandoId(task.UUID);
    setErro("");
    setEditForm({
      nome: task.nome ?? "",
      descricao: task.descricao ?? "",
      dataTarefa: task.dataTarefa ? String(task.dataTarefa).slice(0, 10) : "",
      prioridade: task.prioridade ?? "Media",
      status: task.status ?? "Pendente",
    });
  }

  async function salvarEdicao(e, id) {
    e.preventDefault();
    setSalvandoId(id);
    setErro("");
    const ok = await atualizarTask(id, editForm);
    setSalvandoId(null);
    if (!ok) {
      setErro("Não foi possível editar a tarefa.");
      return;
    }
    setEditandoId(null);
    carregar();
  }

  async function excluir(id) {
    setSalvandoId(id);
    setErro("");
    const ok = await deletarTask(id);
    setSalvandoId(null);
    if (!ok) {
      setErro("Não foi possível excluir a tarefa.");
      return;
    }
    carregar();
  }

  const chaveHoje = hoje();
  const atuais = tasks.filter(
    (t) =>
      String(t.dataTarefa ?? "").slice(0, 10) <= chaveHoje || !t.dataTarefa,
  );
  const futuras = tasks.filter(
    (t) => t.dataTarefa && String(t.dataTarefa).slice(0, 10) > chaveHoje,
  );
  const lista = aba === "futuras" ? futuras : atuais;
  const abertas = lista.filter((t) => (t.status ?? "Pendente") !== "Concluida");
  const concluidas = lista.filter((t) => (t.status ?? "Pendente") === "Concluida");

  function mostraTask(task) {
    const status = task.status ?? "Pendente";
    const salvando = salvandoId === task.UUID;
    const editando = editandoId === task.UUID;

    if (editando) {
      return (
        <article className="task-item" key={task.UUID}>
          <form className="task-edit-form" onSubmit={(e) => salvarEdicao(e, task.UUID)}>
            <input
              className="task-form-input"
              value={editForm.nome}
              onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
              minLength={3}
              maxLength={64}
              required
            />
            <input
              className="task-form-input"
              value={editForm.descricao}
              onChange={(e) => setEditForm({...editForm, descricao: e.target.value})}
              maxLength={255}
            />
            <input
              className="task-form-input"
              type="date"
              value={editForm.dataTarefa}
              onChange={(e) => setEditForm({...editForm, dataTarefa: e.target.value})}
              required
            />
            <select
              className="task-form-input"
              value={editForm.prioridade}
              onChange={(e) => setEditForm({...editForm, prioridade: e.target.value})}
            >
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              className="task-form-input"
              value={editForm.status}
              onChange={(e) => setEditForm({...editForm, status: e.target.value})}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="task-actions">
              <button className="refresh-button" type="submit" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" className="cancel-button" onClick={() => setEditandoId(null)}>
                Cancelar
              </button>
            </div>
          </form>
        </article>
      );
    }

    return (
      <article className="task-item" key={task.UUID}>
        <div className="task-main">
          <div className="task-title-row">
            <h2>{task.nome}</h2>
            <span className="status-badge">{status}</span>
          </div>
          <p>{task.descricao || "Sem descrição."}</p>
        </div>
        <dl className="task-details">
          <div>
            <dt>Prioridade</dt>
            <dd>{task.prioridade ?? "Sem prioridade"}</dd>
          </div>
          <div>
            <dt>Prazo</dt>
            <dd>{formatarData(task.dataTarefa)}</dd>
          </div>
        </dl>
        <div className="task-actions">
          <select
            value={status}
            disabled={salvando}
            onChange={(e) => trocarStatus(task.UUID, e.target.value, status)}
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="button" className="edit-button" disabled={salvando} onClick={() => comecarEditar(task)}>
            Editar
          </button>
          <button type="button" className="delete-button" disabled={salvando} onClick={() => excluir(task.UUID)}>
            Excluir
          </button>
        </div>
      </article>
    );
  }

  return (
    <>
      <Navbar nomeUsuario={nomeUsuario} onSair={sair} />
      <main className="tasks-page">
      <section className="tasks-shell">
        <header className="tasks-header">
          <div>
            <h1>Tarefas</h1>
            <p className="tasks-subtitle">Sua lista pessoal de tarefas.</p>
          </div>
          <button
            className="refresh-button"
            type="button"
            onClick={carregar}
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </header>

        {userId && (
          <form className="task-form" onSubmit={criar}>
            <input
              className="task-form-input"
              placeholder="Nome da tarefa"
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              minLength={3}
              maxLength={64}
              required
            />
            <input
              className="task-form-input"
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({...form, descricao: e.target.value})}
              maxLength={255}
            />
            <input
              className="task-form-input"
              type="date"
              value={form.dataTarefa}
              onChange={(e) => setForm({...form, dataTarefa: e.target.value})}
              required
            />
            <select
              className="task-form-input"
              value={form.prioridade}
              onChange={(e) => setForm({...form, prioridade: e.target.value})}
            >
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button className="refresh-button" type="submit" disabled={criando}>
              {criando ? "Salvando..." : "Adicionar tarefa"}
            </button>
          </form>
        )}

        <div className="tasks-toolbar">
          <div className="tasks-tabs">
            <button
              type="button"
              className={aba === "atuais" ? "task-tab active" : "task-tab"}
              onClick={() => setAba("atuais")}
            >
              Hoje ({atuais.length})
            </button>
            <button
              type="button"
              className={aba === "futuras" ? "task-tab active" : "task-tab"}
              onClick={() => setAba("futuras")}
            >
              Futuras ({futuras.length})
            </button>
          </div>
          <span className="task-count">
            {lista.length} {lista.length === 1 ? "tarefa" : "tarefas"}
          </span>
        </div>

        {!userId && !loading && (
          <div className="tasks-notice">Faça login para ver suas tarefas.</div>
        )}
        {erro && <div className="tasks-error">{erro}</div>}
        {loading && <div className="tasks-state">Carregando tarefas...</div>}

        {!loading && abertas.length > 0 && (
          <div className="task-list">
            {abertas.map((task) => mostraTask(task))}
          </div>
        )}

        {!loading && concluidas.length > 0 && (
          <section className="tasks-done">
            <h2 className="tasks-section-title">
              Concluídas ({concluidas.length})
            </h2>
            <div className="task-list task-list-done">
              {concluidas.map((task) => mostraTask(task))}
            </div>
          </section>
        )}

        {!loading && !erro && lista.length === 0 && userId && (
          <div className="tasks-state">
            {aba === "futuras"
              ? "Nenhuma tarefa futura."
              : "Nenhuma tarefa para hoje ou anterior."}
          </div>
        )}
      </section>
      </main>
    </>
  );
}
