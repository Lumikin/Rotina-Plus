import { connection } from "../config/Databse.js";

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

  listarUserTask: async userId => {
    const sql = `SELECT * FROM tarefas WHERE userId = ?;`;
    const [rows] = await connection.execute(sql, [userId]);
    return rows;
  },

  listarTask: async tarefaUUID => {
    const sql = `SELECT * FROM tarefas WHERE UUID = ?;`;
    const [rows] = await connection.execute(sql, [tarefaUUID]);
    return rows;
  },

  criarTask: async task => {
    const sql = `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, prioridade, status) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`;
    const values = [
      task.userId,
      task.nome,
      task.descricao,
      task.dataTarefa,
      task.prioridade,
      task.status,
    ];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  atualizarTask: async (id, task) => {
    const [tarefaAtual] = await connection.execute(
      `SELECT status, prioridade, userId FROM tarefas WHERE UUID = ?`,
      [id]
    );

    const sql = `UPDATE tarefas SET nome = ?, descricao = ?, dataTarefa = ?, prioridade = ?, status = ? WHERE UUID = ?`;
    const values = [
      task.nome,
      task.descricao,
      task.dataTarefa,
      task.prioridade,
      task.status,
      id,
    ];
    const [rows] = await connection.execute(sql, values);

    const statusAnterior = tarefaAtual[0]?.status;
    if (statusAnterior !== "Concluida" && task.status === "Concluida") {
      const pontos = PONTOS_POR_PRIORIDADE[task.prioridade?.toLowerCase()] ?? 0;
      await tasksRepositories.adicionarPontos(tarefaAtual[0].userId, id, pontos);
    }

    return rows;
  },

  deletarTask: async id => {
    const sql = `DELETE FROM tarefas WHERE UUID = ?`;
    const [rows] = await connection.execute(sql, [id]);
    return rows;
  },

  adicionarPontos: async (userId, tarefaId, pontos) => {
    const sql = `INSERT INTO pontos (UUID, tarefaId, pontos, dataCad) VALUES (UUID(), ?, ?, NOW())`;
    const [rows] = await connection.execute(sql, [tarefaId, pontos]);
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
  },
};

export default tasksRepositories;
