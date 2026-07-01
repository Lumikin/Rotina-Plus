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
    const users = await usersRepository.listarUserEmail(email);

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }
    const user = users[0];
    const verificarSenha = await bcrypt.compare(senha, user.password_hash);
    if (!verificarSenha) {
      return res.status(400).json({ message: "Senha inválida." });
    }
    const accessToken = jwt.sign(
      { userId: user.ClienteID, email: user.email, role: user.role }, // Payload (dados públicos)
      JWT_SECRET, // Chave Secreta
      { expiresIn: "2h" }, // Tempo de expiração
    );

    console.log(`Token: \n`, accessToken);

    return res.status(200).json({
      message: `Bem vindo(a) ${user.Nome}!`,
      token: accessToken,
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
      // Validar email
      const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // Regex para verificar Email (https://www.catabits.com.br/view/regex_para_validar_emails)
        );
      };
      if (!validateEmail(email)) {
        // Caso retornar false vai mostrar o erro
        return res.status(400).json({
          message: "Email inválido",
        });
      }
      if (senha.length < 4) {
        return res.status(400).json({
          message: "A senha deve ter no minimo 4 caracteres",
        });
      }
      if (nome.length < 4) {
        return res.status(400).json({
          message: "Senha inválida.",
        });
      }
      const consultaEmail = await usersRepository.listarUserEmail(email); // Procura o email no banco de dados
      if (consultaEmail.length > 0) {
        // Verifica se o email inserido já esta cadastrado
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

      const result = await usersRepository.criarUsuarios(user);

      const consultaUser = await usersRepository.listarUserEmail(email); //Após o cadastro procura o usuario e retorna o id
      const verificationToken = jwt.sign(
        { userId: consultaUser.ClienteID },
        JWT_SECRET,
        { expiresIn: "20m" },
      );

      console.log(`TOKEN \n`, verificationToken);

      await emailService.novoUser(user.email, user.nome, verificationToken);

      return res.status(201).json({
        Message: "Usuario criado com sucesso",
        result: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  },
  mudarSenha: async (req, res) => {},
};
export default authController;
