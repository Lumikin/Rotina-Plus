import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rotinaplus-theme";

function lerTemaInicial() {
  if (typeof window === "undefined") return false;

  try {
    const salvo = window.localStorage.getItem(STORAGE_KEY);
    if (salvo === "dark") return true;
    if (salvo === "light") return false;
  } catch {
    // localStorage pode estar bloqueado no navegador.
  }

  return Boolean(window.matchMedia?.("(prefers-color-scheme: dark)")?.matches);
}

function aplicarTema(temaEscuro) {
  const root = document.documentElement;
  root.dataset.theme = temaEscuro ? "dark" : "light";
  root.dataset.bsTheme = temaEscuro ? "dark" : "light";
  root.style.colorScheme = temaEscuro ? "dark" : "light";
}

// Aplica o tema salvo antes do React renderizar para evitar flash de tela clara.
export function inicializarTema() {
  aplicarTema(lerTemaInicial());
}

export function useTheme() {
  const [temaEscuro, setTemaEscuro] = useState(lerTemaInicial);

  useEffect(() => {
    aplicarTema(temaEscuro);

    try {
      window.localStorage.setItem(STORAGE_KEY, temaEscuro ? "dark" : "light");
    } catch {
      // Se o armazenamento estiver bloqueado, o tema ainda funciona na sessão.
    }
  }, [temaEscuro]);

  const toggleTema = useCallback(() => {
    setTemaEscuro((atual) => !atual);
  }, []);

  return { temaEscuro, toggleTema };
}
