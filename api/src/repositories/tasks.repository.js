import { randomUUID } from "node:crypto";
import { connection } from "../config/Database.js";

const PONTOS_POR_PRIORIDADE = { baixa: 5, media: 10, alta: 20 };

function pontosDe(prioridade) {
  return PONTOS_POR_PRIORIDADE[String(prioridade ?? "").toLowerCase()] ?? 0;
}

function hojeKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

function chaveData(dataTarefa) {
  if (dataTarefa instanceof Date && !Number.isNaN(dataTarefa.getTime())) {
    const m = String(dataTarefa.getMonth() + 1).padStart(2, "0");
    const dia = String(dataTarefa.getDate()).padStart(2, "0");
    return `${dataTarefa.getFullYear()}-${m}-${dia}`;
  }
  return String(dataTarefa).slice(0, 10);
}

function comAtraso(dataTarefa, status) {
  if (!dataTarefa || status === "Concluida") return status;
  return chaveData(dataTarefa) < hojeKey() ? "Pendente" : status;
}

function diaAnterior(chave) {
  const d = new Date(chave + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return chaveData(d);
}

function proximaData(dataTarefa, recorrencia) {
  const r = String(recorrencia ?? "").toLowerCase();
  if (r === "unica") return null;
  const [ano, mes, dia] = chaveData(dataTarefa).split("-").map(Number);
  if (!ano || !mes || !dia) return null;
  const base = new Date(ano, mes - 1, dia, 12);
  if (r === "diaria") base.setDate(base.getDate() + 1);
  else if (r === "semanal") base.setDate(base.getDate() + 7);
  else if (r === "mensal") base.setMonth(base.getMonth() + 1);
  else return null;
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return `${base.getFullYear()}-${m}-${d}`;
}

async function criarProxima(tarefa) {
  const recorrencia = tarefa?.recorrencia ?? "Unica";
  if (String(recorrencia).toLowerCase() === "unica") return null;
  const data = proximaData(tarefa.dataTarefa, recorrencia);
  if (!data) return null;
  await connection.execute(
    `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, DataConclusao, prioridade, status, recorrencia) VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'Em andamento', ?)`,
    [tarefa.userId, tarefa.nome, tarefa.descricao ?? "", data, data, tarefa.prioridade, recorrencia],
  );
  return { dataTarefa: data, recorrencia };
}

async function buscarPorId(id) {
  const [rows] = await connection.execute(`SELECT * FROM tarefas WHERE UUID = ?`, [id]);
  return rows[0] ?? null;
}

const tasksRepositories = {
  garantirEstrutura: async () => {},

  atualizarTarefasAtrasadas: async () => {
    await connection.execute(
      `UPDATE tarefas SET status = 'Pendente' WHERE DATE(dataTarefa) < CURDATE() AND status NOT IN ('Concluida', 'Pendente')`,
    );
  },

  listarTasks: async () => {
    const [rows] = await connection.execute(`SELECT * FROM tarefas`);
    return rows;
  },

  listarUserTask: async (userId) => {
    const [rows] = await connection.execute(`SELECT * FROM tarefas WHERE userId = ?`, [userId]);
    return rows;
  },

  listarUserTarefasAtrasadas: async (userId) => {
    const [rows] = await connection.execute(
      `SELECT * FROM tarefas WHERE userId = ? AND DATE(dataTarefa) < CURDATE() AND status != 'Concluida' ORDER BY dataTarefa ASC`,
      [userId],
    );
    return rows;
  },

  listarTask: async (id) => {
    const [rows] = await connection.execute(`SELECT * FROM tarefas WHERE UUID = ?`, [id]);
    return rows;
  },

  obterOfensiva: async (userId) => {
    const [rows] = await connection.execute(
      `SELECT DISTINCT DATE(DataConclusao) AS dia FROM tarefas WHERE userId = ? AND status = 'Concluida' ORDER BY dia DESC`,
      [userId],
    );
    const hoje = hojeKey();
    const dias = rows
      .map((r) => chaveData(r.dia))
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= hoje);
    if (!dias.length) return 0;
    if (dias[0] !== hoje && dias[0] !== diaAnterior(hoje)) return 0;
    let streak = 1;
    for (let i = 1; i < dias.length; i++) {
      if (dias[i] === diaAnterior(dias[i - 1])) streak++;
      else break;
    }
    return streak;
  },

  obterPontosUsuario: async (userId) => {
    const [rows] = await connection.execute(
      `SELECT COALESCE(SUM(p.pontos), 0) AS totalPontos FROM tarefas t LEFT JOIN pontos p ON p.tarefaId = t.UUID WHERE t.userId = ?`,
      [userId],
    );
    return rows[0]?.totalPontos ?? 0;
  },

  listarRanking: async () => {
    const [rows] = await connection.execute(
      `SELECT u.UUID, u.nome, COALESCE(SUM(p.pontos), 0) AS totalPontos FROM usuarios u LEFT JOIN tarefas t ON t.userId = u.UUID LEFT JOIN pontos p ON p.tarefaId = t.UUID GROUP BY u.UUID, u.nome ORDER BY totalPontos DESC`,
    );
    return rows;
  },

  criarTask: async (task) => {
    const id = randomUUID();
    const status = comAtraso(task.dataTarefa, task.status);
    const recorrencia = task.recorrencia ?? "Unica";
    const concluida = status === "Concluida";
    await connection.execute(
      `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, DataConclusao, prioridade, status, recorrencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, task.userId, task.nome, task.descricao, task.dataTarefa, concluida ? new Date() : task.dataTarefa, task.prioridade, status, recorrencia],
    );
    if (concluida) {
      await tasksRepositories.adicionarPontos(task.userId, id, pontosDe(task.prioridade));
    }
    return { insertId: id };
  },

  atualizarTask: async (id, task) => {
    const atual = await buscarPorId(id);
    if (!atual) throw new Error("Tarefa nao encontrada");
    const status = comAtraso(task.dataTarefa, task.status);
    const recorrencia = task.recorrencia ?? atual.recorrencia ?? "Unica";
    const virouConcluida = atual.status !== "Concluida" && status === "Concluida";
    if (virouConcluida) {
      await tasksRepositories.adicionarPontos(atual.userId, id, pontosDe(task.prioridade));
    }
    const dataConclusao = virouConcluida ? new Date() : (atual.DataConclusao ?? atual.dataConclusao ?? task.dataTarefa);
    const [result] = await connection.execute(
      `UPDATE tarefas SET nome = ?, descricao = ?, dataTarefa = ?, prioridade = ?, status = ?, recorrencia = ?, DataConclusao = ? WHERE UUID = ?`,
      [task.nome, task.descricao, task.dataTarefa, task.prioridade, status, recorrencia, dataConclusao, id],
    );
    const proximaTarefa = virouConcluida
      ? await criarProxima({ ...atual, ...task, recorrencia })
      : null;
    return { ...result, proximaTarefa };
  },

  concluirTask: async (id) => {
    const atual = await buscarPorId(id);
    if (!atual) throw new Error("Tarefa nao encontrada");
    const concluindo = atual.status !== "Concluida";
    if (concluindo) {
      await tasksRepositories.adicionarPontos(atual.userId, id, pontosDe(atual.prioridade));
    } else {
      await tasksRepositories.removerPontos(id);
    }
    const dataConclusao = concluindo ? new Date() : (atual.DataConclusao ?? atual.dataConclusao ?? atual.dataTarefa);
    const [result] = await connection.execute(
      `UPDATE tarefas SET status = ?, DataConclusao = ? WHERE UUID = ?`,
      [concluindo ? "Concluida" : "Em andamento", dataConclusao, id],
    );
    const proximaTarefa = concluindo ? await criarProxima(atual) : null;
    return { ...result, proximaTarefa };
  },

  deletarTask: async (id) => {
    await connection.execute(`DELETE FROM pontos WHERE tarefaId = ?`, [id]);
    const [rows] = await connection.execute(`DELETE FROM tarefas WHERE UUID = ?`, [id]);
    return rows;
  },

  adicionarPontos: async (userId, tarefaId, pontos) => {
    const [rows] = await connection.execute(
      `INSERT INTO pontos (UUID, tarefaId, pontos, dataCad) VALUES (UUID(), ?, ?, NOW())`,
      [tarefaId, pontos],
    );
    return rows;
  },

  removerPontos: async (tarefaId) => {
    const [rows] = await connection.execute(`DELETE FROM pontos WHERE tarefaId = ?`, [tarefaId]);
    return rows;
  },
};

export default tasksRepositories;
