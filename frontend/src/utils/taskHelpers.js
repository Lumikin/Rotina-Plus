export const PRIORIDADES = ["Baixa", "Media", "Alta"];

export const STATUS_OPCOES = ["Pendente", "Em andamento", "Concluida"];

export const STATUS_LABEL = {
  Pendente: "Pendente",
  "Em andamento": "Em andamento",
  Concluida: "Concluída",
};

export const VIEWS = {
  MINE: "mine",
  ALL: "all",
};

export const INITIAL_CREATE_FORM = Object.freeze({
  nome: "",
  descricao: "",
  dataTarefa: "",
  prioridade: "Media",
});

export const INITIAL_EDIT_FORM = Object.freeze({
  ...INITIAL_CREATE_FORM,
  status: "Pendente",
});

export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export function formatTaskDate(date) {
  if (!date) return "Sem prazo";
  const [year, month, day] = String(date).slice(0, 10).split("-");
  if (!year || !month || !day) return "Sem prazo";
  return `${day}/${month}/${year}`;
}

export function getStatusClass(status) {
  return String(status || "pendente")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export function getStatusLabel(status) {
  return STATUS_LABEL[status] ?? status ?? "Pendente";
}

export function buildEditForm(task) {
  return {
    nome: task.nome ?? "",
    descricao: task.descricao ?? "",
    dataTarefa: task.dataTarefa ? String(task.dataTarefa).slice(0, 10) : "",
    prioridade: task.prioridade ?? "Media",
    status: task.status ?? "Pendente",
  };
}

export function shouldUseConcluirEndpoint(statusAtual, novoStatus) {
  return (
    (statusAtual !== "Concluida" && novoStatus === "Concluida") ||
    (statusAtual === "Concluida" && novoStatus === "Em andamento")
  );
}

export function getTaskId(task) {
  return task.UUID;
}

export function extractErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}
