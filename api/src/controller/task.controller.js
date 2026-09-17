import { prioridadeEnum, statusEnum } from "../enum/database.enum.js";
import Task from "../model/Tasks.js";
import tasksRepositories from "../repositories/tasks.repositorie.js";

const tasksController = {
  listarTasks: async (_req, res) => {
    try {
      const response = await tasksRepositories.listarTasks();

      if (response.length === 0) {
        return res.status(404).json({message: "Nenhuma tarefa se encontra registrada."});
      }

      return res.status(200).json({message: "Tarefas Listadas:", result: response});

    } catch (error) {
      
      console.error(error);
      return res.status(500).json({message: "Erro no servidor", error: error.message});
    }
  },

  listarUserTarefa: async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await tasksRepositories.listarUserTask(userId);

      if (response.length === 0) {
        return res
          .status(200)
          .json({ message: "Não foi encontrada tarefas deste usuário" });
      }
      return res.status(200).json({ response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar tarefas" });
    }
  },

  criarTask: async (req, res) => {
    try {
      const { userId, nome, descricao, dataTarefa, prioridade, status } =
        req.body;
      if (
        !userId ||
        !nome ||
        !descricao ||
        !dataTarefa ||
        !prioridade ||
        !status
      ) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      if (status != statusEnum.pendente && status != statusEnum.emAndamento && status != statusEnum.concluida
      ) {
        return res.status(400).json({ message: "status invalido" });
      }
      if (
        prioridade != prioridadeEnum.baixa &&
        prioridade != prioridadeEnum.media &&
        prioridade != prioridadeEnum.alta
      ) {
        return res.status(400).json({message: "Prioridade inválida"});
      }
      const task = Task.criar({userId, nome, descricao, dataTarefa, prioridade, status});
      const response = await tasksRepositories.criarTask(task);
      return res.status(201).json({
        message: "Tarefa criada com sucesso",
        result: response,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro no servidor", error: error.message});
    }
  },

  atualizarTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({message: "ID da tarefa é obrigatório"});
      }
      const validarTask = await tasksRepositories.listarTask(id);
      if (validarTask.length === 0) {
        return res.status(404).json({message: "Tarefa não encontrada"});
      }
      const dadosAtuais = validarTask[0];

      const { nome, descricao, dataTarefa, prioridade, status } = req.body;

      const nomeFinal = nome || dadosAtuais.nome;
      const descricaoFinal = descricao || dadosAtuais.descricao;
      const dataTarefaFinal = dataTarefa || dadosAtuais.dataTarefa;
      const prioridadeFinal = prioridade || dadosAtuais.prioridade;
      const statusFinal = status || dadosAtuais.status;

      const task = Task.atualizar(
        {
          nome: nomeFinal,
          descricao: descricaoFinal,
          dataTarefa: dataTarefaFinal, // ano-mes-data
          prioridade: prioridadeFinal, //
          status: statusFinal,
        },
        id,
      );
      const response = await tasksRepositories.atualizarTask(id, task);
      return res.status(200).json({message: "Tarefa atualizada com sucesso", result: response});

    } catch (error) {
      console.error(error);
      if (error.message === "Tarefa não encontrada") {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({message: "Erro no servidor", error: error.message});
    }
  },

  concluirTask: async (req, res) => {
    try {
      const { UUID } = req.params;

      const concluir = await tasksRepositories.concluirTask(UUID);
      return res.status(200).json({
        message: "tarefa alterada",
        result: concluir,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        sucess: false,
        error: error.message,
      });
    }
  },

  deletarTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID da tarefa e obrigatório" });
      }
      const validarTask = await tasksRepositories.listarTask(id);
      if (validarTask.length === 0) {
        return res.status(404).json({message: "Tarefa não encontrada"});
      }
      const response = await tasksRepositories.deletarTask(id);
      return res.status(200).json({message: "Tarefa deletada com sucesso", result: response});

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro no servidor",
        error: error.message,
      });
    }
  },
};

export default tasksController;
