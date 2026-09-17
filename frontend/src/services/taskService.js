import tarefas from "../../../data/tarefas.json";

export async function getAllTasks() {
  return tarefas;
}

export async function getTasksByUser(userId) {
  return tarefas.filter((t) => t.userId === userId);
}
