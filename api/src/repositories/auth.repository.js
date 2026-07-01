export const authRepositorie = {
  criarUsuarios: async (user) => {
    const sql = `INSERT INTO clientes (nome, email, password_hash, data_nascimento) VALUES (?, ?, ?, ?)`;
    const values = [user.nome, user.email, user.senha, user.dataNascimento];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
};
