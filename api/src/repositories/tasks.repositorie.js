import { connection } from "../config/Databse.js";
import { statusEnum } from "../enum/database.enum.js";

const PONTOS_POR_PRIORIDADE = {
  baixa: 5,
  media: 10,
  alta: 20,
};

function hojeKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

// Regra: tarefa atrasada (prazo antes de hoje) e não concluída vira Pendente.
async function marcarAtrasadasComoPendentes() {
  const sql = `UPDATE tarefas SET status = 'Pendente' WHERE DATE(dataTarefa) < CURDATE() AND status != 'Concluida' AND status != 'Pendente'`;
  await connection.execute(sql);
}

function aplicarStatusAtraso(dataTarefa, status) {
  if (!dataTarefa || status === "Concluida") return status;
  const chave = String(dataTarefa).slice(0, 10);
  return chave < hojeKey() ? "Pendente" : status;
}

const tasksRepositories = {
  // Troca para Pendente todas as tarefas atrasadas e não concluídas.
  // Chame ela sempre antes de listar.
  atualizarTarefasAtrasadas: async () => {
    await marcarAtrasadasComoPendentes();
  },

  listarTasks: async () => {
    const sql = `SELECT * FROM tarefas;`;
    const [rows] = await connection.execute(sql);
    return rows;
  },

  // Conta a quantidade de dias em que o usuário concluiu pelo menos uma tarefa.
  // DISTINCT evita contar várias tarefas realizadas no mesmo dia mais de uma vez.
  obterOfensiva: async (userId) => {
    const sql = `
      SELECT COUNT(*) AS totalDias
      FROM (
        SELECT DISTINCT dataTarefa
        FROM tarefas
        WHERE userId = ? AND status = 'Concluida'
      ) AS dias;
    `;
    
    const [rows] = await connection.execute(sql, [userId]);
    return rows[0]?.totalDias || 0;
  },

  listarUserTask: async userId => {
    const sql = `SELECT * FROM tarefas WHERE userId = ?;`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  listarTask: async tarefaUUID => {
    const sql = `SELECT * FROM tarefas WHERE UUID = ?;`;
    const values = [tarefaUUID];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  criarTask: async task => {
    const statusFinal = aplicarStatusAtraso(task.dataTarefa, task.status);
    const sql = `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, prioridade, status) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`;
    const values = [task.userId, task.nome, task.descricao, task.dataTarefa, task.prioridade, statusFinal];

    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  atualizarTask: async (id, task) => {
    const [tarefaAtual] = await connection.execute(`SELECT status, prioridade, userId FROM tarefas WHERE UUID = ?`, [id]);

    if (tarefaAtual.length === 0) {
      throw new Error("Tarefa nao encontrada");
    }

    const statusAnterior = tarefaAtual[0]?.status;
    const statusFinal = aplicarStatusAtraso(task.dataTarefa, task.status);
    if (statusAnterior !== "Concluida" && statusFinal === "Concluida") {
      const pontos = PONTOS_POR_PRIORIDADE[task.prioridade?.toLowerCase()] ?? 0;
      await tasksRepositories.adicionarPontos(tarefaAtual[0].userId, id, pontos);
    }

    const sql = `UPDATE tarefas SET nome = ?, descricao = ?, dataTarefa = ?, prioridade = ?, status = ? WHERE UUID = ?`;
    const values = [task.nome, task.descricao, task.dataTarefa, task.prioridade, statusFinal, id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  concluirTask: async idTask => {
    const [tarefaAtual] = await connection.execute(`SELECT status, prioridade, userId FROM tarefas WHERE UUID = ?`,[idTask]);

    if (tarefaAtual.length === 0) {
      throw new Error("Tarefa nao encontrada");
    }

    const statusAnterior = tarefaAtual[0]?.status;
    const novoStatus = statusAnterior === "Concluida" ? "Em andamento" : "Concluida";

    if (novoStatus === "Concluida") {
      const prioridade = tarefaAtual[0]?.prioridade;
      const pontos = PONTOS_POR_PRIORIDADE[prioridade?.toLowerCase()] ?? 0;
      await tasksRepositories.adicionarPontos(tarefaAtual[0].userId, idTask, pontos);
    } else {
      await tasksRepositories.removerPontos(idTask);
    }

    const sql = `UPDATE tarefas SET status = ? WHERE UUID = ?`;
    const [rows] = await connection.execute(sql, [novoStatus, idTask]);
    return rows;
  },

  deletarTask: async id => {
    const sql = `DELETE FROM tarefas WHERE UUID = ?`;
    const [rows] = await connection.execute(sql, [id]);
    return rows;
  },

  adicionarPontos: async (userId, tarefaId, pontos) => {
    const sql = `INSERT INTO pontos (UUID, tarefaId, pontos, dataCad) VALUES (UUID(), ?, ?, NOW())`;
    const values = [tarefaId, pontos];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  removerPontos: async tarefaId => {
    const sql = `DELETE FROM pontos WHERE tarefaId = ?`;
    const [rows] = await connection.execute(sql, [tarefaId]);
    return rows;
  },

  listarRanking: async () => {
    const sql = `
      SELECT u.UUID, u.nome, COALESCE(SUM(p.pontos), 0) AS totalPontos
      FROM usuarios u
      LEFT JOIN tarefas t ON t.userId = u.UUID
      LEFT JOIN pontos p ON p.tarefaId = t.UUID
      GROUP BY u.UUID, u.nome
      ORDER BY totalPontos DESC;
    `;
    const [rows] = await connection.execute(sql);
    return rows;
  }
};

export default tasksRepositories;