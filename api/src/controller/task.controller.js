import { prioridadeEnum, statusEnum } from "../enum/database.enum.js";
import Task from "../model/Tasks.js";
import tasksRepositories from "../repositories/tasks.repositorie.js";
import usersRepository from "../repositories/user.repositorie.js";
import jwt from "jsonwebtoken";
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
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Token não fornecido",
        });
      }
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded.userId);
      const userId = decoded.userId;
      if (!userId) {
        return res.status(400).json({
          message: "preencha todos os campos",
        });
      }
      const consultaUser = await usersRepository.listarIDUsuarios(userId);
      if (consultaUser.length === 0) {
        return res.status(404).json({
          message: "Usuario não encontrado",
        });
      }
      const response = await tasksRepositories.listarUserTask(userId);
      if (response.length === 0) {
        return res.status(200).json({
          message: "Nenhuma tarefa encontrada",
        });
      }
      return res.status(200).json({
        message: "Tarefas do usuário listadas com sucesso",
        result: response,
      });
    } catch (error) {
      console.error(error);
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(401).json({
          message: "Token inválido ou expirado",
        });
      }
      return res.status(500).json({
        message: "Erro no servidor",
        error: error.message,
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
          message: "Todos os campos são obrigatórios",
        });
      }
      if (
        status != statusEnum.pendente &&
        status != statusEnum.emAndamento &&
        status != statusEnum.concluida
      ) {
        return res.status(400).json({
          message: "status inválido",
        });
      }
      if (
        prioridade != prioridadeEnum.baixa &&
        prioridade != prioridadeEnum.media &&
        prioridade != prioridadeEnum.alta
      ) {
        return res.status(400).json({
          message: "prioridade inválido",
        });
      }
      const task = Task.criar({
        userId,
        nome,
        descricao,
        dataTarefa, // ano-mes-data
        prioridade,
        status,
      });
      console.log(
        "Task a ser criada:",
        task.userId,
        task.nome,
        task.descricao,
        task.dataTarefa,
        task.prioridade,
        task.status,
      );
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
          message: "ID da tarefa é obrigatório",
        });
      }
      const validarTask = await tasksRepositories.listarTask(id);
      if (validarTask.length === 0) {
        return res.status(404).json({
          message: "Tarefa não encontrada",
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
          dataTarefa: dataTarefaFinal, // ano-mes-data
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
          message: "ID da tarefa é obrigatório",
        });
      }
      const validarTask = await tasksRepositories.listarTask(id);
      if (validarTask.length === 0) {
        return res.status(404).json({
          message: "Tarefa não encontrada",
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
