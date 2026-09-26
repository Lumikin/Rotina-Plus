import { useState, useCallback } from "react";
import { registerUser } from "../services/authService";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = useCallback(async ({ nome, email, senha, dataNascimento }) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await registerUser({ nome, email, senha, dataNascimento });

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }

      return result;
    } catch (erro) {
      console.error("Erro no cadastro:", erro);
      setError("Erro no cadastro");
      return { success: false, message: "Erro no cadastro" };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    register,
    reset,
    loading,
    error,
    success,
  };
}
