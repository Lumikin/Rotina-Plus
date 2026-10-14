export class Task {
  constructor({ userId, nome, descricao, dataTarefa, prioridade, status, UUID = null, recorrencia = "Unica" }) {
    this.userId = userId;
    this.nome = nome;
    this.descricao = descricao;
    this.dataTarefa = dataTarefa;
    this.prioridade = prioridade;
    this.status = status;
    this.UUID = UUID;
    this.recorrencia = recorrencia ?? "Unica";
  }

  static criar(data) {
    return new Task(data);
  }

  static atualizar(data, UUID) {
    return new Task({ ...data, UUID });
  }
}

export default Task;
