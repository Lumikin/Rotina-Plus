import { useState, useCallback } from "react";
import { loginUser } from "../services/authService";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Só faz a requisição quando for chamada (no submit do formulário)
  const login = useCallback(async (email, senha) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await loginUser(email, senha);

      if (result.success) {
        setSuccess(result.message || "Login realizado com sucesso!");
      } else {
        setError(result.message);
      }

      return result;
    } catch (erro) {
      console.error("Erro no login:", erro);
      setError("Erro no login");
      return { success: false, message: "Erro no login" };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    loading,
    error,
    success,
  };
}
