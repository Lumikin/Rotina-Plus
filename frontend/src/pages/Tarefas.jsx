import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllTasks, getTasksByUser } from "../services/taskService";
import "./Tarefas.css";

const views = {
  mine: "Minhas tarefas",
  all: "Todas as tarefas",
};

const statusLabels = {
  Pendente: "Pendente",
  "Em andamento": "Em andamento",
  Concluida: "Concluída",
};

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

  const normalizedDate = String(date).slice(0, 10);
  const [year, month, day] = normalizedDate.split("-");

  if (!year || !month || !day) return "Sem prazo";

  return `${day}/${month}/${year}`;
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
  const userId = useMemo(getUserIdFromToken, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = activeView === "mine" && userId
        ? await getTasksByUser(userId)
        : activeView === "all"
          ? await getAllTasks()
          : [];

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

  return (
    <main className="tasks-page">
      <section className="tasks-shell" aria-labelledby="tasks-title">
        <header className="tasks-header">
          <div>
            <p className="tasks-kicker">Rotina Plus</p>
            <h1 id="tasks-title">Tarefas</h1>
            <p className="tasks-subtitle">Acompanhe as tarefas cadastradas e a sua lista pessoal.</p>
          </div>
          <button className="refresh-button" type="button" onClick={loadTasks} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </header>

        <div className="tasks-toolbar">
          <div className="tasks-tabs" role="tablist" aria-label="Filtro de tarefas">
            {Object.entries(views).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeView === key}
                className={activeView === key ? "task-tab active" : "task-tab"}
                onClick={() => setActiveView(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="task-count">{tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}</span>
        </div>

        {!userId && activeView === "mine" && !loading && (
          <div className="tasks-notice" role="status">
            Faça login para visualizar as tarefas vinculadas à sua conta.
          </div>
        )}

        {error && <div className="tasks-error" role="alert">{error}</div>}

        {loading ? (
          <div className="tasks-state" role="status">Carregando tarefas...</div>
        ) : tasks.length > 0 ? (
          <div className="task-list">
            {tasks.map((task) => {
              const status = task.Status ?? task.status ?? "Pendente";
              const priority = task.Prioridade ?? task.prioridade ?? "Sem prioridade";
              const dueDate = task.DataTarefa ?? task.dataTarefa;

              return (
                <article className="task-item" key={task.tarefaId ?? task.id}>
                  <div className="task-main">
                    <div className="task-title-row">
                      <h2>{task.Nome ?? task.nome ?? task.titulo}</h2>
                      <span className={`status-badge ${getStatusClass(status)}`}>{statusLabels[status] ?? status}</span>
                    </div>
                    <p>{task.descricao || "Sem descrição."}</p>
                  </div>
                  <dl className="task-details">
                    <div>
                      <dt>Prioridade</dt>
                      <dd>{priority}</dd>
                    </div>
                    <div>
                      <dt>Prazo</dt>
                      <dd>{formatDate(dueDate)}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        ) : !error && activeView === "all" ? (
          <div className="tasks-state">Nenhuma tarefa cadastrada ainda.</div>
        ) : null}
      </section>
    </main>
  );
}
