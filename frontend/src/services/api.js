import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const API_TIMEOUT = 10000;

export const api_rotinaplus = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
});

// Lê o localStorage direto para evitar import circular com authService.
// Anexa o token JWT em toda requisição, exceto nas rotas /auth/*.
api_rotinaplus.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = config.url ?? "";
  const isAuthRoute = url.includes("/auth/");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
