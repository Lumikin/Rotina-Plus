import jwt from "jsonwebtoken";
import "dotenv/config";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Link tokens usam a mesma chave mas não valem como sessão.
    const claimsNaoSessao = ["verificacaoConta", "resetSenha"];

    if (claimsNaoSessao.some((claim) => decoded[claim] !== undefined)) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    return res.status(500).json({
      message: "Erro ao validar token",
    });
  }
}

export default authMiddleware;
