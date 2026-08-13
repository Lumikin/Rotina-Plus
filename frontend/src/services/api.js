import axios from "axios";

export const api_rotinaplus = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000
});