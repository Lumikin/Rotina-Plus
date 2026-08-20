import { useState, useCallback } from "react";
import { registerUser } from "../services/authService";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = useCallback(async (nome, email, senha, dataNascimento) => {
    setError(""); // Limpa o valor
    setSuccess(""); // Limpa o valor
    setLoading(true); // Fica como carregando

    try {
      const response = await registerUser(nome, email, senha, dataNascimento); // Manda os dados

      setSuccess("Conta criada com sucesso!"); // Caso de certo mostre essa mensagem

      return response;
    } catch (err) {
      console.error("Erro no cadastro:", err); // Mostra o erro no console

      setError("Erro no cadastro"); // Retorna essa mensagem no frontend

      throw err;
    } finally {
      setLoading(false); // Caso tudo de certo o loading para
    }
  }, []);

  return { register, loading, error, success };
}
