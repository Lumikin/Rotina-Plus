import { connection } from "../config/Databse.js";

const usersRepository = {
  listarUsuarios: async () => {
    const sql = `SELECT UUID, nome, email, dataNascimento FROM usuarios`;
    const [rows] = await connection.execute(sql);
    return rows;
  },
  listarIDUsuarios: async id => {
    const sql = `SELECT nome, email, dataNascimento FROM usuarios WHERE UUID = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  buscarUsuarioPorId: async id => {
    const sql = `SELECT nome, email, dataNascimento, password_hash FROM usuarios WHERE UUID = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  listarUserEmail: async email => {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    const values = [email];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  criarUsuarios: async user => {
    const sql = `INSERT INTO usuarios (UUID, nome, email, password_hash, dataNascimento) VALUES (UUID(), ?, ?, ?, ?)`;
    const values = [user.nome, user.email, user.senha, user.dataNascimento];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarUsuario: async (id, user) => {
    const sql = `UPDATE usuarios SET nome = ?, email = ?, password_hash = ? WHERE UUID = ?`;
    const values = [user.nome, user.email, user.senha, id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  deletarUsuario: async id => {
    const sql = `DELETE FROM usuarios WHERE UUID = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
};

export default usersRepository;
