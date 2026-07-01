import { Router } from "express";
import authMidlleware from "../middlewares/auth.middleware.js";
import authController from "../controller/auth.controller.js";
import { authPlugins } from "mysql2";

const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.criarUsuarios);

export default authRoutes;
