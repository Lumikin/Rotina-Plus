import Axios from "axios";
const API_URL = "http://localhost:8080";

const connection = {
  cadastro: async function cadastro(nome, email, senha, data) {
    try {
      const response = await Axios.post(`${API_URL}/auth/register`, {
        nome: nome,
        email: email,
        senha: senha,
        dataNascimento: data,
      });
      return response.data
    } catch (error) {
      console.error(error);
    }
  },
};

export default connection;
