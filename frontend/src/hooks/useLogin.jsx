import { useState } from "react";
import { loginUser } from "../services/authService";

export function useLogin() {
  const [loading, setLoading] = useState(false); // True = Carregando, False = Carregado
  const [error, setError] = useState(null);

  async function login(email, senha) {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(email, senha);
      if (!result.success) {
        setError(result.message);
        return result;
      }
      localStorage.setItem("token", result.token);
      return result;
    } catch (error) {
      console.log("Erro ao fazer login: ", error);
      setError("Erro ao conectar com o servidor");
      return { success: false, message: "Erro ao conectar com o servidor" };
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
