import axios from "axios";

export const api_rotinaplus = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 5000,
});
