import { connection } from "../config/Databse.js";

const authRepositorie = {
  criarCodigo: async (userId, hashCode, expirationDate) => {
    const sql = `INSERT INTO autenticacao (UUID, userId, hashCode, isvalid, expirationDate) VALUES (UUID(), ?, ?, 1, ?)`;
    const values = [userId, hashCode, expirationDate];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  buscarCodigoValido: async userId => {
    const sql = `SELECT * FROM autenticacao WHERE userId = ? AND isvalid = 1 ORDER BY dataCad DESC LIMIT 1`;
    const [rows] = await connection.execute(sql, [userId]);
    return rows;
  },

  validarCodigo: async hashCode => {
    const sql = `UPDATE autenticacao SET isvalid = 0 WHERE hashCode = ?`;
    const values = [hashCode];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  invalidarCodigos: async userId => {
    const sql = `UPDATE autenticacao SET isvalid = 0 WHERE userId = ? AND isvalid = 1`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  alterarSenha: async (userId, novaSenha) => {
    const sql = `UPDATE usuarios SET password_hash = ? WHERE UUID = ?`;
    const [result] = await connection.execute(sql, [novaSenha, userId]);
    return result;
  },
};

export default authRepositorie;
