import transporter from "../config/Nodemailer.js";
import fs from "fs";
import path from "path";

const emailService = {
  novoUser: async (email, nome) => {
    const caminho = path.join(import.meta.dirname, "../view/");
    const caminhoTemplate = path.join(caminho, "bem-vindo.html");
    if (!caminhoTemplate) {
      throw new Error("Template não encontrado");
    }
    let htmlModificado = fs.readFileSync(caminhoTemplate, "utf-8");
    htmlModificado = htmlModificado.replace("{{nome}}", nome);
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // Quem está enviando
        to: email, // Para quem vai (pode ser mais de um, separados por vírgula)
        subject: "Bem-vindo ao sistema!", // Assunto do e-mail
        html: htmlModificado,
      });

      console.log("✅ E-mail enviado com sucesso!");
      console.log("ID da mensagem:", info.messageId);
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error);
    }
  },
};

export default emailService;
