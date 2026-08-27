import transporter from "../config/Nodemailer.js";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const VIEW_DIR = path.join(import.meta.dirname, "../view");

function loadTemplate(templateName) {
  const templatePath = path.join(VIEW_DIR, templateName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${templateName}" não encontrado`);
  }

  return fs.readFileSync(templatePath, "utf-8");
}

function replacePlaceholders(html, variables) {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, "g"), value || ""),
    html
  );
}

const emailService = {
  novoUser: async (email, nome, verificationToken) => {
    const html = loadTemplate("bem-vindo.html");

    const htmlModificado = replacePlaceholders(html, {
      nome,
      baseUrl: BASE_URL,
      unsubscribeUrl: `${BASE_URL}/unsubscribe`,
      verificationToken,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Bem-vindo ao sistema!",
      html: htmlModificado,
    });

    console.log("E-mail enviado com sucesso! ID:", info.messageId);
  },
};

export default emailService;
