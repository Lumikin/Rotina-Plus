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

  const register = useCallback(async (nome, email, senha, dataNascimento) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await registerUser(nome, email, senha, dataNascimento);

      setSuccess("Conta criada com sucesso!");

      return response;

    } catch (err) {
      console.error("Erro no cadastro:", err);

      setError("Erro no cadastro");

      throw err;

    } finally {
      setLoading(false);
    }
  }, []);

  return {login, register, loading, error, success};
};