import {connection} from "../config/Databse.js";

const usersRepository = {
  listarUsuarios: async () => {
    const sql = `SELECT userId, nome, email, dataNascimento FROM users`;
    const [rows] = await connection.execute(sql);
    return rows;
  },
  listarIDUsuarios: async (id) => {
    const sql = `SELECT nome, email, dataNascimento,role FROM users WHERE userId = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  buscarUsuarioPorId: async (id) => {
    const sql = `SELECT nome, email, dataNascimento, password_hash FROM users WHERE userId = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  listarUserEmail: async (email) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const values = [email];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  criarUsuarios: async (user) => {
    const sql = `INSERT INTO users (nome, email, password_hash, dataNascimento) VALUES (?, ?, ?, ?)`;
    const values = [user.nome, user.email, user.senha, user.dataNascimento];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarUsuario: async (id, user) => {
    const sql = `UPDATE users SET nome = ?, email = ?, password_hash = ? WHERE userId = ?`;
    const values = [user.nome, user.email, user.senha, id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  deletarUsuario: async (id) => {
    const sql = `DELETE FROM users WHERE userId = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
};

export default usersRepository;
