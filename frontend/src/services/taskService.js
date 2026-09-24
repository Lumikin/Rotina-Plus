import { api_rotinaplus } from "./api";

// Lista todas as tarefas (GET /tasks)
export async function listarTasks() {
  try {
    const response = await api_rotinaplus.get("/api/tasks");
    return response.data.result;
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }

    console.error("Erro ao listar tarefas:", error);
    return [];
  }
}

// Lista as tarefas de um usuário específico (GET /tasks/:userId)
export async function listarTarefasUsuario(userId) {
  try {
    const response = await api_rotinaplus.get(`/api/tasks/${userId}`);
    return response.data.response ?? [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }

    console.error("Erro ao listar tarefas do usuário:", error);
    return [];
  }
}

// Cria uma nova tarefa (POST /tasks)
export async function criarTask(taskData) {
  try {
    const response = await api_rotinaplus.post("/api/tasks", taskData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return null;
  }
}

// Atualiza uma tarefa existente (PUT /tasks/:id)
export async function atualizarTask(id, taskData) {
  try {
    const response = await api_rotinaplus.put(`/api/tasks/${id}`, taskData);

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    return null;
  }
}

// Conclui uma tarefa (PUT /tasks/:UUID/concluir)
export async function concluirTask(id) {
  try {
    const response = await api_rotinaplus.put(`/api/tasks/${id}/concluir`);
    return response.data;
  } catch (error) {
    console.error("Erro ao concluir tarefa:", error);
    return null;
  }
}

// Exclui uma tarefa (DELETE /tasks/:id)
export async function deletarTask(id) {
  try {
    const response = await api_rotinaplus.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    return null;
  }
}
