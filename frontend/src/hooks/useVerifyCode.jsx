import { useState, useEffect } from "react";
import { api_rotinaplus } from "../services/api";

export function useVerifyCode(email, code, executar) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!executar) {
      return;
    }

    async function verificar() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await api_rotinaplus.post("/auth/verify", {
          email,
          code,
        });

        console.log(response);
        setSuccess(response.data.message || "Email verificado com sucesso!");
      } catch (err) {
        console.error("Erro na verificação:", err);
        setError(err.response?.data?.message || "Erro na verificação do código");
      }

      setLoading(false);
    }

    verificar();
  }, [executar, email, code]);

  return {
    loading,
    error,
    success,
  };
}
