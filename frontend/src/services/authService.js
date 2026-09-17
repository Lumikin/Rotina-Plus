import usuarios from "../../../data/usuarios.json";

export async function loginUser(email, password_hash) {
  const user = usuarios.find((u) => u.email === email && u.password_hash === password_hash);
  if (!user) {
    return { success: false, message: "Email ou senha incorretos." };
  }
  return { success: true, userId: user.userId, nome: user.nome };
}

export async function registerUser(email, password_hash, nome, dataNascimento) {
  const exists = usuarios.find((u) => u.email === email);
  if (exists) {
    return { success: false, message: "Email já cadastrado." };
  }
  const newUser = { userId: usuarios.length + 1, nome, email, dataNascimento, password_hash };
  usuarios.push(newUser);
  return { success: true, userId: newUser.userId, nome: newUser.nome };
}
