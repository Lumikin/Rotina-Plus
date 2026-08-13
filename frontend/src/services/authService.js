import { api_rotinaplus } from "./api";

export async function loginUser(email, senha) {
  try {
    const response = await api_rotinaplus.post("/auth/login", {
      email: email,
      senha: senha,
    });

    return response.data;

  } catch (error) {
    console.error("Erro ao fazer login: ", error);
    throw error; // Força o erro em vez de retornar uma array vazia
  }
};

export async function registerUser(email, senha, nome, dataN) {
  try {
    const response = await api_rotinaplus.post("/auth/register", {
      nome: nome,
      email: email,
      senha: senha,
      dataNascimento: dataN,
    });

    return response.data;

  } catch (error) {
    console.error("Erro ao cadastrar o usuário: ", error);
    return [];
  }
};