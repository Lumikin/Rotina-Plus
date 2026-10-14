import { useEffect, useState } from "react";
import { buscarUsuario } from "../services/userService";

export function useNomeUsuario(userId) {
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    if (!userId) return;
    buscarUsuario(userId).then((res) => {
      const dados = Array.isArray(res.dados) ? res.dados[0] : res.dados;
      if (dados?.nome) setNomeUsuario(dados.nome);
    });
  }, [userId]);

  return [nomeUsuario, setNomeUsuario];
}
