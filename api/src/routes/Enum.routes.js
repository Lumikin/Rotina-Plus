import { Router } from "express";
import tasksRepositories from "../repositories/tasks.repositorie.js";
import { statusEnum } from "../enums/statusEnum.js";

const router = Router();

router.patch("/tasks/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(statusEnum).includes(status)) {
    return res.status(400).json({ erro: "Status inválido." });
  }

  if (status === statusEnum.concluida) {
    return res.status(400).json({erro: "Use a rota /tasks/:id/concluir para concluir uma tarefa."});
  }

  const [tarefaAtual] = await connection.execute(`SELECT * FROM tarefas WHERE tarefaID = ?`, [id]);

  if (!tarefaAtual.length) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  const result = await tasksRepositories.atualizarTask(id, {
    ...tarefaAtual[0],
    status,
  });

  return res.json(result);
});

// Conclui a tarefa e soma pontos
router.patch("/tasks/:id/concluir", async (req, res) => {
  const { id } = req.params;

  const [tarefaAtual] = await connection.execute(
    `SELECT * FROM tarefas WHERE tarefaID = ?`,
    [id]
  );

  if (!tarefaAtual.length) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  if (tarefaAtual[0].Status === statusEnum.concluida) {
    return res.status(400).json({ erro: "Tarefa já concluída." });
  }

  const result = await tasksRepositories.atualizarTask(id, {
    nome: tarefaAtual[0].Nome,
    descricao: tarefaAtual[0].descricao,
    dataTarefa: tarefaAtual[0].DataTarefa,
    prioridade: tarefaAtual[0].Prioridade,
    status: statusEnum.concluida,
  });

  return res.json(result);
});

export default router;