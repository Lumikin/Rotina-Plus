import { api_rotinaplus } from "./api";

async function executar(promise, fallback) {
  try {
    const response = await promise;
    return response.data;
  } catch {
    return fallback;
  }
}

export async function listarTasks() {
  const data = await executar(api_rotinaplus.get("/api/tasks"), null);
  return data?.result ?? [];
}

// Lista as tarefas atrasadas de um usuário (GET /tasks/atrasadas/:userId)
export async function listarTarefasAtrasadas(userId) {
  try {
    const response = await api_rotinaplus.get(`/api/tasks/atrasadas/${userId}`);
    return response.data?.result ?? [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Erro ao listar tarefas atrasadas:", error);
    return [];
  }
}

// Lista as tarefas de um usuário específico (GET /tasks/:userId)
export async function listarTarefasUsuario(userId) {
  const data = await executar(api_rotinaplus.get(`/api/tasks/${userId}`), null);
  return data?.response ?? [];
}

export async function criarTask(taskData) {
  const data = await executar(api_rotinaplus.post("/api/tasks", taskData), null);
  return data ?? null;
}

export async function atualizarTask(id, taskData) {
  const data = await executar(api_rotinaplus.put(`/api/tasks/${id}`, taskData), null);
  return data ?? null;
}

export async function concluirTask(id) {
  const data = await executar(api_rotinaplus.put(`/api/tasks/${id}/concluir`), null);
  return data ?? null;
}

export async function deletarTask(id) {
  const data = await executar(api_rotinaplus.delete(`/api/tasks/${id}`), null);
  return data ?? null;
}

export async function obterPontosUsuario(userId) {
  const data = await executar(api_rotinaplus.get(`/api/tasks/pontos/${userId}`), null);
  return data?.totalPontos ?? 0;
}

export async function obterOfensivaUsuario(userId) {
  const data = await executar(api_rotinaplus.get(`/api/tasks/ofensiva/${userId}`), null);
  return data?.totalDias ?? 0;
}

export async function obterRanking() {
  const data = await executar(api_rotinaplus.get("/api/tasks/ranking"), null);
  return data?.result ?? [];
}

// Usado pelo Dashboard antigo, manter por compatibilidade.
export const getAllTasks = listarTasks;
export const getTasksByUser = listarTarefasUsuario;
