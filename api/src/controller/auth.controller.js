import "dotenv/config";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/user.repositorie.js";
import bcrypt from "bcrypt"; // Criptografia
import emailService from "../services/nodemailer.controller.js";
import { Users } from "../model/Users.js";

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
  login: async (req, res) => {
    try {
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
        { userId: user.userId, email: user.email },
        JWT_SECRET, // Chave Secreta
        { expiresIn: "2h" }, // Tempo de expiração
      );

      console.log(`Token: \n`, accessToken);

      return res.status(200).json({
        message: `Bem vindo(a) ${user.nome}!`,
        token: accessToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        error: error.message,
      });
    }
  },
  criarUsuarios: async (req, res) => {
    try {
      const { nome, email, senha, dataNascimento } = req.body;

      if (!nome || !email || !senha || !dataNascimento) {
        return res.status(400).json({
          message: "Todos os campos sao obrigatorios",
        });
      }
      if (senha.length < 4) {
        return res.status(400).json({
          message: "A senha deve ter no minimo 4 caracteres",
        });
      }
      if (nome.length < 4) {
        return res.status(400).json({
          message: "O nome deve ter no minimo 4 caracteres",
        });
      }
      const consultaEmail = await usersRepository.listarUserEmail(email); // Procura o email no banco de dados
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

      const result = await usersRepository.criarUsuarios(user);

      const consultaUser = await usersRepository.listarUserEmail(email); //Após o cadastro procura o usuario e retorna o id
      const verificationToken = jwt.sign(
        { userId: consultaUser[0].userId },
        JWT_SECRET,
        { expiresIn: "20m" },
      );

      console.log(`TOKEN \n`, verificationToken);

      await emailService.novoUser(user.email, user.nome, verificationToken);

      return res.status(201).json({
        message: "Usuario criado com sucesso",
        result: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        error: error.message,
      });
    }
  },
  mudarSenha: async (req, res) => {
  try {
    const { senhaAtual, novaSenha, confirmarSenha } = req.body;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
      });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({
        message: "A nova senha e a confirmação não são iguais",
      });
    }

    if (novaSenha.length < 4) {
      return res.status(400).json({
        message: "A nova senha deve ter no mínimo 4 caracteres",
      });
    }

    const userId = req.user.userId;

    const users = await usersRepository.listarUserId(userId);

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    const user = users[0];

    const senhaCorreta = await bcrypt.compare(
      senhaAtual,
      user.password_hash
    );

    if (!senhaCorreta) {
      return res.status(400).json({
        message: "A senha atual está incorreta",
      });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await usersRepository.alterarSenha(
      userId,
      novaSenhaHash
    );

    return res.status(200).json({
      message: "Senha alterada com sucesso",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Ocorreu um erro no servidor",
      error: error.message,
    });
  }
},

};
export default authController;

