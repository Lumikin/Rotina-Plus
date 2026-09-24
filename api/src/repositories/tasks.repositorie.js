import { connection } from "../config/Databse.js";
import { statusEnum } from "../enum/database.enum.js";

const PONTOS_POR_PRIORIDADE = {
  baixa: 5,
  media: 10,
  alta: 20,
};

const tasksRepositories = {
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
    const sql = `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, prioridade, status) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`;
    const values = [task.userId, task.nome, task.descricao, task.dataTarefa, task.prioridade, task.status];

    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  atualizarTask: async (id, task) => {
    const [tarefaAtual] = await connection.execute(`SELECT status, prioridade, userId FROM tarefas WHERE UUID = ?`, [id]);

    if (tarefaAtual.length === 0) {
      throw new Error("Tarefa nao encontrada");
    }

    const statusAnterior = tarefaAtual[0]?.status;
    if (statusAnterior !== "Concluida" && task.status === "Concluida") {
      const pontos = PONTOS_POR_PRIORIDADE[task.prioridade?.toLowerCase()] ?? 0;
      await tasksRepositories.adicionarPontos(tarefaAtual[0].userId, id, pontos);
    }

    const sql = `UPDATE tarefas SET nome = ?, descricao = ?, dataTarefa = ?, prioridade = ?, status = ? WHERE UUID = ?`;
    const values = [task.nome, task.descricao, task.dataTarefa, task.prioridade, task.status, id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  concluirTask: async idTask => {
    const [tarefaAtual] = await connection.execute(`SELECT status, prioridade, userId FROM tarefas WHERE UUID = ?`,[idTask]);

    if (tarefaAtual.length === 0) {
      throw new Error("Tarefa nao encontrada");
    }

    const statusAnterior = tarefaAtual[0]?.status;
    const novoStatus =
      statusAnterior === "Concluida" ? "Em andamento" : "Concluida";

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
    await connection.execute(`DELETE FROM pontos WHERE tarefaId = ?`, [id]);
    const sql = `DELETE FROM tarefas WHERE UUID = ?`;
    const [rows] = await connection.execute(sql, [id]);
    return rows;
  },

  listarTaskPontos: async (id) => {
    const sql = `SELECT * FROM pontos WHERE tarefaId = ?`;
    const [rows] = await connection.execute(sql, [id]);
    return rows;
  },
  
  adicionarPontos: async (userId, tarefaId, pontos) => {
    const sql = `INSERT INTO pontos (UUID, tarefaId, pontos) VALUES (UUID(), ?, ?)`;
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