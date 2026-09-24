import axios from "axios";
 
export const api_rotinaplus = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});
 
// Anexa o token JWT em toda requisição, exceto nas rotas /auth/*.
// A chave "token" deve ser a mesma usada no authService.js
// (lemos o localStorage direto aqui para evitar import circular).
api_rotinaplus.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
 
  if (token && !config.url?.startsWith("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 
  return config;
});
 






