import transporter from "../config/Nodemailer.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VIEW_DIR = path.join(import.meta.dirname, "../view");

const emailService = {
  novoUser: async (email, nome) => {
    const code = crypto.randomInt(100000, 999999).toString();
    const templatePath = path.join(VIEW_DIR, "autenticacao.html");

    if (!fs.existsSync(templatePath)) {
      throw new Error("Template não encontrado");
    }

    let html = fs.readFileSync(templatePath, "utf-8");
    html = html.replace(/{{nome}}/g, nome).replace(/{{code}}/g, code);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de Verificação - RotinaPlus",
      html,
    });

    console.log("E-mail enviado com sucesso! ID:", info.messageId);

    return code;
  },
};

export default emailService;
