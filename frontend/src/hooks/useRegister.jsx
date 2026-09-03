import { useState, useEffect } from "react";
import { registerUser } from "../services/authService";

export function useRegister(
  nome,
  email,
  senha,
  dataNascimento,
  executar
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!executar) {
      return;
    }

    async function cadastrar() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await registerUser(
          nome,
          email,
          senha,
          dataNascimento
        );

        console.log(response);
        setSuccess("Conta criada com sucesso!");
      } catch (err) {
        console.error("Erro no cadastro:", err);
        setError("Erro no cadastro");
      }

      setLoading(false);
    }

    cadastrar();
  }, [executar, nome, email, senha, dataNascimento]);

  return {
    loading,
    error,
    success
  };
}
