export const authRepositorie = {

alterarSenhaltera:  async (userId, novaSenha) => {
  const [result] = await pool.execute(
    `UPDATE users
     SET password_hash = ?
     WHERE userId = ?`,
    [novaSenha, userId]
  );

  return result;
}

};