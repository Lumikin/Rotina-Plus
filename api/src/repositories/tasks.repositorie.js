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

  listarTask: async tarefaID => {
    const sql = `SELECT * FROM tarefas WHERE tarefaID = ?;`;
    const [rows] = await connection.execute(sql, [tarefaID]);
    return rows;
  },

  criarTask: async task => {
    const sql = `INSERT INTO tarefas (userId, Nome, descricao, DataTarefa, Prioridade, Status) VALUES (?, ?, ?, ?, ?, ?)`;
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
    // Busca status anterior para não pontuar 2x
    const [tarefaAtual] = await connection.execute(
      `SELECT Status, Prioridade, userId FROM tarefas WHERE tarefaID = ?`,
      [id]
    );

    const sql = `UPDATE tarefas SET Nome = ?, descricao = ?, DataTarefa = ?, Prioridade = ?, Status = ? WHERE tarefaID = ?`;
    const values = [
      task.nome,
      task.descricao,
      task.dataTarefa,
      task.prioridade,
      task.status,
      id,
    ];
    const [rows] = await connection.execute(sql, values);

    // Se mudou de "não concluída" para "concluida", soma pontos
    const statusAnterior = tarefaAtual[0]?.Status;
    if (statusAnterior !== "concluida" && task.status === "concluida") {
      const pontos = PONTOS_POR_PRIORIDADE[task.prioridade?.toLowerCase()] ?? 0;
      await tasksRepositories.adicionarPontos(tarefaAtual[0].userId, pontos);
    }

    return rows;
  },

  deletarTask: async id => {
    const sql = `DELETE FROM tarefas WHERE tarefaID = ?`;
    const [rows] = await connection.execute(sql, [id]);
    return rows;
  },

  adicionarPontos: async (userId, pontos) => {
    const sql = `UPDATE usuarios SET pontos = pontos + ? WHERE id = ?`;
    const [rows] = await connection.execute(sql, [pontos, userId]);
    return rows;
  },

  listarRanking: async () => {
    const sql = `SELECT id, nome, pontos FROM usuarios ORDER BY pontos DESC;`;
    const [rows] = await connection.execute(sql);
    return rows;
  },
};

export default tasksRepositories;