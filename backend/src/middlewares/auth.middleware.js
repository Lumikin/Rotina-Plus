import jwt from "jsonwebtoken";
import "dotenv/config";

async function authMidlleware(req, res, next) {
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
    console.error(error);
    return res.status(401).json({
      message: "Token Inválido",
    });
  }
}

export function authAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
}

export function authUser(req, res, next) {
  if (req.user.role !== "user" || req.user.role !== "admin" || !req.user.id) {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
}

export default authMidlleware;
