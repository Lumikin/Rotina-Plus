import { Router } from "express";
import usersController from "../controller/user.controller.js";

import authMidlleware, { authAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", usersController.listarUsuarios);
userRouter.put("/:id", usersController.alterarUsuario);

userRouter.get("/:id", usersController.listarIDUsuarios);
userRouter.delete("/:id", usersController.deletarUsuario);

export default userRouter;
