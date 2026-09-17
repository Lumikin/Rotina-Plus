import transporter from "../config/Nodemailer.js";
import "dotenv/config";

export async function sendAuthEmail(email) {
  try {
    const GerarCodigo = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
    const codigo = GerarCodigo;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Seu código de autenticação do Rotina Plus",
      html: `<p> Seu código é <b>${codigo}</b> <p>Ele expira em 10 minutos.</p>`,
    });

    return codigo;
  } catch (error) {
    console.error("Erro ao mandar o e-mail: ", error);
    return [];
  }
}
