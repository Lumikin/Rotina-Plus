import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.config.js";

export function verifyLinkToken(token, claim) {
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (erro) {
    return {
      ok: false,
      expirado: erro.name === "TokenExpiredError",
    };
  }
  if (payload[claim] !== true) {
    return { ok: false, expirado: false };
  }
  return { ok: true, payload };
}
