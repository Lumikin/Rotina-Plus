import { api_rotinaPlus } from "./api";

export async function ApiLogin(email, senha) {
  try {
    const response = await api_rotinaPlus.post("/auth/login", {
      email: email,
      senha: senha
    });

    return response.data;

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    
    return [];
  }
}