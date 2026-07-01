import Task from "../model/Tasks.js";
import tasksRepositories from "../repositories/tasks.repositories.js";
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded.clienteId);
      const userId = decoded.clienteId;
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
      return res.status(500).json({
        message: "Erro no servidor",
        error: error.message,
      });
    }
  },
  criarTask: async (req, res) => {
    try {
      const { clienteId, nome, descricao, dataTarefa, prioridade, status } =
        req.body;
      if (
        !clienteId ||
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
        status != "Pendente" &&
        status != "Em andamento" &&
        status != "Concluída"
      ) {
        return res.status(400).json({
          message: "status inválido",
        });
      }
      if (
        prioridade != "Baixa" &&
        prioridade != "Media" &&
        prioridade != "Alta"
      ) {
        return res.status(400).json({
          message: "prioridade inválido",
        });
      }
      const task = Task.criar({
        clienteId,
        nome,
        descricao,
        dataTarefa, // ano-mes-data
        prioridade,
        status,
      });
      console.log(
        "Task a ser criada:",
        task.clienteId,
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
      const validarTask = await tasksRepositories.listarTask(id);
      if (validarTask.length === 0) {
        return res.status(404).json({
          message: "Tarefa não encontrada",
        });
      }
      const { clienteId, nome, descricao, dataTarefa, prioridade, status } =
        req.body;
      if (!id) {
        return res.status(400).json({
          message: "ID da tarefa é obrigatório",
        });
      }
      const tarefaAtual = await tasksRepositories.listarTask(id);

      clienteId ? (tarefaAtual.clienteId = clienteId) : clienteId;
      nome ? (tarefaAtual.nome = nome) : nome;
      descricao ? (tarefaAtual.descricao = descricao) : descricao;
      dataTarefa ? (tarefaAtual.dataTarefa = dataTarefa) : dataTarefa;
      prioridade ? (tarefaAtual.prioridade = prioridade) : prioridade;
      status ? (tarefaAtual.status = status) : status;

      const task = Task.atualizar(
        {
          clienteId,
          nome,
          descricao,
          dataTarefa, // ano-mes-data
          prioridade,
          status,
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
      if(!id){
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
