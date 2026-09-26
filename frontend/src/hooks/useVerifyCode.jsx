import { useState, useCallback } from "react";
import { verifyCode as verifyCodeRequest, resendCode as resendCodeRequest } from "../services/authService";

export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const verify = useCallback(async (email, code) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await verifyCodeRequest(email, code);

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }

      return result;
    } catch (err) {
      console.error("Erro na verificação:", err);
      setError("Erro na verificação do código");
      return { success: false, message: "Erro na verificação do código" };
    } finally {
      setLoading(false);
    }
  }, []);

  const resend = useCallback(async email => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      const result = await resendCodeRequest(email);

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }

      return result;
    } catch (err) {
      console.error("Erro ao reenviar código:", err);
      setError("Erro ao reenviar o código");
      return { success: false, message: "Erro ao reenviar o código" };
    } finally {
      setResending(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    verify,
    resend,
    reset,
    loading,
    resending,
    error,
    success,
  };
}
