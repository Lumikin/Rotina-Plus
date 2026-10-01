import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../config/Nodemailer.js";
import usersRepository from "../repositories/user.repositorie.js";
import authRepositorie from "../repositories/auth.repositorie.js";
import bcrypt from "bcrypt";
import { Users } from "../model/Users.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Claim que marca o token do link de verificação. Sem essa checagem no
// auth.middleware o link funcionaria como Bearer token em rotas protegidas.
const CLAIM_VERIFICACAO = "verificacaoConta";
const CLAIM_RESET_SENHA = "resetSenha";

function dataExpiracao(minutos = 10) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutos);
  return date;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const saltRounds = 10;

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
        { expiresIn: "2h" },
      );

      return res.status(200).json({message: `Bem vindo(a) ${user.nome}!`, token: accessToken});

    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Ocorreu um erro no servidor", error: error.message});
    }
  },

  criarUsuarios: async (req, res) => {
    try {
      const { nome, email, senha, dataNascimento } = req.body;

      if (!nome || !email || !senha || !dataNascimento) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }
      if (senha.length < 4) {
        return res.status(400).json({ message: "A senha deve ter no minimo 4 caracteres." });
      }

      if (nome.length < 4) {
        return res.status(400).json({ message: "O nome deve ter no minimo 4 caracteres." });
      }

      const consultaEmail = await usersRepository.listarUserEmail(email);
      if (consultaEmail.length > 0) {
        return res.status(400).json({ message: "Email já cadastrado." });
      }

      const hashedPassword = await bcrypt.hash(senha, saltRounds);
      const user = Users.criar({nome, email, senha: hashedPassword, dataNascimento});

      const result = await usersRepository.criarUsuarios(user);

      const consultaUser = await usersRepository.listarUserEmail(email);
      const userId = consultaUser[0].UUID;

      const token = jwt.sign(
        { userId, email, nome, [CLAIM_VERIFICACAO]: true },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      await authRepositorie.criarCodigo(userId, hashToken(token), dataExpiracao(24 * 60));

      const link = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verifique sua conta no Rotina Plus",
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#F4F7F6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F4F7F6;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #E0E0E0;">

        <tr><td style="background-color:#113D56;padding:35px 20px;text-align:center;color:#FFFFFF;">
          <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:1px;font-family:Helvetica,Arial,sans-serif;">
            Rotina<span style="color:#5BC6A9;">Plus</span>
          </h1>
        </td></tr>

        <tr><td style="padding:45px 40px;color:#333333;line-height:1.8;font-size:16px;text-align:center;">
          <h2 style="color:#113D56;font-size:22px;margin-top:0;font-weight:bold;">Olá, ${nome}!</h2>

          <p style="margin:0 0 10px 0;">Sua conta foi criada no <strong>RotinaPlus</strong>.</p>

          <p style="margin:0 0 30px 0;">Clique no botão abaixo para verificar sua conta e ativá-la:</p>

          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:30px 0;">
            <tr><td align="center">
              <a href="${link}" target="_blank" rel="noopener noreferrer"
                 style="display:inline-block;background-color:#17A2B8;color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:bold;padding:16px 40px;border-radius:8px;">
                Verificar conta
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 10px 0;font-size:14px;color:#888888;">Este botão expira em 24 horas e só pode ser usado uma vez.</p>

          <p style="margin:0 0 10px 0;font-size:14px;color:#888888;">Não criou esta conta? Ignore este e-mail.</p>

          <p style="margin:0 0 10px 0;font-size:12px;color:#AAAAAA;">Se o botão não funcionar, copie e cole o endereço no seu navegador:<br>${link}</p>

          <p style="margin:30px 0 0 0;border-top:1px solid #F0F0F0;padding-top:20px;">
            Atenciosamente,<br><strong style="color:#113D56;">Administração RotinaPlus</strong>
          </p>
        </td></tr>

        <tr><td style="background-color:#F9F9F9;padding:25px 20px;text-align:center;font-size:12px;color:#888888;border-top:1px solid #EEEEEE;">
          <p style="margin:0 0 5px 0;">&copy; 2026 RotinaPlus. Todos os direitos reservados.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });

      return res.status(201).json({
        message: "Usuário criado com sucesso. Verifique seu e-mail e clique no botão para ativar a conta.",
        result,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Ocorreu um erro no servidor", status: 500, error: error.message});
    }
  },

  confirmarEmail: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Token de verificação é obrigatório." });
      }

      let payload;

      try {
        payload = jwt.verify(token, JWT_SECRET);
      } catch (erroJwt) {
        const mensagem =
          erroJwt.name === "TokenExpiredError"
            ? "Link de verificação expirado. Crie a conta novamente."
            : "Link de verificação inválido.";

        return res.status(400).json({ message: mensagem });
      }

      if (payload[CLAIM_VERIFICACAO] !== true) {
        return res.status(400).json({ message: "Link de verificação inválido." });
      }

      // invalidarCodigos só altera linhas que ainda estavam válidas (isvalid = 1),
      // então affectedRows = 0 significa que o link já foi usado antes.
      const uso = await authRepositorie.validarCodigo(hashToken(token));

      if (uso.affectedRows === 0) {
        return res.status(400).json({
          message: "Este link de verificação já foi utilizado.",
        });
      }

      return res.status(200).json({ message: "Conta verificada com sucesso!" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Ocorreu um erro no servidor", error: error.message});
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
        { expiresIn: "1h" },
      );

      await authRepositorie.criarCodigo(user.UUID, hashToken(token), dataExpiracao(60));

      const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Redefina sua senha no Rotina Plus",
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#F4F7F6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F4F7F6;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #E0E0E0;">

        <tr><td style="background-color:#113D56;padding:35px 20px;text-align:center;color:#FFFFFF;">
          <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:1px;font-family:Helvetica,Arial,sans-serif;">
            Rotina<span style="color:#5BC6A9;">Plus</span>
          </h1>
        </td></tr>

        <tr><td style="padding:45px 40px;color:#333333;line-height:1.8;font-size:16px;text-align:center;">
          <h2 style="color:#113D56;font-size:22px;margin-top:0;font-weight:bold;">Olá, ${user.nome}!</h2>

          <p style="margin:0 0 10px 0;">Recebemos um pedido para redefinir a senha da sua conta.</p>

          <p style="margin:0 0 30px 0;">Clique no botão abaixo para escolher uma nova senha:</p>

          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:30px 0;">
            <tr><td align="center">
              <a href="${link}" target="_blank" rel="noopener noreferrer"
                 style="display:inline-block;background-color:#17A2B8;color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:bold;padding:16px 40px;border-radius:8px;">
                Redefinir senha
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 10px 0;font-size:14px;color:#888888;">Este botão expira em 1 hora e só pode ser usado uma vez.</p>

          <p style="margin:0 0 10px 0;font-size:14px;color:#888888;">Não pediu isso? Ignore este e-mail: sua senha continua a mesma.</p>

          <p style="margin:0 0 10px 0;font-size:12px;color:#AAAAAA;">Se o botão não funcionar, copie e cole o endereço no seu navegador:<br>${link}</p>

          <p style="margin:30px 0 0 0;border-top:1px solid #F0F0F0;padding-top:20px;">
            Atenciosamente,<br><strong style="color:#113D56;">Administração RotinaPlus</strong>
          </p>
        </td></tr>

        <tr><td style="background-color:#F9F9F9;padding:25px 20px;text-align:center;font-size:12px;color:#888888;border-top:1px solid #EEEEEE;">
          <p style="margin:0 0 5px 0;">&copy; 2026 RotinaPlus. Todos os direitos reservados.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });

      return res.status(200).json({
        message: "Enviamos um e-mail com o link para redefinir sua senha.",
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Ocorreu um erro no servidor", error: error.message});
    }
  },

  resetarSenha: async (req, res) => {
    try {
      const { token, novaSenha, confirmarSenha } = req.body;

      if (!token || !novaSenha || !confirmarSenha) {
        return res.status(400).json({message: "Todos os campos são obrigatórios"});
      }

      if (novaSenha !== confirmarSenha) {
        return res.status(400).json({message: "A nova senha e a confirmação não são iguais"});
      }

      if (novaSenha.length < 4) {
        return res.status(400).json({
          message: "A nova senha deve ter no minimo 4 caracteres",
        });
      }

      let payload;

      try {
        payload = jwt.verify(token, JWT_SECRET);
      } catch (erroJwt) {
        const mensagem =
          erroJwt.name === "TokenExpiredError"
            ? "Link expirado. Solicite uma nova redefinição de senha."
            : "Link de redefinição inválido.";

        return res.status(400).json({ message: mensagem });
      }

      if (payload[CLAIM_RESET_SENHA] !== true) {
        return res.status(400).json({ message: "Link de redefinição inválido." });
      }

      const uso = await authRepositorie.validarCodigo(hashToken(token));

      if (uso.affectedRows === 0) {
        return res.status(400).json({
          message: "Este link de redefinição já foi utilizado.",
        });
      }

      await authRepositorie.alterarSenha(
        payload.userId,
        await bcrypt.hash(novaSenha, saltRounds),
      );

      return res.status(200).json({ message: "Senha alterada com sucesso" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Ocorreu um erro no servidor", error: error.message});
    }
  },

  mudarSenha: async (req, res) => {
    try {
      const { senhaAtual, novaSenha, confirmarSenha } = req.body;

      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        return res.status(400).json({message: "Todos os campos são obrigatórios"});
      }

      if (novaSenha !== confirmarSenha) {
        return res.status(400).json({message: "A nova senha e a confirmação não são iguais",
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