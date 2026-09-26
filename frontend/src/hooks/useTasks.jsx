import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listarTasks,
  listarTarefasUsuario,
  criarTask,
  atualizarTask,
  concluirTask,
  deletarTask,
} from "../services/taskService";
import {
  INITIAL_CREATE_FORM,
  INITIAL_EDIT_FORM,
  VIEWS,
  buildEditForm,
  extractErrorMessage,
  getUserIdFromToken,
  shouldUseConcluirEndpoint,
} from "../utils/taskHelpers";

export function useTasks() {
  const [activeView, setActiveView] = useState(VIEWS.MINE);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [createForm, setCreateForm] = useState(INITIAL_CREATE_FORM);
  const [editForm, setEditForm] = useState(INITIAL_EDIT_FORM);

  const userId = useMemo(() => getUserIdFromToken(), []);
  const isMineView = activeView === VIEWS.MINE;

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data =
        isMineView && userId
          ? await listarTarefasUsuario(userId)
          : await listarTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setTasks([]);
      setLoadError(
        extractErrorMessage(
          requestError,
          "Não foi possível carregar as tarefas."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [isMineView, userId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const updateCreateField = useCallback((field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateEditField = useCallback((field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearActionError = useCallback(() => setActionError(""), []);

  const createNewTask = useCallback(
    async (event) => {
      event.preventDefault();
      if (!userId) return;

      setCreating(true);
      setActionError("");
      const response = await criarTask({
        userId,
        ...createForm,
        status: "Em andamento",
      });
      setCreating(false);

      if (!response) {
        setActionError("Não foi possível criar a tarefa.");
        return;
      }
      setCreateForm(INITIAL_CREATE_FORM);
      await loadTasks();
    },
    [userId, createForm, loadTasks]
  );

  const changeTaskStatus = useCallback(
    async (taskId, novoStatus, statusAtual) => {
      setSavingId(taskId);
      setActionError("");

      const response = shouldUseConcluirEndpoint(statusAtual, novoStatus)
        ? await concluirTask(taskId)
        : await atualizarTask(taskId, { status: novoStatus });

      setSavingId(null);
      if (!response) {
        setActionError("Não foi possível atualizar a tarefa.");
        return;
      }
      await loadTasks();
    },
    [loadTasks]
  );

  const startEditing = useCallback((task) => {
    setEditingId(task.UUID);
    setActionError("");
    setEditForm(buildEditForm(task));
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditForm(INITIAL_EDIT_FORM);
  }, []);

  const saveEditing = useCallback(
    async (event, taskId) => {
      event.preventDefault();
      setSavingId(taskId);
      setActionError("");

      const response = await atualizarTask(taskId, editForm);
      setSavingId(null);

      if (!response) {
        setActionError("Não foi possível editar a tarefa.");
        return;
      }
      cancelEditing();
      await loadTasks();
    },
    [editForm, cancelEditing, loadTasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      setSavingId(taskId);
      setActionError("");

      const response = await deletarTask(taskId);
      setSavingId(null);

      if (!response) {
        setActionError("Não foi possível excluir a tarefa.");
        return;
      }
      await loadTasks();
    },
    [loadTasks]
  );

  return {
    // estado
    userId,
    activeView,
    setActiveView,
    isMineView,
    tasks,
    loading,
    loadError,
    actionError,
    creating,
    savingId,
    editingId,
    createForm,
    editForm,
    // ações
    loadTasks,
    updateCreateField,
    updateEditField,
    createNewTask,
    changeTaskStatus,
    startEditing,
    cancelEditing,
    saveEditing,
    deleteTask,
    clearActionError,
  };
}
