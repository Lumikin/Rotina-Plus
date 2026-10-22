import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarTarefasUsuario,
  listarTarefasAtrasadas,
  criarTask,
  atualizarTask,
  concluirTask,
  deletarTask,
  obterPontosUsuario,
  obterOfensivaUsuario,
} from "../services/taskService";
import { logout, getUserId } from "../services/authService";
import { hojeKey, formatarDataBR, toInputDate } from "../utils/date";
import { useNomeUsuario } from "../hooks/useNomeUsuario";
import { useTheme } from "../hooks/useTheme";
import Navbar from "../components/Navbar";
import AlertaTarefasAtrasadas from "../components/AlertaTarefasAtrasadas";
import TaskModal from "../components/TaskModal";
import "./Dashboard.css";

const PRIORIDADES = ["Baixa", "Media", "Alta"];
const STATUS = ["Pendente", "Em andamento", "Concluida"];
const RECORRENCIAS = [
  { value: "nenhuma", label: "Não repete" },
  { value: "diaria", label: "Diária" },
  { value: "semanal", label: "Semanal" },
  { value: "mensal", label: "Mensal" },
];

const formatarData = formatarDataBR;
const hoje = hojeKey;

function normalizarRecorrencia(value) {
  const normalizada = String(value ?? "nenhuma").toLowerCase();
  return normalizada === "unica" ? "nenhuma" : normalizada;
}

const FORMULARIO_BASE = {
  nome: "",
  descricao: "",
  dataTarefa: "",
  prioridade: "Media",
  recorrencia: "nenhuma",
};

const FORMULARIO_EDICAO_BASE = {
  ...FORMULARIO_BASE,
  status: "Pendente",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { temaEscuro, toggleTema } = useTheme();
  const [userId] = useState(getUserId);
  const [nomeUsuario] = useNomeUsuario(userId);
  const [tasks, setTasks] = useState([]);
  const [pontosTotais, setPontosTotais] = useState(0);
  const [diasOfensiva, setDiasOfensiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [tarefasAtrasadas, setTarefasAtrasadas] = useState([]);
  const [alertaAtrasadasAberto, setAlertaAtrasadasAberto] = useState(true);
  const [aba, setAba] = useState("atuais"); // "atuais" | "futuras" | "concluidas"
  const [criando, setCriando] = useState(false);
  const [salvandoId, setSalvandoId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalModo, setModalModo] = useState("criar");

  const [form, setForm] = useState(FORMULARIO_BASE);
  const [editForm, setEditForm] = useState(FORMULARIO_EDICAO_BASE);

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
      const atrasadas = await listarTarefasAtrasadas(userId);
      setTarefasAtrasadas(Array.isArray(atrasadas) ? atrasadas : []);
      const pontos = await obterPontosUsuario(userId);
      setPontosTotais(Number(pontos) || 0);
      const ofensiva = await obterOfensivaUsuario(userId);
      setDiasOfensiva(Number(ofensiva) || 0);
    } catch {
      setTasks([]);
      setTarefasAtrasadas([]);
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
    navigate("/login", { replace: true });
  }

  async function criar(e) {
    e.preventDefault();
    setCriando(true);
    setErro("");
    const ok = await criarTask({ userId, ...form, status: "Em andamento" });
    setCriando(false);
    if (!ok) {
      setErro("Não foi possível criar a tarefa.");
      return;
    }
    setForm(FORMULARIO_BASE);
    fecharModal();
    carregar();
  }

  function prepararFormularioEdicao(task) {
    setEditForm({
      nome: task.nome ?? "",
      descricao: task.descricao ?? "",
      dataTarefa: toInputDate(task.dataTarefa),
      prioridade: task.prioridade ?? "Media",
      status: task.status ?? "Pendente",
      recorrencia: normalizarRecorrencia(task.recorrencia),
    });
  }

  function abrirModalTarefa(task = null) {
    setErro("");
    if (task) {
      setModalModo("editar");
      setEditandoId(task.UUID);
      prepararFormularioEdicao(task);
    } else {
      setModalModo("criar");
      setEditandoId(null);
      setForm(FORMULARIO_BASE);
    }
    setModalAberto(true);
  }

  function comecarEditar(task) {
    abrirModalTarefa(task);
  }

  function abrirModalCriacao() {
    abrirModalTarefa();
  }

  async function trocarStatus(id, novo, atual) {
    setSalvandoId(id);
    setErro("");
    const usaConcluir =
      (atual !== "Concluida" && novo === "Concluida") ||
      (atual === "Concluida" && novo === "Em andamento");
    const ok = usaConcluir
      ? await concluirTask(id)
      : await atualizarTask(id, { status: novo });
    setSalvandoId(null);
    if (!ok) {
      setErro("Não foi possível atualizar a tarefa.");
      return;
    }
    carregar();
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
    fecharModal();
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

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
    setForm(FORMULARIO_BASE);
    setEditForm(FORMULARIO_EDICAO_BASE);
    setErro("");
  }

  const chaveHoje = hoje();
  const chaveData = (valor) => (valor ? String(valor).slice(0, 10) : "");
  const tarefasDoDia = tasks.filter((t) => {
    const chave = chaveData(t.dataTarefa);
    return !chave || chave === chaveHoje;
  });
  const atrasadasPendentes = tasks.filter((t) => {
    const chave = chaveData(t.dataTarefa);
    return chave && chave < chaveHoje && (t.status ?? "Pendente") !== "Concluida";
  });
  const atrasadasConcluidasHoje = tasks.filter((t) => {
    const chave = chaveData(t.dataTarefa);
    const conclusao = chaveData(t.DataConclusao ?? t.dataConclusao);
    return (
      chave &&
      chave < chaveHoje &&
      (t.status ?? "Pendente") === "Concluida" &&
      conclusao === chaveHoje
    );
  });
  const totalProgresso =
    tarefasDoDia.length + atrasadasPendentes.length + atrasadasConcluidasHoje.length;
  const concluidasProgresso =
    tarefasDoDia.filter((t) => (t.status ?? "Pendente") === "Concluida").length +
    atrasadasConcluidasHoje.length;
  const progresso = totalProgresso
    ? Math.round((concluidasProgresso / totalProgresso) * 100)
    : 0;
  const atuais = tasks.filter(
    (t) =>
      String(t.dataTarefa ?? "").slice(0, 10) <= chaveHoje || !t.dataTarefa,
  );
  const atuaisAbertas = atuais.filter(
    (t) => (t.status ?? "Pendente") !== "Concluida",
  );
  const futuras = tasks.filter(
    (t) => t.dataTarefa && String(t.dataTarefa).slice(0, 10) > chaveHoje,
  );
  const concluidasTodas = tasks.filter(
    (t) => (t.status ?? "Pendente") === "Concluida",
  );
  const lista =
    aba === "futuras" ? futuras : aba === "concluidas" ? concluidasTodas : atuaisAbertas;
  const abertas =
    aba === "concluidas"
      ? []
      : lista.filter((t) => (t.status ?? "Pendente") !== "Concluida");
  const concluidas = lista.filter((t) => (t.status ?? "Pendente") === "Concluida");
  const totalConcluidas = concluidasTodas.length;

  function mostraTask(task) {
    const status = task.status ?? "Pendente";
    const concluida = status === "Concluida";
    const salvando = salvandoId === task.UUID;
    const recorrenciaChave = normalizarRecorrencia(task.recorrencia);

    return (
      <article className={`task-item ${concluida ? "task-completed" : ""}`} key={task.UUID}>
        <div className="task-main">
          <div className="task-title-row">
            <h2>{task.nome}</h2>
            <span className={`status-badge ${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>
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
          {recorrenciaChave && recorrenciaChave !== "nenhuma" && recorrenciaChave !== "unica" && (
            <div>
              <dt>Repete</dt>
              <dd>{RECORRENCIAS.find((r) => r.value === recorrenciaChave)?.label ?? task.recorrencia}</dd>
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
      <Navbar
        temaEscuro={temaEscuro}
        toggleTema={toggleTema}
        nomeUsuario={nomeUsuario}
        onSair={sair}
        mostrarLogo={false}
        streak={diasOfensiva}
      />
      <main className="tasks-page">
        <section className="tasks-shell">

          {userId && tarefasAtrasadas.length > 0 && alertaAtrasadasAberto && (
            <AlertaTarefasAtrasadas
              tarefas={tarefasAtrasadas}
              onVerTarefas={() => setAba("atuais")}
              onFechar={() => setAlertaAtrasadasAberto(false)}
            />
          )}

          <section className="progress-dashboard" aria-label="Dashboard de progresso">
            <article className="progress-card progress-main">
              <div className="progress-card-heading">
              </div>
              <div className="progress-number-row">
                <strong className="progress-number">{progresso}%</strong>
                <span className="progress-caption">{concluidasProgresso} de {totalProgresso} concluídas</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={progresso} aria-valuemin="0" aria-valuemax="100" aria-label="Progresso das tarefas do dia e atrasadas">
                <span style={{ width: `${progresso}%` }} />
              </div>
            </article>
            <article className="progress-card">
              <div className="progress-card-heading"><span className="progress-icon streak-icon">↗</span><span className="points-label">Ofensiva atual</span></div>
              <strong className="metric-number">{diasOfensiva} <small>{diasOfensiva === 1 ? "dia" : "dias"}</small></strong>
              <p className="metric-hint">Conclua tarefas em dias seguidos para manter sua ofensiva.</p>
            </article>
            <article className="progress-card">
              <div className="progress-card-heading"><span className="progress-icon points-icon">★</span><span className="points-label">Pontos totais</span></div>
              <strong className="metric-number">{pontosTotais}</strong>
              <p className="metric-hint">Pontos conquistados ao concluir tarefas.</p>
            </article>
          </section>

          <div className="tasks-toolbar">
            <div className="tasks-tabs">
              <button
                type="button"
                className={aba === "atuais" ? "task-tab active" : "task-tab"}
                onClick={() => setAba("atuais")}
              >
                Hoje ({atuaisAbertas.length})
              </button>
              <button
                type="button"
                className={aba === "futuras" ? "task-tab active" : "task-tab"}
                onClick={() => setAba("futuras")}
              >
                Futuras ({futuras.length})
              </button>
              <button
                type="button"
                className={aba === "concluidas" ? "task-tab active" : "task-tab"}
                onClick={() => setAba("concluidas")}
              >
                Concluídas ({totalConcluidas})
              </button>
            </div>
            {userId && (
              <button type="button" className="refresh-button add-task-button" onClick={abrirModalCriacao}>
                + Adicionar tarefa
              </button>
            )}
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
            <section
              className={
                aba === "concluidas" ? "tasks-done tasks-done-standalone" : "tasks-done"
              }
            >
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
                : aba === "concluidas"
                  ? "Nenhuma tarefa concluída ainda."
                  : "Nenhuma tarefa pendente para hoje ou anterior."}
            </div>
          )}
        </section>
      </main>

      {modalAberto && (
        <TaskModal
          aberto={modalAberto}
          modo={modalModo}
          form={form}
          editForm={editForm}
          tarefaId={editandoId}
          criando={criando}
          salvandoId={salvandoId}
          onClose={fecharModal}
          onChangeCriacao={setForm}
          onChangeEdicao={setEditForm}
          onSubmit={criar}
          onSubmitEdicao={salvarEdicao}
          PRIORIDADES={PRIORIDADES}
          RECORRENCIAS={RECORRENCIAS}
          STATUS={STATUS}
        />
      )}
    </>
  );
}
