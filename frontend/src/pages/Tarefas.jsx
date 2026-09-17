import { useCallback, useEffect, useMemo, useState } from "react";
import { listarTasks, listarTarefasUsuario, criarTask, atualizarTask, concluirTask, deletarTask } from "../services/taskService";
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

const prioridadeOptions = ["Baixa", "Media", "Alta"];
const statusOptions = ["Pendente", "Em andamento", "Concluida"];

const initialFormState = {
    nome: "",
    descricao: "",
    dataTarefa: "",
    prioridade: "Media",
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
    const [actionError, setActionError] = useState("");
    const [formData, setFormData] = useState(initialFormState);
    const [creating, setCreating] = useState(false);
    const [savingId, setSavingId] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nome: "",
        descricao: "",
        dataTarefa: "",
        prioridade: "Media",
        status: "Pendente",
    });

    const userId = useMemo(getUserIdFromToken, []);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data =
                activeView === "mine" && userId
                    ? await listarTarefasUsuario(userId)
                    : activeView === "all"
                        ? await listarTasks()
                        : [];

            setTasks(data);
        } catch (requestError) {
            setTasks([]);
            setError(
                requestError.response?.data?.message ||
                "Não foi possível carregar as tarefas."
            );
        } finally {
            setLoading(false);
        }
    }, [activeView, userId]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    function handleFormChange(field, value) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    async function handleCreate(event) {
        event.preventDefault();
        if (!userId) return;

        setCreating(true);
        setActionError("");

        const response = await criarTask({
            userId,
            nome: formData.nome,
            descricao: formData.descricao,
            dataTarefa: formData.dataTarefa,
            prioridade: formData.prioridade,
            status: "Pendente",
        });

        setCreating(false);

        if (!response) {
            setActionError("Não foi possível criar a tarefa.");
            return;
        }

        setFormData(initialFormState);
        loadTasks();
    }

    async function handleStatusChange(taskId, novoStatus, statusAtual) {
        setSavingId(taskId);
        setActionError("");

        const isConcluir = (statusAtual !== "Concluida" && novoStatus === "Concluida") ||
            (statusAtual === "Concluida" && novoStatus === "Em andamento");

        const response = isConcluir
            ? await concluirTask(taskId)
            : await atualizarTask(taskId, { status: novoStatus });

        setSavingId(null);

        if (!response) {
            setActionError("Não foi possível atualizar a tarefa.");
            return;
        }

        loadTasks();
    }

    function handleEdit(task) {
        setEditingId(task.UUID);
        setActionError("");

        setEditFormData({
            nome: task.nome ?? "",
            descricao: task.descricao ?? "",
            dataTarefa: task.dataTarefa
                ? String(task.dataTarefa).slice(0, 10)
                : "",
            prioridade: task.prioridade ?? "Media",
            status: task.status ?? "Pendente",
        });
    }

    function handleEditFormChange(field, value) {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleCancelEdit() {
        setEditingId(null);

        setEditFormData({
            nome: "",
            descricao: "",
            dataTarefa: "",
            prioridade: "Media",
            status: "Pendente",
        });
    }

    async function handleSaveEdit(event, taskId) {
        event.preventDefault();

        setSavingId(taskId);
        setActionError("");

        const response = await atualizarTask(taskId, {
            nome: editFormData.nome,
            descricao: editFormData.descricao,
            dataTarefa: editFormData.dataTarefa,
            prioridade: editFormData.prioridade,
            status: editFormData.status,
        });

        setSavingId(null);

        if (!response) {
            setActionError("Não foi possível editar a tarefa.");
            return;
        }

        handleCancelEdit();
        loadTasks();
    }

    async function handleDelete(taskId) {
        setSavingId(taskId);
        setActionError("");

        const response = await deletarTask(taskId);

        setSavingId(null);

        if (!response) {
            setActionError("Não foi possível excluir a tarefa.");
            return;
        }

        loadTasks();
    }

    return (
        <main className="tasks-page">
            <section className="tasks-shell" aria-labelledby="tasks-title">
                <header className="tasks-header">
                    <div>
                        <p className="tasks-kicker">Rotina Plus</p>
                        <h1 id="tasks-title">Tarefas</h1>
                        <p className="tasks-subtitle">
                            Acompanhe as tarefas cadastradas e a sua lista pessoal.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        type="button"
                        onClick={loadTasks}
                        disabled={loading}
                    >
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
                            onChange={(e) =>
                                handleFormChange("nome", e.target.value)
                            }
                            minLength={3}
                            maxLength={64}
                            required
                        />

                        <input
                            className="task-form-input"
                            type="text"
                            placeholder="Descrição"
                            value={formData.descricao}
                            onChange={(e) =>
                                handleFormChange("descricao", e.target.value)
                            }
                            maxLength={255}
                        />

                        <input
                            className="task-form-input"
                            type="date"
                            value={formData.dataTarefa}
                            onChange={(e) =>
                                handleFormChange("dataTarefa", e.target.value)
                            }
                            required
                        />

                        <select
                            className="task-form-input"
                            value={formData.prioridade}
                            onChange={(e) =>
                                handleFormChange("prioridade", e.target.value)
                            }
                        >
                            {prioridadeOptions.map((opcao) => (
                                <option key={opcao} value={opcao}>
                                    {opcao}
                                </option>
                            ))}
                        </select>

                        <button
                            className="refresh-button"
                            type="submit"
                            disabled={creating}
                        >
                            {creating ? "Salvando..." : "Adicionar tarefa"}
                        </button>
                    </form>
                )}

                <div className="tasks-toolbar">
                    <div
                        className="tasks-tabs"
                        role="tablist"
                        aria-label="Filtro de tarefas"
                    >
                        {Object.entries(views).map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={activeView === key}
                                className={
                                    activeView === key
                                        ? "task-tab active"
                                        : "task-tab"
                                }
                                onClick={() => setActiveView(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <span className="task-count">
                        {tasks.length}{" "}
                        {tasks.length === 1 ? "tarefa" : "tarefas"}
                    </span>
                </div>

                {!userId && activeView === "mine" && !loading && (
                    <div className="tasks-notice" role="status">
                        Faça login para visualizar as tarefas vinculadas à sua conta.
                    </div>
                )}

                {error && (
                    <div className="tasks-error" role="alert">
                        {error}
                    </div>
                )}

                {actionError && (
                    <div className="tasks-error" role="alert">
                        {actionError}
                    </div>
                )}

                {loading ? (
                    <div className="tasks-state" role="status">
                        Carregando tarefas...
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="task-list">
                        {tasks.map((task) => {
                            const status = task.status ?? "Pendente";
                            const priority = task.prioridade ?? "Sem prioridade";
                            const dueDate = task.dataTarefa;
                            const isSaving = savingId === task.UUID;

                            return (
                                <article
                                    className="task-item"
                                    key={task.UUID}
                                >
                                    {editingId === task.UUID ? (
                                        <form
                                            className="task-edit-form"
                                            onSubmit={(event) =>
                                                handleSaveEdit(event, task.UUID)
                                            }
                                        >
                                            <input
                                                className="task-form-input"
                                                type="text"
                                                placeholder="Nome da tarefa"
                                                value={editFormData.nome}
                                                onChange={(e) =>
                                                    handleEditFormChange(
                                                        "nome",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                minLength={3}
                                                maxLength={64}
                                            />

                                            <input
                                                className="task-form-input"
                                                type="text"
                                                placeholder="Descrição"
                                                value={editFormData.descricao}
                                                onChange={(e) =>
                                                    handleEditFormChange(
                                                        "descricao",
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={255}
                                            />

                                            <input
                                                className="task-form-input"
                                                type="date"
                                                value={editFormData.dataTarefa}
                                                onChange={(e) =>
                                                    handleEditFormChange(
                                                        "dataTarefa",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <select
                                                className="task-form-input"
                                                value={editFormData.prioridade}
                                                onChange={(e) =>
                                                    handleEditFormChange(
                                                        "prioridade",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {prioridadeOptions.map((opcao) => (
                                                    <option key={opcao} value={opcao}>
                                                        {opcao}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="task-form-input"
                                                value={editFormData.status}
                                                onChange={(e) =>
                                                    handleEditFormChange(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {statusOptions.map((opcao) => (
                                                    <option key={opcao} value={opcao}>
                                                        {statusLabels[opcao]}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="task-actions">
                                                <button
                                                    className="refresh-button"
                                                    type="submit"
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? "Salvando..." : "Salvar"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cancel-button"
                                                    disabled={isSaving}
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="task-main">
                                                <div className="task-title-row">
                                                    <h2>{task.nome}</h2>

                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        {statusLabels[status] ?? status}
                                                    </span>
                                                </div>

                                                <p>
                                                    {task.descricao || "Sem descrição."}
                                                </p>
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

                                            <div className="task-actions">
                                                <select
                                                    value={status}
                                                    disabled={isSaving}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            task.UUID,
                                                            e.target.value,
                                                            status
                                                        )
                                                    }
                                                >
                                                    {statusOptions.map((opcao) => (
                                                        <option
                                                            key={opcao}
                                                            value={opcao}
                                                        >
                                                            {statusLabels[opcao]}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    type="button"
                                                    className="edit-button"
                                                    disabled={isSaving}
                                                    onClick={() => handleEdit(task)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-button"
                                                    disabled={isSaving}
                                                    onClick={() =>
                                                        handleDelete(task.UUID)
                                                    }
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                ) : !error &&
                    (activeView === "all" ||
                        (activeView === "mine" && userId)) ? (
                    <div className="tasks-state">
                        Nenhuma tarefa cadastrada ainda.
                    </div>
                ) : null}
            </section>
        </main>
    );
}

