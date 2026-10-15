import axios from "axios";

export const api_rotinaplus = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

// Anexa o token JWT em toda requisição, exceto nas rotas /auth/*.
// A chave "token" deve ser a mesma usada no authService.js
// (lemos o localStorage direto aqui para evitar import circular).
api_rotinaplus.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = config.url ?? "";

  // Funciona tanto com URL relativa ("/auth/login") quanto absoluta.
  const isAuthRoute = url.includes("/auth/");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
