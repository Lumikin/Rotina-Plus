import { connection } from "../config/Databse.js";

const authRepositorie = {
  criarCodigo: async (userId, hashCode, expirationDate) => {
    const sql = `INSERT INTO autentication (userId, hashCode, isvalid, expiration_date) VALUES (?, ?, 1, ?)`;
    const values = [userId, hashCode, expirationDate];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  buscarCodigoValido: async userId => {
    const sql = `SELECT * FROM autentication WHERE userId = ? AND isvalid = 1 ORDER BY dataCad DESC LIMIT 1`;
    const [rows] = await connection.execute(sql, [userId]);
    return rows;
  },

  validarCodigo: async hashCode => {
    const sql = `UPDATE autentication SET isvalid = 0 WHERE hashCode = ?`;
    const values = [hashCode];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  invalidarCodigos: async userId => {
    const sql = `UPDATE autentication SET isvalid = 0 WHERE userId = ? AND isvalid = 1`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarSenha: async (userId, novaSenha) => {
    const [result] = await pool.execute(
      `UPDATE users
       SET password_hash = ?
       WHERE userId = ?`,
      [novaSenha, userId],
    );

    return result;
  },
};
export default authRepositorie;
