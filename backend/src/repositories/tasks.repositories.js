import { connection } from "../config/Databse.js";

const tasksRepositories = {
  listarTasks: async () => {
    const sql = `SELECT * FROM tarefas;`;
    const values = [];
    const [rows] = await connection.execute(sql);
    return rows;
  },
  listarUserTask: async (Userid) => {
    const sql = `SELECT * FROM tarefas WHERE clienteId = ?;`;
    const values = [Userid];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  listarTask: async (tarefaID) => {
    const sql = `SELECT * FROM tarefas WHERE clienteId = ?;`;
    const values = [tarefaID];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  criarTask: async (task) => {
    const sql = `INSERT INTO tarefas (clienteId, Nome, descricao, DataTarefa ,Prioridade, Status) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      task.clienteId,
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
    const sql = `UPDATE tarefas SET clienteId = ?, Nome = ?, descricao = ?, DataTarefa = ?, Prioridade = ?, Status = ? WHERE tarefaID = ?`;
    const values = [
      task.clienteId,
      task.nome,
      task.descricao,
      task.dataTarefa,
      task.prioridade,
      task.status,
      id,
    ];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  deletarTask: async (id) => {
    const sql = `UPDATE tarefas SET Status = 'Deletada' WHERE tarefaID = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
};
export default tasksRepositories;
