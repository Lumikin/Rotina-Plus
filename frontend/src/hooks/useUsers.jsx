import { useEffect, useState } from "react";
import { ApiLogin } from "../services/userService";

export function useUsers() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await ApiLogin(email, senha);
                setEmail(data);

            } catch (error) {
                console.log("Erro ao buscar usuários:", error);
            
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    return { users, loading };
};