import { randomUUID } from "node:crypto";
import { prioridadeEnum, recorrenciaEnum, statusEnum } from "../enum/database.enum.js";
import { pontosEnum } from "../enum/pontos.enum.js";
import Task from "../model/Tasks.js";
import tasksRepositories from "../repositories/tasks.repository.js";
import pontosRepository from "../repositories/pontos.repository.js";

const tasksController = {
  erro: (res, error) => {
    console.error(error.message);
    return res.status(500).json({ message: "Erro no servidor", error: error.message });
  },

  recorrenciaValida: (value) => {
    return Object.values(recorrenciaEnum).includes(value ?? recorrenciaEnum.unica);
  },

  pontosDe: (prioridade) => {
    return pontosEnum[String(prioridade ?? "").toLowerCase()] ?? 0;
  },

  hojeKey: () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${dia}`;
  },

  chaveData: (dataTarefa) => {
    if (dataTarefa instanceof Date && !Number.isNaN(dataTarefa.getTime())) {
      const m = String(dataTarefa.getMonth() + 1).padStart(2, "0");
      const dia = String(dataTarefa.getDate()).padStart(2, "0");
      return `${dataTarefa.getFullYear()}-${m}-${dia}`;
    }
    return String(dataTarefa).slice(0, 10);
  },

  comAtraso: (dataTarefa, status) => {
    if (!dataTarefa || status === "Concluida") return status;
    return tasksController.chaveData(dataTarefa) < tasksController.hojeKey() ? "Pendente" : status;
  },

  diaAnterior: (chave) => {
    const d = new Date(chave + "T12:00:00");
    d.setDate(d.getDate() - 1);
    return tasksController.chaveData(d);
  },

  proximaData: (dataTarefa, recorrencia) => {
    const r = String(recorrencia ?? "").toLowerCase();
    if (r === "unica") return null;
    const [ano, mes, dia] = tasksController.chaveData(dataTarefa).split("-").map(Number);
    if (!ano || !mes || !dia) return null;
    const base = new Date(ano, mes - 1, dia, 12);
    if (r === "diaria") base.setDate(base.getDate() + 1);
    else if (r === "semanal") base.setDate(base.getDate() + 7);
    else if (r === "mensal") base.setMonth(base.getMonth() + 1);
    else return null;
    const m = String(base.getMonth() + 1).padStart(2, "0");
    const d = String(base.getDate()).padStart(2, "0");
    return `${base.getFullYear()}-${m}-${d}`;
  },

  calcularOfensiva: (linhas) => {
    const hoje = tasksController.hojeKey();
    const dias = linhas
      .map((r) => tasksController.chaveData(r.dia))
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= hoje);
    if (!dias.length) return 0;
    if (dias[0] !== hoje && dias[0] !== tasksController.diaAnterior(hoje)) return 0;
    let ofensiva = 1;
    for (let i = 1; i < dias.length; i++) {
      if (dias[i] === tasksController.diaAnterior(dias[i - 1])) ofensiva++;
      else break;
    }
    return ofensiva;
  },

  criarProximaOcorrencia: async (tarefa) => {
    const recorrencia = tarefa?.recorrencia ?? "Unica";
    if (String(recorrencia).toLowerCase() === "unica") return null;
    const data = tasksController.proximaData(tarefa.dataTarefa, recorrencia);
    if (!data) return null;
    await tasksRepositories.inserirProximaOcorrencia(
      tarefa.userId,
      tarefa.nome,
      tarefa.descricao ?? "",
      data,
      tarefa.prioridade,
      recorrencia,
    );
    return { dataTarefa: data, recorrencia };
  },

  obterOfensiva: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "ID do usuário é obrigatório" });
      const linhas = await tasksRepositories.listarDiasConclusao(userId);
      const totalDias = tasksController.calcularOfensiva(linhas);
      return res.status(200).json({ message: "Ofensiva obtida com sucesso", totalDias });
    } catch (error) {
      return tasksController.erro(res, error);
    }
  },

  obterPontos: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "ID do usuário é obrigatório" });
      const linhas = await pontosRepository.obterPontosUsuario(userId);
      const totalPontos = linhas[0]?.totalPontos ?? 0;
      return res.status(200).json({ message: "Pontos obtidos com sucesso", totalPontos });
    } catch (error) {
      return tasksController.erro(res, error);
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
      return tasksController.erro(res, error);
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
      return tasksController.erro(res, error);
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
      if (!tasksController.recorrenciaValida(recorrencia)) {
        return res.status(400).json({ message: "Recorrência inválida. Use: Unica, Diaria, Semanal ou Mensal" });
      }
      const task = Task.criar({ userId, nome, descricao, dataTarefa, prioridade, status, recorrencia: recorrencia ?? recorrenciaEnum.unica });
      const id = randomUUID();
      const statusFinal = tasksController.comAtraso(task.dataTarefa, task.status);
      const recorrenciaFinal = task.recorrencia ?? recorrenciaEnum.unica;
      const concluida = statusFinal === "Concluida";
      const dataConclusao = concluida ? new Date() : task.dataTarefa;
      await tasksRepositories.inserirTask(id, task.userId, task.nome, task.descricao, task.dataTarefa, dataConclusao, task.prioridade, statusFinal, recorrenciaFinal);
      if (concluida) {
        await pontosRepository.adicionarPontos(id, tasksController.pontosDe(task.prioridade));
      }
      const response = { insertId: id };
      return res.status(201).json({ message: "Tarefa criada com sucesso", result: response });
    } catch (error) {
      return tasksController.erro(res, error);
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
      if (!tasksController.recorrenciaValida(dados.recorrencia)) {
        return res.status(400).json({ message: "Recorrência inválida. Use: Unica, Diaria, Semanal ou Mensal" });
      }
      const tarefaAtualizada = Task.atualizar(dados, id);
      const statusFinal = tasksController.comAtraso(tarefaAtualizada.dataTarefa, tarefaAtualizada.status);
      const recorrenciaFinal = tarefaAtualizada.recorrencia ?? atual.recorrencia ?? recorrenciaEnum.unica;
      const virouConcluida = atual.status !== "Concluida" && statusFinal === "Concluida";
      if (virouConcluida) {
        await pontosRepository.adicionarPontos(id, tasksController.pontosDe(tarefaAtualizada.prioridade));
      }
      const dataConclusao = virouConcluida ? new Date() : (atual.DataConclusao ?? atual.dataConclusao ?? tarefaAtualizada.dataTarefa);
      const resultado = await tasksRepositories.atualizarTaskDados(id, tarefaAtualizada.nome, tarefaAtualizada.descricao, tarefaAtualizada.dataTarefa, tarefaAtualizada.prioridade, statusFinal, recorrenciaFinal, dataConclusao);
      const proximaTarefa = virouConcluida
        ? await tasksController.criarProximaOcorrencia({ ...atual, ...tarefaAtualizada, recorrencia: recorrenciaFinal })
        : null;
      const response = { ...resultado, proximaTarefa };
      return res.status(200).json({ message: "Tarefa atualizada com sucesso", result: response });
    } catch (error) {
      return tasksController.erro(res, error);
    }
  },

  concluirTask: async (req, res) => {
    try {
      const { UUID } = req.params;
      if (!UUID) return res.status(400).json({ message: "ID da tarefa é obrigatório" });
      const existente = await tasksRepositories.listarTask(UUID);
      if (existente.length === 0) return res.status(404).json({ message: "Tarefa não encontrada" });
      const atual = existente[0];
      const concluindo = atual.status !== "Concluida";
      if (concluindo) {
        await pontosRepository.adicionarPontos(UUID, tasksController.pontosDe(atual.prioridade));
      } else {
        await pontosRepository.removerPontos(UUID);
      }
      const dataConclusao = concluindo ? new Date() : (atual.DataConclusao ?? atual.dataConclusao ?? atual.dataTarefa);
      const resultado = await tasksRepositories.atualizarStatusConclusao(UUID, concluindo ? "Concluida" : "Em andamento", dataConclusao);
      const proximaTarefa = concluindo ? await tasksController.criarProximaOcorrencia(atual) : null;
      const concluir = { ...resultado, proximaTarefa };
      if (concluir?.proximaTarefa) {
        return res.status(200).json({ message: "Tarefa concluída com sucesso. Próxima ocorrência criada.", result: concluir, proximaTarefa: concluir.proximaTarefa });
      }
      return res.status(200).json({ message: "Tarefa concluída com sucesso", result: concluir });
    } catch (error) {
      return tasksController.erro(res, error);
    }
  },

  deletarTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "ID da tarefa e obrigatório" });
      const existente = await tasksRepositories.listarTask(id);
      if (existente.length === 0) return res.status(404).json({ message: "Tarefa não encontrada" });
      await pontosRepository.removerPontos(id);
      const response = await tasksRepositories.deletarTask(id);
      return res.status(200).json({ message: "Tarefa deletada com sucesso", result: response });
    } catch (error) {
      return tasksController.erro(res, error);
    }
  },

  listarRanking: async (_req, res) => {
    try {
      const ranking = await pontosRepository.listarRanking();
      return res.status(200).json({ message: "Ranking obtido com sucesso", result: ranking });
    } catch (error) {
      return tasksController.erro(res, error);
    }
  },
};

export default tasksController;
