import { Users } from "../model/Users.js";
import { connection } from "../config/Databse.js";

const usersRepository = {
  listarUsuarios: async () => {
    const sql = `SELECT * FROM clientes`;
    const [rows] = await connection.execute(sql);
    return rows;
  },
  listarIDUsuarios: async (id) => {
    const sql = `SELECT * FROM clientes WHERE idCliente = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  listarUserEmail: async (email) => {
    const sql = `SELECT * FROM clientes WHERE email = ?`;
    const values = [email];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  criarUsuarios: async (user) => {
    const sql = `INSERT INTO clientes (nome, email, password_hash, data_nascimento) VALUES (?, ?, ?, ?)`;
    const values = [user.nome, user.email, user.senha, user.dataNascimento];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarUsuario: async (id, user) => {
    const sql = `UPDATE clientes SET nome = ?, email = ?, password_hash = ?, data_nascimento = ? WHERE idCliente = ?`;
    const values = [user.nome, user.email, user.senha, user.dataNascimento, id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  deletarUsuario: async (id) => {
    const sql = `DELETE FROM clientes WHERE idCliente = ?`;
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
};

export default usersRepository;
