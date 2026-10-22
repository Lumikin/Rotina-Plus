import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../config/Nodemailer.js";
import usersRepository from "../repositories/user.repository.js";
import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import { Users } from "../model/Users.js";
import {
  JWT_SECRET,
  SALT_ROUNDS,
  MIN_NOME,
  MIN_SENHA,
  EXPIRES,
  LINK_CLAIM,
  LINK_EXPIRY_MIN,
} from "../config/auth.config.js";
import { verifyLinkToken } from "../utils/jwtLink.js";
import { buildAuthEmail } from "../config/emailTemplates.js";

const CLAIM_VERIFICACAO = LINK_CLAIM.verificacao;
const CLAIM_RESET_SENHA = LINK_CLAIM.reset;

function dataExpiracao(minutos = 10) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutos);
  return date;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function senhaTrocaValida(novaSenha, confirmarSenha) {
  return novaSenha === confirmarSenha && novaSenha.length >= MIN_SENHA;
}

const authController = {
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Informe o email e a senha." });
      }

      const users = await usersRepository.listarUserEmail(email);

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const user = users[0];

      const verificarSenha = await bcrypt.compare(senha, user.password_hash);
      if (!verificarSenha) {
        return res.status(400).json({ message: "Senha invalida" });
      }

      const accessToken = jwt.sign(
        { userId: user.UUID, email: user.email },
        JWT_SECRET,
        { expiresIn: EXPIRES.sessao },
      );

      return res
        .status(200)
        .json({ message: `Bem vindo(a) ${user.nome}!`, token: accessToken });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ocorreu um erro no servidor", error: error.message });
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
      if (senha.length < MIN_SENHA) {
        return res
          .status(400)
          .json({ message: "A senha deve ter no minimo 4 caracteres." });
      }

      if (nome.length < MIN_NOME) {
        return res
          .status(400)
          .json({ message: "O nome deve ter no minimo 4 caracteres." });
      }

      const consultaEmail = await usersRepository.listarUserEmail(email);
      if (consultaEmail.length > 0) {
        return res.status(400).json({ message: "Email já cadastrado." });
      }

      const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
      const user = Users.criar({
        nome,
        email,
        senha: hashedPassword,
        dataNascimento,
      });

      const result = await usersRepository.criarUsuarios(user);

      const consultaUser = await usersRepository.listarUserEmail(email);
      const userId = consultaUser[0].UUID;

      const token = jwt.sign(
        { userId, email, nome, [CLAIM_VERIFICACAO]: true },
        JWT_SECRET,
        { expiresIn: EXPIRES.verificacao },
      );

      await authRepository.criarCodigo(
        userId,
        hashToken(token),
        dataExpiracao(LINK_EXPIRY_MIN.verificacao),
      );

      const link = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verifique sua conta no Rotina Plus",
        html: buildAuthEmail({
          nome,
          titulo: "Sua conta foi criada no RotinaPlus.",
          intro: "Clique no botão abaixo para verificar sua conta e ativá-la:",
          acao: "Verificar conta",
          link,
          expiracao:
            "Este botão expira em 24 horas e só pode ser usado uma vez. Não criou esta conta? Ignore este e-mail.",
        }),
      });

      return res.status(201).json({
        message:
          "Usuário criado com sucesso. Verifique seu e-mail e clique no botão para ativar a conta.",
        result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        status: 500,
        error: error.message,
      });
    }
  },

  confirmarEmail: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res
          .status(400)
          .json({ message: "Token de verificação é obrigatório." });
      }

      const verificado = verifyLinkToken(token, CLAIM_VERIFICACAO);
      if (!verificado.ok) {
        return res.status(400).json({
          message: verificado.expirado
            ? "Link de verificação expirado. Crie a conta novamente."
            : "Link de verificação inválido.",
        });
      }

      // affectedRows 0 indica link já utilizado.
      const uso = await authRepository.validarCodigo(hashToken(token));

      if (uso.affectedRows === 0) {
        return res.status(400).json({
          message: "Este link de verificação já foi utilizado.",
        });
      }

      return res.status(200).json({ message: "Conta verificada com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ocorreu um erro no servidor", error: error.message });
    }
  },

  solicitarResetSenha: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório." });
      }

      const users = await usersRepository.listarUserEmail(email);

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const user = users[0];

      const token = jwt.sign(
        {
          userId: user.UUID,
          email: user.email,
          [CLAIM_RESET_SENHA]: true,
        },
        JWT_SECRET,
        { expiresIn: EXPIRES.reset },
      );

      await authRepository.criarCodigo(
        user.UUID,
        hashToken(token),
        dataExpiracao(LINK_EXPIRY_MIN.reset),
      );

      const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Redefina sua senha no Rotina Plus",
        html: buildAuthEmail({
          nome: user.nome,
          titulo: "Recebemos um pedido para redefinir a senha da sua conta.",
          intro: "Clique no botão abaixo para escolher uma nova senha:",
          acao: "Redefinir senha",
          link,
          expiracao:
            "Este botão expira em 1 hora e só pode ser usado uma vez. Não pediu isso? Ignore este e-mail: sua senha continua a mesma.",
        }),
      });

      return res.status(200).json({
        message: "Enviamos um e-mail com o link para redefinir sua senha.",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ocorreu um erro no servidor", error: error.message });
    }
  },
  resetarSenha: async (req, res) => {
    try {
      const { token, novaSenha, confirmarSenha } = req.body;

      if (!token || !novaSenha || !confirmarSenha) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      if (!senhaTrocaValida(novaSenha, confirmarSenha)) {
        return res.status(400).json({ message: "Nova senha inválida. Confira a confirmação e o mínimo de 4 caracteres." });
      }

      const verificado = verifyLinkToken(token, CLAIM_RESET_SENHA);
      if (!verificado.ok) {
        return res.status(400).json({
          message: verificado.expirado
            ? "Link expirado. Solicite uma nova redefinição de senha."
            : "Link de redefinição inválido.",
        });
      }

      const uso = await authRepository.validarCodigo(hashToken(token));

      if (uso.affectedRows === 0) {
        return res.status(400).json({
          message: "Este link de redefinição já foi utilizado.",
        });
      }

      await authRepository.alterarSenha(
        verificado.payload.userId,
        await bcrypt.hash(novaSenha, SALT_ROUNDS),
      );

      return res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ocorreu um erro no servidor", error: error.message });
    }
  },

  mudarSenha: async (req, res) => {
    try {
      const { senhaAtual, novaSenha, confirmarSenha } = req.body;

      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      if (!senhaTrocaValida(novaSenha, confirmarSenha)) {
        return res.status(400).json({ message: "Nova senha inválida. Confira a confirmação e o mínimo de 4 caracteres." });
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

      const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

      await authRepository.alterarSenha(userId, novaSenhaHash);

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
