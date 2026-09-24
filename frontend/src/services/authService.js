import { api_rotinaplus } from "./api";

const TOKEN_KEY = "token";

// Retorna o token JWT salvo (ou null)
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Verifica se há um token salvo
export function isAuthenticated() {
  return Boolean(getToken());
}

// Remove o token (logout)
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

// Faz login (POST /auth/login) e guarda o token JWT no localStorage
export async function loginUser(email, senha) {
  try {
    const response = await api_rotinaplus.post("/auth/login", { email, senha });
    const data = response.data;

    // Ajuste aqui se o backend usar outro nome para o campo do token
    const token = data.token ?? data.accessToken ?? data.jwt;

    if (!token) {
      return {
        success: false,
        message: "Resposta inválida do servidor: token não encontrado.",
      };
    }

    localStorage.setItem(TOKEN_KEY, token);

    return { success: true, token, message: data.message };
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Email ou senha incorretos.",
    };
  }
}
