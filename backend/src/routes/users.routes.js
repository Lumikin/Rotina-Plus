import { Router } from "express";
import usersController from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get("/", usersController.listarUsuarios);
userRouter.post("/", usersController.criarUsuarios);

userRouter.get("/:id", usersController.listarIDUsuarios);
userRouter.put("/:id", usersController.alterarUsuario);
userRouter.delete("/:id", usersController.deletarUsuario);

export default userRouter;
