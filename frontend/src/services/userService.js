import { loginUser } from "./authService";
import { api_rotinaplus } from "./api";

// Legado: mantido para compatibilidade. Prefira loginUser de authService.js,
// que já salva o token JWT no localStorage.
export async function ApiLogin(email, senha) {
  return loginUser(email, senha);
}

// Busca os dados do usuário (GET /api/users/:id)
export async function buscarUsuario(id) {
  try {
    const res = await api_rotinaplus.get(`/api/users/${id}`);
    const dados = res.data?.result?.[0] ?? res.data?.result ?? null;
    return { success: true, dados };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Não foi possível carregar os dados.",
    };
  }
}

// Atualiza nome, email e/ou senha (PUT /api/users/:id)
export async function atualizarUsuario(id, dados) {
  try {
    const res = await api_rotinaplus.put(`/api/users/${id}`, dados);
    return { success: true, message: "Dados atualizados com sucesso!", dados: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Não foi possível salvar.",
    };
  }
}

// Exclui a conta (DELETE /api/users/:id)
export async function deletarUsuario(id) {
  try {
    const res = await api_rotinaplus.delete(`/api/users/${id}`);
    return { success: true, message: res.data?.message || "Conta excluída.", dados: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Não foi possível excluir a conta.",
    };
  }
}

// Troca a senha logado (PUT /auth/alterar-senha)
export async function alterarSenha({ senhaAtual, novaSenha, confirmarSenha }) {
  try {
    const res = await api_rotinaplus.put("/auth/alterar-senha", {
      senhaAtual,
      novaSenha,
      confirmarSenha,
    });
    return { success: true, message: res.data?.message || "Senha alterada com sucesso!" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Não foi possível alterar a senha.",
    };
  }
}

// Extrai o userId do JWT salvo no localStorage
export function getUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).userId ?? null;
  } catch {
    return null;
  }
}
