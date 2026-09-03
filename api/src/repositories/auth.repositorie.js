import { connection } from "../config/Databse.js";

const authRepositorie = {
  criar: async (userId, token, expirationDate) => {
    const sql = `INSERT INTO autentication (userId, token, isvalid, expiration_date) VALUES (?, ?, 0, ?)`;
    const values = [userId, token, expirationDate];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  buscarPorToken: async token => {
    const sql = `SELECT * FROM autentication WHERE token = ?`;
    const values = [token];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  validarToken: async token => {
    const sql = `UPDATE autentication SET isvalid = 1 WHERE token = ?`;
    const values = [token];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  invalidarTokensAnteriores: async userId => {
    const sql = `UPDATE autentication SET isvalid = 0 WHERE userId = ? AND isvalid = 0`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarSenhaltera: async (userId, novaSenha) => {
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
