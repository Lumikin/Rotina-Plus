import { prioridadeEnum, recorrenciaEnum, statusEnum } from "../enum/database.enum.js";
import Task from "../model/Tasks.js";
import tasksRepositories from "../repositories/tasks.repository.js";

function erro(res, error) {
  console.error(error.message);
  return res.status(500).json({ message: "Erro no servidor", error: error.message });
}

function recorrenciaValida(value) {
  return Object.values(recorrenciaEnum).includes(value ?? recorrenciaEnum.unica);
}

const tasksController = {
  obterOfensiva: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "ID do usuário é obrigatório" });
      const totalDias = await tasksRepositories.obterOfensiva(userId);
      return res.status(200).json({ message: "Ofensiva obtida com sucesso", totalDias });
    } catch (error) {
      return erro(res, error);
    }
  },

  obterPontos: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "ID do usuário é obrigatório" });
      const totalPontos = await tasksRepositories.obterPontosUsuario(userId);
      return res.status(200).json({ message: "Pontos obtidos com sucesso", totalPontos });
    } catch (error) {
      return erro(res, error);
    }
  },

  listarTasks: async (_req, res) => {
    try {
      await tasksRepositories.atualizarTarefasAtrasadas();
      const response = await tasksRepositories.listarTasks();
      if (response.length === 0) {
        return res.status(404).json({ message: "Nenhuma tarefa se encontra registrada." });
      }
      return res.status(200).json({ message: "Tarefas Listadas:", result: response });
    } catch (error) {
      return erro(res, error);
    }
  },

  listarUserTarefa: async (req, res) => {
    try {
      const { userId } = req.params;
      await tasksRepositories.atualizarTarefasAtrasadas();
      const response = await tasksRepositories.listarUserTask(userId);
      if (response.length === 0) {
        return res.status(200).json({ message: "Não foi encontrada tarefas deste usuário" });
      }
      return res.status(200).json({ response });
    } catch (error) {
      return erro(res, error);
    }
  },

  listarTarefasAtrasadas: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "ID do usuário é obrigatório" });
      }

      // Garante que o status de atraso esteja atualizado antes de listar.
      await tasksRepositories.atualizarTarefasAtrasadas();
      const atrasadas = await tasksRepositories.listarUserTarefasAtrasadas(userId);

      return res.status(200).json({
        message: "Tarefas atrasadas obtidas com sucesso",
        result: atrasadas,
        total: atrasadas.length,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar tarefas atrasadas", error: error.message });
    }
  },

  criarTask: async (req, res) => {
    try {
      const { userId, nome, descricao, dataTarefa, prioridade, status, recorrencia } = req.body;
      if (!userId || !nome || !descricao || !dataTarefa || !prioridade || !status) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }
      if (!Object.values(statusEnum).includes(status)) {
        return res.status(400).json({ message: "status invalido" });
      }
      if (!Object.values(prioridadeEnum).includes(prioridade)) {
        return res.status(400).json({ message: "Prioridade inválida" });
      }
      if (!recorrenciaValida(recorrencia)) {
        return res.status(400).json({ message: "Recorrência inválida. Use: Unica, Diaria, Semanal ou Mensal" });
      }
      const task = Task.criar({ userId, nome, descricao, dataTarefa, prioridade, status, recorrencia: recorrencia ?? recorrenciaEnum.unica });
      const response = await tasksRepositories.criarTask(task);
      return res.status(201).json({ message: "Tarefa criada com sucesso", result: response });
    } catch (error) {
      return erro(res, error);
    }
  },

  atualizarTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "ID da tarefa é obrigatório" });
      const existente = await tasksRepositories.listarTask(id);
      if (existente.length === 0) return res.status(404).json({ message: "Tarefa não encontrada" });
      const atual = existente[0];
      const { nome, descricao, dataTarefa, prioridade, status, recorrencia } = req.body;
      const dados = {
        nome: nome || atual.nome,
        descricao: descricao || atual.descricao,
        dataTarefa: dataTarefa || atual.dataTarefa,
        prioridade: prioridade || atual.prioridade,
        status: status || atual.status,
        recorrencia: recorrencia ?? atual.recorrencia ?? recorrenciaEnum.unica,
      };
      if (!recorrenciaValida(dados.recorrencia)) {
        return res.status(400).json({ message: "Recorrência inválida. Use: Unica, Diaria, Semanal ou Mensal" });
      }
      const response = await tasksRepositories.atualizarTask(id, Task.atualizar(dados, id));
      return res.status(200).json({ message: "Tarefa atualizada com sucesso", result: response });
    } catch (error) {
      if (error.message === "Tarefa nao encontrada") {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }
      return erro(res, error);
    }
  },

  concluirTask: async (req, res) => {
    try {
      const { UUID } = req.params;
      if (!UUID) return res.status(400).json({ message: "ID da tarefa é obrigatório" });
      const concluir = await tasksRepositories.concluirTask(UUID);
      if (concluir?.proximaTarefa) {
        return res.status(200).json({ message: "Tarefa concluída com sucesso. Próxima ocorrência criada.", result: concluir, proximaTarefa: concluir.proximaTarefa });
      }
      return res.status(200).json({ message: "Tarefa concluída com sucesso", result: concluir });
    } catch (error) {
      if (error.message === "Tarefa nao encontrada") {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }
      return erro(res, error);
    }
  },

  deletarTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "ID da tarefa e obrigatório" });
      const existente = await tasksRepositories.listarTask(id);
      if (existente.length === 0) return res.status(404).json({ message: "Tarefa não encontrada" });
      const response = await tasksRepositories.deletarTask(id);
      return res.status(200).json({ message: "Tarefa deletada com sucesso", result: response });
    } catch (error) {
      return erro(res, error);
    }
  },

  listarRanking: async (_req, res) => {
    try {
      const ranking = await tasksRepositories.listarRanking();
      return res.status(200).json({ message: "Ranking obtido com sucesso", result: ranking });
    } catch (error) {
      return erro(res, error);
    }
  },
};

export default tasksController;
