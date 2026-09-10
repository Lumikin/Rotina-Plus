

import { useState, useEffect } from "react";
import { loginUser } from "../services/authService";

export function useLogin(email, senha, executar) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!executar) {
      return;
    }

    async function login() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await loginUser(email, senha);

        console.log(response);
        setSuccess("Login realizado com sucesso!");
      } catch (err) {
        console.error("Erro no login:", err);
        setError("Erro no login");
      }

      setLoading(false);
    }

    login();
  }, [executar, email, senha]);

  return {
    loading,
    error,
    success
  };
}

