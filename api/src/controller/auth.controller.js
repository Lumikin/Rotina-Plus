import "dotenv/config";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/user.repositorie.js";
import authRepositorie from "../repositories/auth.repositorie.js";
import bcrypt from "bcrypt";
import { Users } from "../model/Users.js";
import { sendAuthEmail } from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Faz o tempo de expiração do código, pegando a data atual e somando mais 10 Min
function dataExpiracao() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10); //10 Minutos
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

      /**
       * Consulta o usuario por email e armazena as informações
       */
      const users = await usersRepository.listarUserEmail(email);

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const user = users[0];

      /**
       * Pega o hash da senha no banco e verifica se esta igual a o que esta nos parametros
       */
      const verificarSenha = await bcrypt.compare(senha, user.password_hash);
      if (!verificarSenha) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      /**
       * Cria o token com o id, email do usuario que dura 2 Horas
       */
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

      /**
       * Verificação de campos
       */
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

      /**
       * Verificação de email válido
       */
      const consultaEmail = await usersRepository.listarUserEmail(email);
      if (consultaEmail.length > 0) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      /**
       * Guarda a senha criptografa ela com base no saltRounds
       */
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

      const codigo = await sendAuthEmail(email);
      const hashCode = bcrypt.hash(codigo, saltRounds);

      const expirationDate = dataExpiracao();
      await authRepositorie.criarCodigo(userId, hashCode, expirationDate);

      return res.status(201).json({
        message:
          "Usuário criado com sucesso. Verifique seu e-mail para o código de validação.",
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
          message: "Email e código são obrigatórios",
        });
      }

      const users = await usersRepository.listarUserEmail(email);
      if (!users || users.length === 0) {
        return res.status(404).json({
          message: "Usuário não encontrado",
          status: 404,
        });
      }

      const userId = users[0].userId;
      const userAuthorization =
        await authRepositorie.buscarCodigoValido(userId);

      const userData = userAuthorization[0];
      const hashcode = userData.hashCode;

      console.log("código hash:", hashcode);
      console.log("código:", code);

      const verificarCodigo = await bcrypt.compare(
        String(code),
        String(hashcode),
      );
      if (!verificarCodigo) {
        return res.status(400).json({
          message: "Código inválido!",
          status: 400,
        });
      }
      console.log("Validador de Código:", verificarCodigo);
      const agora = new Date();
      const expiracaoCodigo = userData.expiration_date;
      if (agora > expiracaoCodigo) {
        return res.status(400).json({
          message: "Código expirado. Solicite um novo.",
        });
      }
      console.log("ValidarData", expiracaoCodigo);

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
        return res.status(400).json({ message: "Email é obrigatório" });
      }

      const users = await usersRepository.listarUserEmail(email);
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const user = users[0];

      await authRepositorie.invalidarCodigos(user.userId);

      const code = await sendAuthEmail(email);
      const hashCode = await bcrypt.hash(code, saltRounds);
      const expirationDate = dataExpiracao();

      await authRepositorie.criarCodigo(user.userId, hashCode, expirationDate);

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
