import Router from "express";
import tasksController from "../controller/task.controller.js";
import authMidlleware, { authUser } from "../middlewares/auth.middleware.js";
const tasksRoutes = Router();

tasksRoutes.get("/", tasksController.listarTasks);
tasksRoutes.get("/:userId", tasksController.listarUserTarefa);
tasksRoutes.put("/:id", tasksController.atualizarTask);
tasksRoutes.post("/", tasksController.criarTask);
tasksRoutes.delete("/:id", tasksController.deletarTask);

export default tasksRoutes;
