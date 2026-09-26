import { loginUser } from "./authService";

// Legado: mantido para compatibilidade. Prefira loginUser de authService.js,
// que já salva o token JWT no localStorage.
export async function ApiLogin(email, senha) {
  return loginUser(email, senha);
}
