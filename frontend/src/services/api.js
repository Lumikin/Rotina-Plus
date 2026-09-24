import axios from "axios";

export const api_rotinaplus = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

api_rotinaplus.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token && !config.url?.startsWith("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
