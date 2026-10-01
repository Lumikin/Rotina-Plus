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

// Cria a conta (POST /auth/register). O backend envia por e-mail o botão de
// verificação da conta.
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

// Verifica a conta (POST /auth/verify) a partir do token do link do e-mail.
export async function verifyEmailToken(token) {
  try {
    const response = await api_rotinaplus.post("/auth/verify", { token });

    return { success: true, message: response.data?.message || "Conta verificada!" };
  } catch (error) {
    console.error("Erro na verificação do e-mail:", error);

    return { success: false, message: toMessage(error, "Erro na verificação do e-mail") };
  }
}

// Envia o e-mail com o botão de redefinição (POST /auth/forgot-password)
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

// Troca a senha usando o token do link (POST /auth/reset-password)
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
