import "dotenv/config";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/user.repositorie.js";
import authRepositorie from "../repositories/auth.repositorie.js";
import bcrypt from "bcrypt";
import { Users } from "../model/Users.js";
import { sendAuthEmail } from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET;

function dataExpiracao() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  return date;
}

const saltRounds = 10;

const authController = {
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Informe o email e a senha" });
      }

      const users = await usersRepository.listarUserEmail(email);

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuario nao encontrado" });
      }

      const user = users[0];

      const verificarSenha = await bcrypt.compare(senha, user.password_hash);
      if (!verificarSenha) {
        return res.status(400).json({ message: "Senha invalida" });
      }

      const accessToken = jwt.sign(
        { userId: user.UUID, email: user.email },
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
          .json({ message: "Todos os campos sao obrigatorios" });
      }
      if (senha.length < 4) {
        return res
          .status(400)
          .json({ message: "A senha deve ter no minimo 4 caracteres" });
      }

      if (nome.length < 4) {
        return res
          .status(400)
          .json({ message: "O nome deve ter no minimo 4 caracteres" });
      }

      const consultaEmail = await usersRepository.listarUserEmail(email);
      if (consultaEmail.length > 0) {
        return res.status(400).json({ message: "Email ja cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      const user = Users.criar({
        nome,
        email,
        senha: hashedPassword,
        dataNascimento,
      });

      const result = await usersRepository.criarUsuarios(user);

      const consultaUser = await usersRepository.listarUserEmail(email);
      const userId = consultaUser[0].UUID;

      const codigo = await sendAuthEmail(email);
      const hashCode = await bcrypt.hash(codigo, saltRounds);

      const expirationDate = dataExpiracao();
      await authRepositorie.criarCodigo(userId, hashCode, expirationDate);

      return res.status(201).json({
        message:
          "Usuario criado com sucesso. Verifique seu e-mail para o codigo de validacao.",
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        status: 500,
        error: error.message,
      });
    }
  },

  verificarCodigo: async (req, res) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          message: "Email e codigo sao obrigatorios",
        });
      }

      const users = await usersRepository.listarUserEmail(email);
      if (!users || users.length === 0) {
        return res.status(404).json({
          message: "Usuario nao encontrado",
          status: 404,
        });
      }

      const userId = users[0].UUID;
      const userAuthorization =
        await authRepositorie.buscarCodigoValido(userId);
      if (userAuthorization.length === 0)
        return res.status(400).json({
          message: "Não há códigos",
        });
      const userData = userAuthorization[0];
      const hashcode = userData.hashCode;

      const verificarCodigo = await bcrypt.compare(
        String(code),
        String(hashcode),
      );
      if (!verificarCodigo) {
        return res.status(400).json({
          message: "Codigo invalido!",
          status: 400,
        });
      }

      const agora = new Date();
      const expiracaoCodigo = userData.expirationDate;
      if (agora > expiracaoCodigo) {
        return res.status(400).json({
          message: "Codigo expirado. Solicite um novo.",
        });
      }

      await authRepositorie.validarCodigo(userData.hashCode);
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
        return res.status(400).json({ message: "Email e obrigatorio" });
      }

      const users = await usersRepository.listarUserEmail(email);
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuario nao encontrado" });
      }

      const user = users[0];

      await authRepositorie.invalidarCodigos(user.UUID);

      const code = await sendAuthEmail(email);
      const hashCode = await bcrypt.hash(code, saltRounds);
      const expirationDate = dataExpiracao();

      await authRepositorie.criarCodigo(user.UUID, hashCode, expirationDate);

      return res.status(200).json({
        message: "Codigo de verificacao reenviado com sucesso!",
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
          message: "Todos os campos sao obrigatorios",
        });
      }

      if (novaSenha !== confirmarSenha) {
        return res.status(400).json({
          message: "A nova senha e a confirmacao nao sao iguais",
        });
      }

      if (novaSenha.length < 4) {
        return res.status(400).json({
          message: "A nova senha deve ter no minimo 4 caracteres",
        });
      }

      const userId = req.user.userId;

      const users = await usersRepository.buscarUsuarioPorId(userId);

      if (!users || users.length === 0) {
        return res.status(404).json({
          message: "Usuario nao encontrado",
        });
      }

      const user = users[0];

      const senhaCorreta = await bcrypt.compare(senhaAtual, user.password_hash);

      if (!senhaCorreta) {
        return res.status(400).json({
          message: "A senha atual esta incorreta",
        });
      }

      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      await authRepositorie.alterarSenha(userId, novaSenhaHash);

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
