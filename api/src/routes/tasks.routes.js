import { Router } from "express";
import tasksController from "../controller/task.controller.js";

const tasksRoutes = Router();

tasksRoutes.get("/", tasksController.listarTasks);
tasksRoutes.get("/:userId", tasksController.listarUserTarefa);
tasksRoutes.post("/", tasksController.criarTask);
tasksRoutes.put("/:id", tasksController.atualizarTask);
tasksRoutes.patch("/:id/status", tasksController.atualizarStatus);
tasksRoutes.patch("/:id/concluir", tasksController.concluirTask);
tasksRoutes.delete("/:id", tasksController.deletarTask);

export default tasksRoutes;