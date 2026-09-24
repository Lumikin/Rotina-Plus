import { Router } from "express";
import tasksController from "../controller/task.controller.js";

const tasksRoutes = Router();

tasksRoutes.get("/", tasksController.listarTasks);
tasksRoutes.get("/ofensiva/:userId", tasksController.obterOfensiva);
tasksRoutes.get("/:userId", tasksController.listarUserTarefa);
tasksRoutes.post("/", tasksController.criarTask);
tasksRoutes.put("/:id", tasksController.atualizarTask);
tasksRoutes.put("/:UUID/concluir", tasksController.concluirTask);
tasksRoutes.delete("/:id", tasksController.deletarTask);



export default tasksRoutes;