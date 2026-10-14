import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Flame, Trophy } from "lucide-react";
import {
  listarTarefasUsuario,
  criarTask,
  atualizarTask,
  concluirTask,
  deletarTask,
  obterPontosUsuario,
  obterOfensivaUsuario,
} from "../services/taskService";
import {logout, getUserId} from "../services/authService";
import {hojeKey, formatarDataBR, toInputDate} from "../utils/date";
import {useNomeUsuario} from "../hooks/useNomeUsuario";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const PRIORIDADES = ["Baixa", "Media", "Alta"];
const STATUS = ["Pendente", "Em andamento", "Concluida"];
const RECORRENCIAS = [
  { value: "Unica", label: "Não repete" },
  { value: "Diaria", label: "Diária" },
  { value: "Semanal", label: "Semanal" },
  { value: "Mensal", label: "Mensal" },
];

const formatarData = formatarDataBR;
const hoje = hojeKey;

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId] = useState(getUserId);
  const [nomeUsuario] = useNomeUsuario(userId);
  const [tasks, setTasks] = useState([]);
  const [pontosTotais, setPontosTotais] = useState(0);
  const [diasOfensiva, setDiasOfensiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState("atuais");
  const [criando, setCriando] = useState(false);
  const [salvandoId, setSalvandoId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataTarefa: "",
    prioridade: "Media",
    recorrencia: "Unica",
  });
  const [editForm, setEditForm] = useState({
    nome: "",
    descricao: "",
    dataTarefa: "",
    prioridade: "Media",
    status: "Pendente",
    recorrencia: "Unica",
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
      const pontos = await obterPontosUsuario(userId);
      setPontosTotais(Number(pontos) || 0);
      const ofensiva = await obterOfensivaUsuario(userId);
      setDiasOfensiva(Number(ofensiva) || 0);
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
    setForm({nome: "", descricao: "", dataTarefa: "", prioridade: "Media", recorrencia: "Unica"});
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
      dataTarefa: toInputDate(task.dataTarefa),
      prioridade: task.prioridade ?? "Media",
      status: task.status ?? "Pendente",
      recorrencia: task.recorrencia ?? "Unica",
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
    const concluida = status === "Concluida";
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
              value={editForm.recorrencia}
              onChange={(e) => setEditForm({...editForm, recorrencia: e.target.value})}
              title="Recorrência: cria a próxima ocorrência ao concluir"
            >
              {RECORRENCIAS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
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
          {task.recorrencia && task.recorrencia !== "Unica" && (
            <div>
              <dt>Repete</dt>
              <dd>{RECORRENCIAS.find((r) => r.value === task.recorrencia)?.label ?? task.recorrencia}</dd>
            </div>
          )}
        </dl>
        <div className="task-actions">
          <button
            type="button"
            className={concluida ? "voltar-button" : "concluir-button"}
            disabled={salvando}
            onClick={() => trocarStatus(task.UUID, concluida ? "Em andamento" : "Concluida", status)}
          >
            {salvando ? "Salvando..." : concluida ? "Voltar" : "Concluir"}
          </button>
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

        <section className="stats-summary" aria-label="Resumo do usuário">
          <div className="points-summary" aria-label="Pontos totais">
            <span className="points-label d-inline-flex align-items-center gap-1"><Trophy size={16} aria-hidden="true" /> Pontos totais</span>
            <strong className="points-value">{pontosTotais}</strong>
          </div>
          <div className="streak-summary" aria-label="Dias de ofensiva" title="Dias seguidos com ao menos uma tarefa concluída">
            <span className="streak-label d-inline-flex align-items-center gap-1"><Flame size={16} aria-hidden="true" /> Dias de ofensiva</span>
            <strong className="streak-value">
              {diasOfensiva} {diasOfensiva === 1 ? "dia" : "dias"}
            </strong>
          </div>
        </section>

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
            <select
              className="task-form-input"
              value={form.recorrencia}
              onChange={(e) => setForm({...form, recorrencia: e.target.value})}
              title="Recorrência: cria a próxima ocorrência ao concluir"
            >
              {RECORRENCIAS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
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
