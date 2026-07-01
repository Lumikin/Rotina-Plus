import { connection } from "../config/Databse.js";

const usersRepository = {
  listarUsuarios: async () => {
    const sql = `SELECT clienteId, Nome, email, Data_Nascimento FROM users`;
    const [rows] = await connection.execute(sql);
    return rows;
  },
  listarIDUsuarios: async (id) => {
    const sql = `SELECT Nome, email, Data_Nascimento,role FROM users WHERE clienteId = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  buscarUsuarioPorId: async (id) => {
    const sql = `SELECT Nome, email, Data_Nascimento, password_hash FROM users WHERE clienteId = ?`;
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
  promoverAdmin: async (id) => {
    const sql = `UPDATE users SET role = 'admin' WHERE clienteId = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  criarUsuarios: async (user) => {
    const sql = `INSERT INTO users (nome, email, password_hash, data_nascimento) VALUES (?, ?, ?, ?)`;
    const values = [user.nome, user.email, user.senha, user.dataNascimento];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarUsuario: async (id, user) => {
    const sql = `UPDATE users SET Nome = ?, email = ?, password_hash = ? WHERE clienteId = ?`;
    const values = [user.nome, user.email, user.senha, id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  deletarUsuario: async (id) => {
    const sql = `DELETE FROM users WHERE clienteId = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
};

export default usersRepository;
