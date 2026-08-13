import { useState, useCallback } from "react";
import { loginUser, registerUser } from "../services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const login = useCallback(async (email, senha) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await loginUser(email, senha);

      setSuccess("Login realizado com sucesso!");

      return response;

    } catch (err) {
      console.error("Erro no login:", err);

      setError("Erro no login");

      throw err;

    } finally {
      setLoading(false);
    }
  }, []);

  return {login, loading, error, success};
};