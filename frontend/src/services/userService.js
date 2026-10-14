import { loginUser, getUserId } from "./authService";
import { api_rotinaplus } from "./api";

export { getUserId };

// Delegação mantida para imports antigos.
export async function ApiLogin(email, senha) {
  return loginUser(email, senha);
}

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
