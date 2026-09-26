import { useState, useEffect } from "react";

/**
 * @deprecated Hook legado quebrado — não usar.
 * Mantido apenas para não quebrar imports antigos.
 * Para o fluxo de registro, use `useRegister` (função `register`).
 */
export function useUsers() {
  const [loading] = useState(false);

  useEffect(() => {
    console.warn(
      "useUsers está depreciado e não faz nada. Use useLogin/useRegister em vez disso.",
    );
  }, []);

  return { users: [], loading };
}
