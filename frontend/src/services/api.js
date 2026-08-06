import axios from "axios";

export const api_rotinaplus = axios.create({
  baseURL: "https://localhot:8080",
  timeout: 5000, //Demorou mais de 5 segundos ele sai
});
