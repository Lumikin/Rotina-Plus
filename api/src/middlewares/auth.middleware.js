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

export function authAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(404).json({
      message: "Acesso negado",
    });
  }

  next();
}

export function authUser(req, res, next) {
  if (!["user", "admin"].includes(req.user.role) || !req.user.id) {
    return res.status(403).json({
      message: "Acesso negado",
    });
  }

  next();
}

export default authMiddleware;
