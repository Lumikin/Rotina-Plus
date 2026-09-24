import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listarTasks,
  listarTarefasUsuario,
  criarTask,
  atualizarTask,
  concluirTask,
  deletarTask,
} from "../services/taskService";
import "./Tarefas.css";

const PRIORIDADES = ["Baixa", "Media", "Alta"];
const STATUS = ["Pendente", "Em andamento", "Concluida"];
const STATUS_LABEL = {
  Pendente: "Pendente",
  "Em andamento": "Em andamento",
  Concluida: "Concluída",
};

const INITIAL_FORM = {
  nome: "",
  descricao: "",
  dataTarefa: "",
  prioridade: "Media",
};

const INITIAL_EDIT_FORM = { ...INITIAL_FORM, status: "Pendente" };

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).userId ?? null;
  } catch {
    return null;
  }
}

function formatDate(date) {
  if (!date) return "Sem prazo";
  const [year, month, day] = String(date).slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : "Sem prazo";
}

function getStatusClass(status) {
  return String(status || "pendente")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export default function Tarefas() {
  const [activeView, setActiveView] = useState("mine");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(INITIAL_EDIT_FORM);

  const userId = useMemo(() => getUserIdFromToken(), []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data =
        activeView === "mine" && userId
          ? await listarTarefasUsuario(userId)
          : await listarTasks();
      setTasks(data);
    } catch (requestError) {
      setTasks([]);
      setError(requestError.response?.data?.message || "Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  }, [activeView, userId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFormChange = (setter) => (field, value) =>
    setter((prev) => ({ ...prev, [field]: value }));

  const onCreateChange = handleFormChange(setFormData);
  const onEditChange = handleFormChange(setEditFormData);

  async function handleCreate(event) {
    event.preventDefault();
    if (!userId) return;
    setCreating(true);
    setActionError("");

    const response = await criarTask({
      userId,
      ...formData,
      status: "Pendente",
    });

    setCreating(false);
    if (!response) return setActionError("Não foi possível criar a tarefa.");

    setFormData(INITIAL_FORM);
    loadTasks();
  }

  async function handleStatusChange(taskId, novoStatus, statusAtual) {
    setSavingId(taskId);
    setActionError("");

    const isConcluir =
      (statusAtual !== "Concluida" && novoStatus === "Concluida") ||
      (statusAtual === "Concluida" && novoStatus === "Em andamento");

    const response = isConcluir
      ? await concluirTask(taskId)
      : await atualizarTask(taskId, { status: novoStatus });

    setSavingId(null);
    if (!response) return setActionError("Não foi possível atualizar a tarefa.");
    loadTasks();
  }

  function handleEdit(task) {
    setEditingId(task.UUID);
    setActionError("");
    setEditFormData({
      nome: task.nome ?? "",
      descricao: task.descricao ?? "",
      dataTarefa: task.dataTarefa ? String(task.dataTarefa).slice(0, 10) : "",
      prioridade: task.prioridade ?? "Media",
      status: task.status ?? "Pendente",
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditFormData(INITIAL_EDIT_FORM);
  }

  async function handleSaveEdit(event, taskId) {
    event.preventDefault();
    setSavingId(taskId);
    setActionError("");

    const response = await atualizarTask(taskId, editFormData);

    setSavingId(null);
    if (!response) return setActionError("Não foi possível editar a tarefa.");

    handleCancelEdit();
    loadTasks();
  }

  async function handleDelete(taskId) {
    setSavingId(taskId);
    setActionError("");
    const response = await deletarTask(taskId);
    setSavingId(null);
    if (!response) return setActionError("Não foi possível excluir a tarefa.");
    loadTasks();
  }

  return (
    <main className="tasks-page">
      <section className="tasks-shell">
        <header className="tasks-header">
          <div>
            <h1>Tarefas</h1>
            <p className="tasks-subtitle">Acompanhe as tarefas cadastradas e a sua lista pessoal.</p>
          </div>
          <button className="refresh-button" type="button" onClick={loadTasks} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </header>

        {userId && (
          <form className="task-form" onSubmit={handleCreate}>
            <input
              className="task-form-input"
              type="text"
              placeholder="Nome da tarefa"
              value={formData.nome}
              onChange={(e) => onCreateChange("nome", e.target.value)}
              minLength={3}
              maxLength={64}
              required
            />
            <input
              className="task-form-input"
              type="text"
              placeholder="Descrição"
              value={formData.descricao}
              onChange={(e) => onCreateChange("descricao", e.target.value)}
              maxLength={255}
            />
            <input
              className="task-form-input"
              type="date"
              value={formData.dataTarefa}
              onChange={(e) => onCreateChange("dataTarefa", e.target.value)}
              required
            />
            <select
              className="task-form-input"
              value={formData.prioridade}
              onChange={(e) => onCreateChange("prioridade", e.target.value)}
            >
              {PRIORIDADES.map((opcao) => (
                <option key={opcao} value={opcao}>{opcao}</option>
              ))}
            </select>
            <button className="refresh-button" type="submit" disabled={creating}>
              {creating ? "Salvando..." : "Adicionar tarefa"}
            </button>
          </form>
        )}

        <div className="tasks-toolbar">
          <div className="tasks-tabs">
            <button
              type="button"
              className={activeView === "mine" ? "task-tab active" : "task-tab"}
              onClick={() => setActiveView("mine")}
            >
              Minhas tarefas
            </button>
            <button
              type="button"
              className={activeView === "all" ? "task-tab active" : "task-tab"}
              onClick={() => setActiveView("all")}
            >
              Todas as tarefas
            </button>
          </div>
          <span className="task-count">{tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}</span>
        </div>

        {!userId && activeView === "mine" && !loading && (
          <div className="tasks-notice">Faça login para visualizar as tarefas vinculadas à sua conta.</div>
        )}

        {error && <div className="tasks-error" role="alert">{error}</div>}
        {actionError && <div className="tasks-error" role="alert">{actionError}</div>}

        {loading ? (
          <div className="tasks-state">Carregando tarefas...</div>
        ) : tasks.length > 0 ? (
          <div className="task-list">
            {tasks.map((task) => {
              const status = task.status ?? "Pendente";
              const isSaving = savingId === task.UUID;
              const isEditing = editingId === task.UUID;

              return (
                <article className="task-item" key={task.UUID}>
                  {isEditing ? (
                    <form className="task-edit-form" onSubmit={(e) => handleSaveEdit(e, task.UUID)}>
                      <input
                        className="task-form-input"
                        type="text"
                        placeholder="Nome da tarefa"
                        value={editFormData.nome}
                        onChange={(e) => onEditChange("nome", e.target.value)}
                        required minLength={3} maxLength={64}
                      />
                      <input
                        className="task-form-input"
                        type="text"
                        placeholder="Descrição"
                        value={editFormData.descricao}
                        onChange={(e) => onEditChange("descricao", e.target.value)}
                        maxLength={255}
                      />
                      <input
                        className="task-form-input"
                        type="date"
                        value={editFormData.dataTarefa}
                        onChange={(e) => onEditChange("dataTarefa", e.target.value)}
                        required
                      />
                      <select
                        className="task-form-input"
                        value={editFormData.prioridade}
                        onChange={(e) => onEditChange("prioridade", e.target.value)}
                      >
                        {PRIORIDADES.map((opcao) => (
                          <option key={opcao} value={opcao}>{opcao}</option>
                        ))}
                      </select>
                      <select
                        className="task-form-input"
                        value={editFormData.status}
                        onChange={(e) => onEditChange("status", e.target.value)}
                      >
                        {STATUS.map((opcao) => (
                          <option key={opcao} value={opcao}>{STATUS_LABEL[opcao]}</option>
                        ))}
                      </select>
                      <div className="task-actions">
                        <button className="refresh-button" type="submit" disabled={isSaving}>
                          {isSaving ? "Salvando..." : "Salvar"}
                        </button>
                        <button type="button" className="cancel-button" disabled={isSaving} onClick={handleCancelEdit}>
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="task-main">
                        <div className="task-title-row">
                          <h2>{task.nome}</h2>
                          <span className={`status-badge ${getStatusClass(status)}`}>
                            {STATUS_LABEL[status] ?? status}
                          </span>
                        </div>
                        <p>{task.descricao || "Sem descrição."}</p>
                      </div>

                      <dl className="task-details">
                        <div><dt>Prioridade</dt><dd>{task.prioridade ?? "Sem prioridade"}</dd></div>
                        <div><dt>Prazo</dt><dd>{formatDate(task.dataTarefa)}</dd></div>
                      </dl>

                      <div className="task-actions">
                        <select
                          value={status}
                          disabled={isSaving}
                          onChange={(e) => handleStatusChange(task.UUID, e.target.value, status)}
                        >
                          {STATUS.map((opcao) => (
                            <option key={opcao} value={opcao}>{STATUS_LABEL[opcao]}</option>
                          ))}
                        </select>
                        <button type="button" className="edit-button" disabled={isSaving} onClick={() => handleEdit(task)}>
                          Editar
                        </button>
                        <button type="button" className="delete-button" disabled={isSaving} onClick={() => handleDelete(task.UUID)}>
                          Excluir
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        ) : !error && (activeView === "all" || (activeView === "mine" && userId)) ? (
          <div className="tasks-state">Nenhuma tarefa cadastrada ainda.</div>
        ) : null}
      </section>
    </main>
  );
}
