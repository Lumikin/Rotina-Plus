import Axios from "axios";

const API_URL = "http://localhost:8080";

const connection = {
  cadastro: async (nome, email, senha, data) => {
    try {
      const response = await Axios.post(`${API_URL}/auth/register`, {
        nome,
        email,
        senha,
        dataNascimento: data,
      });

      return response.data;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  },

  login: async (email, senha) => {
    try {
      const response = await Axios.post(`${API_URL}/auth/login`, {
        email,
        senha,
      });

      return response.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },
};

export default connection;
