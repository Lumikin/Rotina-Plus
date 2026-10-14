import { api_rotinaplus } from "./api";

const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUserId() {
  try {
    const token = getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).userId ?? null;
  } catch {
    return null;
  }
}

function toMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export async function loginUser(email, senha) {
  try {
    const response = await api_rotinaplus.post("/auth/login", { email, senha });
    const data = response.data;

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

export async function verifyEmailToken(token) {
  try {
    const response = await api_rotinaplus.post("/auth/verify", { token });

    return { success: true, message: response.data?.message || "Conta verificada!" };
  } catch (error) {
    console.error("Erro na verificação do e-mail:", error);

    return { success: false, message: toMessage(error, "Erro na verificação do e-mail") };
  }
}

export async function forgotPassword(email) {
  try {
    const response = await api_rotinaplus.post("/auth/forgot-password", { email });

    return {
      success: true,
      message: response.data?.message || "E-mail enviado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao solicitar redefinição:", error);

    return { success: false, message: toMessage(error, "Erro ao enviar o e-mail") };
  }
}

export async function resetPassword({ token, novaSenha, confirmarSenha }) {
  try {
    const response = await api_rotinaplus.post("/auth/reset-password", {
      token,
      novaSenha,
      confirmarSenha,
    });

    return { success: true, message: response.data?.message || "Senha alterada com sucesso!" };
  } catch (error) {
    console.error("Erro ao redefinir a senha:", error);

    return { success: false, message: toMessage(error, "Erro ao alterar a senha") };
  }
}
