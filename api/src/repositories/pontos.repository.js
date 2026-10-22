import { connection } from "../config/Database.js";

const pontosRepository = {
  obterPontosUsuario: async (userId) => {
    const sql = `SELECT COALESCE(SUM(p.pontos), 0) AS totalPontos FROM tarefas t LEFT JOIN pontos p ON p.tarefaId = t.UUID WHERE t.userId = ?`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  listarRanking: async () => {
    const sql = `SELECT u.UUID, u.nome, COALESCE(SUM(p.pontos), 0) AS totalPontos FROM usuarios u LEFT JOIN tarefas t ON t.userId = u.UUID LEFT JOIN pontos p ON p.tarefaId = t.UUID GROUP BY u.UUID, u.nome ORDER BY totalPontos DESC`;
    const [rows] = await connection.execute(sql);
    return rows;
  },

  adicionarPontos: async (tarefaId, pontos) => {
    const sql = `INSERT INTO pontos (UUID, tarefaId, pontos, dataCad) VALUES (UUID(), ?, ?, NOW())`;
    const values = [tarefaId, pontos];
    const [result] = await connection.execute(sql, values);
    return result;
  },

  removerPontos: async (tarefaId) => {
    const sql = `DELETE FROM pontos WHERE tarefaId = ?`;
    const values = [tarefaId];
    const [result] = await connection.execute(sql, values);
    return result;
  },
};

export default pontosRepository;
