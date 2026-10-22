const BRAND_BG = "#F4F7F6";
const BRAND_DARK = "#113D56";
const BRAND_ACCENT = "#5BC6A9";
const BRAND_BTN = "#17A2B8";

export function buildAuthEmail({ nome, titulo, intro, acao, link, expiracao }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:${BRAND_BG};padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #E0E0E0;">
        <tr><td style="background-color:${BRAND_DARK};padding:35px 20px;text-align:center;color:#FFFFFF;">
          <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:1px;font-family:Helvetica,Arial,sans-serif;">
            Rotina<span style="color:${BRAND_ACCENT};">Plus</span>
          </h1>
        </td></tr>
        <tr><td style="padding:45px 40px;color:#333333;line-height:1.8;font-size:16px;text-align:center;">
          <h2 style="color:${BRAND_DARK};font-size:22px;margin-top:0;font-weight:bold;">Olá, ${nome}!</h2>
          <p style="margin:0 0 10px 0;">${titulo}</p>
          <p style="margin:0 0 30px 0;">${intro}</p>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:30px 0;">
            <tr><td align="center">
              <a href="${link}" target="_blank" rel="noopener noreferrer"
                 style="display:inline-block;background-color:${BRAND_BTN};color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:bold;padding:16px 40px;border-radius:8px;">
                ${acao}
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 10px 0;font-size:14px;color:#888888;">${expiracao}</p>
          <p style="margin:0 0 10px 0;font-size:12px;color:#AAAAAA;">Se o botão não funcionar, copie e cole o endereço no seu navegador:<br>${link}</p>
          <p style="margin:30px 0 0 0;border-top:1px solid #F0F0F0;padding-top:20px;">
            Atenciosamente,<br><strong style="color:${BRAND_DARK};">Administração RotinaPlus</strong>
          </p>
        </td></tr>
        <tr><td style="background-color:#F9F9F9;padding:25px 20px;text-align:center;font-size:12px;color:#888888;border-top:1px solid #EEEEEE;">
          <p style="margin:0 0 5px 0;">&copy; 2026 RotinaPlus. Todos os direitos reservados.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
