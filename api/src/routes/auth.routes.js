import { Router } from "express";
import authController from "../controller/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.criarUsuarios);
authRoutes.post("/verify", authController.verificarCodigo);
authRoutes.post("/resend-email", authController.reenviarEmail);

export default authRoutes;
