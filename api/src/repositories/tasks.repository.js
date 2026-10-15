import { connection } from "../config/Database.js";

const tasksRepositories = {
  atualizarTarefasAtrasadas: async () => {
    const sql = `UPDATE tarefas SET status = 'Pendente' WHERE DATE(dataTarefa) < CURDATE() AND status NOT IN ('Concluida', 'Pendente')`;
    const [result] = await connection.execute(sql);
    return result;
  },

  listarTasks: async () => {
    const sql = `SELECT * FROM tarefas`;
    const [rows] = await connection.execute(sql);
    return rows;
  },

  listarUserTask: async (userId) => {
    const sql = `SELECT * FROM tarefas WHERE userId = ?`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  listarUserTarefasAtrasadas: async (userId) => {
    const sql = `SELECT * FROM tarefas WHERE userId = ? AND DATE(dataTarefa) < CURDATE() AND status != 'Concluida' ORDER BY dataTarefa ASC`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  listarTask: async (id) => {
    const sql = `SELECT * FROM tarefas WHERE UUID = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  listarDiasConclusao: async (userId) => {
    const sql = `SELECT DISTINCT DATE(DataConclusao) AS dia FROM tarefas WHERE userId = ? AND status = 'Concluida' ORDER BY dia DESC`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  inserirTask: async (id, userId, nome, descricao, dataTarefa, dataConclusao, prioridade, status, recorrencia) => {
    const sql = `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, DataConclusao, prioridade, status, recorrencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [id, userId, nome, descricao, dataTarefa, dataConclusao, prioridade, status, recorrencia];
    const [result] = await connection.execute(sql, values);
    return result;
  },

  inserirProximaOcorrencia: async (userId, nome, descricao, data, prioridade, recorrencia) => {
    const sql = `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, DataConclusao, prioridade, status, recorrencia) VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'Em andamento', ?)`;
    const values = [userId, nome, descricao, data, data, prioridade, recorrencia];
    const [result] = await connection.execute(sql, values);
    return result;
  },

  atualizarTaskDados: async (id, nome, descricao, dataTarefa, prioridade, status, recorrencia, dataConclusao) => {
    const sql = `UPDATE tarefas SET nome = ?, descricao = ?, dataTarefa = ?, prioridade = ?, status = ?, recorrencia = ?, DataConclusao = ? WHERE UUID = ?`;
    const values = [nome, descricao, dataTarefa, prioridade, status, recorrencia, dataConclusao, id];
    const [result] = await connection.execute(sql, values);
    return result;
  },

  atualizarStatusConclusao: async (id, status, dataConclusao) => {
    const sql = `UPDATE tarefas SET status = ?, DataConclusao = ? WHERE UUID = ?`;
    const values = [status, dataConclusao, id];
    const [result] = await connection.execute(sql, values);
    return result;
  },

  deletarTask: async (id) => {
    const sql = `DELETE FROM tarefas WHERE UUID = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
};

export default tasksRepositories;
