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

function toMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

// Faz login (POST /auth/login) e guarda o token JWT no localStorage
export async function loginUser(email, senha) {
  try {
    const response = await api_rotinaplus.post("/auth/login", { email, senha });
    const data = response.data;

    // O backend retorna { message, token }
    const token = data.token ?? data.accessToken ?? data.jwt;

    if (!token) {
      return { success: false, message: "Resposta inválida do servidor: token não encontrado." };
    }

    localStorage.setItem(TOKEN_KEY, token);

    return { success: true, token, message: data.message };
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    return {
      success: false,
      message: toMessage(error, "Email ou senha incorretos."),
    };
  }
}

// Cria a conta (POST /auth/register). O backend envia o código por e-mail.
export async function registerUser({ nome, email, senha, dataNascimento }) {
  try {
    const response = await api_rotinaplus.post("/auth/register", {
      nome,
      email,
      senha,
      dataNascimento,
    });

    return { success: true, message: response.data?.message || "Conta criada com sucesso!" };
  } catch (error) {
    console.error("Erro no cadastro:", error);

    return { success: false, message: toMessage(error, "Erro no cadastro") };
  }
}

// Valida o código de verificação (POST /auth/verify)
export async function verifyCode(email, code) {
  try {
    const response = await api_rotinaplus.post("/auth/verify", { email, code });

    return { success: true, message: response.data?.message || "Email verificado com sucesso!" };
  } catch (error) {
    console.error("Erro na verificação:", error);

    return { success: false, message: toMessage(error, "Erro na verificação do código") };
  }
}

// Reenvia o código de verificação (POST /auth/resend-email)
export async function resendCode(email) {
  try {
    const response = await api_rotinaplus.post("/auth/resend-email", { email });

    return { success: true, message: response.data?.message || "Código reenviado!" };
  } catch (error) {
    console.error("Erro ao reenviar código:", error);

    return { success: false, message: toMessage(error, "Erro ao reenviar o código") };
  }
}
