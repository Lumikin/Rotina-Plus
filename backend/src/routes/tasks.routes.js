import Router from "express";
import tasksController from "../controller/task.controller.js";
import authMidlleware, { authUser } from "../middlewares/auth.middleware.js";
const tasksRoutes = Router();

tasksRoutes.get("/", tasksController.listarTasks);
tasksRoutes.get(
  "/:userId",
  authMidlleware,
  authUser,
  tasksController.listarUserTarefa,
);
tasksRoutes.post("/", tasksController.criarTask);
tasksRoutes.put("/:id", tasksController.atualizarTask);
tasksRoutes.delete('/:id', tasksController.deletarTask);

export default tasksRoutes;
