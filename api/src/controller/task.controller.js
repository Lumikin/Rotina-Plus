import { prioridadeEnum, statusEnum } from "../enum/database.enum.js";
import Task from "../model/Tasks.js";
import tasksRepositories from "../repositories/tasks.repositorie.js";

const tasksController = {
  listarTasks: async (req, res) => {
    try {
      const response = await tasksRepositories.listarTasks();
      if (response.length === 0) {
        return res.status(404).json({
          message: "Nenhuma tarefa encontrada",
        });
      }
      return res.status(200).json({
        message: "Tarefas Listadas:",
        result: response,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro no servidor",
        error: error.message,
      });
    }
  },
  listarUserTarefa: async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await tasksRepositories.listarUserTask(userId);
      if (response.length === 0) {
        return res.status(200).json({
          message: "Nao foi encontrada tarefas desse usuario",
        });
      }
      return res.status(200).json({
        response,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao buscar tarefas",
      });
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
        return res.status(400).json({
          message: "Todos os campos sao obrigatorios",
        });
      }
      if (
        status != statusEnum.pendente &&
        status != statusEnum.emAndamento &&
        status != statusEnum.concluida
      ) {
        return res.status(400).json({
          message: "status invalido",
        });
      }
      if (
        prioridade != prioridadeEnum.baixa &&
        prioridade != prioridadeEnum.media &&
        prioridade != prioridadeEnum.alta
      ) {
        return res.status(400).json({
          message: "prioridade invalido",
        });
      }
      const task = Task.criar({
        userId,
        nome,
        descricao,
        dataTarefa,
        prioridade,
        status,
      });
      const response = await tasksRepositories.criarTask(task);
      return res.status(201).json({
        message: "Tarefa criada com sucesso",
        result: response,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro no servidor",
        error: error.message,
      });
    }
  },
  atualizarTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "ID da tarefa e obrigatorio",
        });
      }
      const validarTask = await tasksRepositories.listarTask(id);
      if (validarTask.length === 0) {
        return res.status(404).json({
          message: "Tarefa nao encontrada",
        });
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
          dataTarefa: dataTarefaFinal,
          prioridade: prioridadeFinal,
          status: statusFinal,
        },
        id,
      );
      const response = await tasksRepositories.atualizarTask(id, task);
      return res.status(200).json({
        message: "Tarefa atualizada com sucesso",
        result: response,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro no servidor",
        error: error.message,
      });
    }
  },
  deletarTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "ID da tarefa e obrigatorio",
        });
      }
      const validarTask = await tasksRepositories.listarTask(id);
      if (validarTask.length === 0) {
        return res.status(404).json({
          message: "Tarefa nao encontrada",
        });
      }
      const response = await tasksRepositories.deletarTask(id);
      return res.status(200).json({
        message: "Tarefa deletada com sucesso",
        result: response,
      });
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
