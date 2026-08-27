import "dotenv/config";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/user.repositorie.js";
import authRepositorie from "../repositories/auth.repositorie.js";
import bcrypt from "bcrypt";
import emailService from "../services/nodemailer.controller.js";
import { Users } from "../model/Users.js";

const JWT_SECRET = process.env.JWT_SECRET;

const getExpirationDate = (minutes = 20) => {
  // Verifica se o token esta espirado (20min)
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

const authController = {
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Informe o email e a senha" });
      }

      const users = await usersRepository.listarUserEmail(email);

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const user = users[0];

      const verificarSenha = await bcrypt.compare(senha, user.password_hash);
      if (!verificarSenha) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      const accessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        JWT_SECRET,
        { expiresIn: "2h" },
      );

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
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      if (senha.length < 4) {
        return res
          .status(400)
          .json({ message: "A senha deve ter no mínimo 4 caracteres" });
      }

      if (nome.length < 4) {
        return res
          .status(400)
          .json({ message: "O nome deve ter no mínimo 4 caracteres" });
      }

      const consultaEmail = await usersRepository.listarUserEmail(email);
      if (consultaEmail.length > 0) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      const user = Users.criar({
        nome,
        email,
        senha: hashedPassword,
        dataNascimento,
      });

      const result = await usersRepository.criarUsuarios(user);

      const consultaUser = await usersRepository.listarUserEmail(email);
      const userId = consultaUser[0].userId;

      const verificationCode = await emailService.novoUser(
        user.email,
        user.nome,
      );

      const expirationDate = getExpirationDate(20);
      await authRepositorie.criar(userId, verificationCode, expirationDate);

      return res.status(201).json({
        message:
          "Usuário criado com sucesso. Verifique seu e-mail para o código de validação.",
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        error: error.message,
      });
    }
  },

  verificarCodigo: async (req, res) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res
          .status(400)
          .json({ message: "Email e código são obrigatórios" });
      }

      const users = await usersRepository.listarUserEmail(email);
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const userId = users[0].userId;

      const authRecord = await authRepositorie.buscarPorToken(code);
      if (!authRecord || authRecord.length === 0) {
        return res.status(404).json({ message: "Código inválido" });
      }

      const record = authRecord[0];

      if (record.userId !== userId) {
        return res
          .status(400)
          .json({ message: "Código não pertence a este usuário" });
      }

      if (record.isvalid === 1) {
        return res.status(400).json({ message: "Código já utilizado" });
      }

      const now = new Date();
      const expiration = new Date(record.expiration_date);
      if (now > expiration) {
        return res
          .status(400)
          .json({ message: "Código expirado. Solicite um novo." });
      }

      await authRepositorie.validarToken(code);

      return res.status(200).json({ message: "E-mail validado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        error: error.message,
      });
    }
  },

  reenviarEmail: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" });
      }

      const users = await usersRepository.listarUserEmail(email);
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const user = users[0];

      const verificationCode = await emailService.novoUser(
        user.email,
        user.nome,
      );

      const expirationDate = getExpirationDate(20);
      await authRepositorie.criar(
        user.userId,
        verificationCode,
        expirationDate,
      );

      return res.status(200).json({
        message: "Código de verificação reenviado com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
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

      const senhaCorreta = await bcrypt.compare(senhaAtual, user.password_hash);

      if (!senhaCorreta) {
        return res.status(400).json({
          message: "A senha atual está incorreta",
        });
      }

      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      await usersRepository.alterarSenha(userId, novaSenhaHash);

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
