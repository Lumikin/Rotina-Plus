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
