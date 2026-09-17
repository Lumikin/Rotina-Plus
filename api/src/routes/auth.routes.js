import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authController from "../controller/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.criarUsuarios);
authRoutes.post("/verify", authController.verificarCodigo);
authRoutes.post("/resend-email", authController.reenviarEmail);
authRoutes.put("/alterar-senha", authMiddleware, authController.mudarSenha);

export default authRoutes;