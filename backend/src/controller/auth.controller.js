import "dotenv/config";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/user.repositorie.js";
import bcrypt from "bcrypt"; // Criptografia
import { Users } from "../model/Users.js";
import emailService from "../services/nodemailer.controller.js";

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
  login: async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({
        message: "Informe o email e a senha",
      });
    }
    const [User] = await usersRepository.listarUserEmail(email);

    if (User.length === 0 || !User) {
      return res.status(200).json({ message: "Esse User não existe" });
    }

    const verificarSenha = await bcrypt.compare(senha, User.password_hash);
    if (!verificarSenha) {
      return res.status(400).json({ error: "Senha inválida." });
    }
    const accessToken = jwt.sign(
      { userId: User.ClienteID, email: User.email }, // Payload (dados públicos)
      JWT_SECRET, // Chave Secreta
      { expiresIn: "2h" }, // Tempo de expiração
    );

    console.log(`Token: \n`, accessToken);

    return res.status(200).json({
      message: `Bem vindo(a) ${User.Nome}!`,
    });
  },
  criarUsuarios: async (req, res) => {
    try {
      const { nome, email, senha, dataNascimento } = req.body;
      if (!nome || !email || !senha || !dataNascimento) {
        return res.status(400).json({
          message: "Todos os campos sao obrigatorios",
        });
      }
      const consultaEmail = await usersRepository.listarUserEmail(email);
      if (consultaEmail.length > 0) {
        return res.status(400).json({
          message: "Email ja cadastrado",
        });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds); //Criptografa a senha
      const user = Users.criar({
        nome,
        email,
        senha: hashedPassword,
        dataNascimento, // Ano-mes-data
      });

      const consultaUser = await usersRepository.listarUsuarios(email);
      const verificationToken = jwt.sign(
        { userId: consultaUser.ClienteID },
        JWT_SECRET,
        { expiresIn: "20m" },
      );

      console.log(`TOKEN \n`, verificationToken);
      const result = await usersRepository.criarUsuarios(user);
      await emailService.novoUser(user.email, user.nome);

      return res.status(201).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  },
  mudarSenha: async (req, res) => {

  },
};
export default authController;
