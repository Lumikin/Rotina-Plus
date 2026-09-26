import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "rp-theme";

function getInitialTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }) {
  const [temaEscuro, setTemaEscuro] = useState(getInitialTheme);

  const toggleTema = useCallback(() => {
    setTemaEscuro((prev) => !prev);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, temaEscuro ? "dark" : "light");
    } catch {
      // storage indisponível (modo privado) — ignora
    }
    document.documentElement.setAttribute(
      "data-bs-theme",
      temaEscuro ? "dark" : "light"
    );
  }, [temaEscuro]);

  const value = useMemo(
    () => ({
      temaEscuro,
      isDark: temaEscuro,
      theme: temaEscuro ? "dark" : "light",
      toggleTema,
    }),
    [temaEscuro, toggleTema]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  }
  return ctx;
}
