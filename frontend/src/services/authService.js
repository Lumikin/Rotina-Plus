import { api_rotinaplus } from "./api";

export async function loginUser(email, senha) {
  try {
    const response = await api_rotinaplus.post("/auth/login", {
      email: email,
      senha: senha,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de pessoas: ", error);
    return [];
  }
}
