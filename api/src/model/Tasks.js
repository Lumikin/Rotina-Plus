export class Task {
  #tarefaID;
  #clienteId;
  #nome;
  #descricao;
  #dataTarefa;
  #prioridade;
  #status;

  constructor(
    clienteId,
    nome,
    descricao,
    dataTarefa,
    prioridade,
    status,
    tarefaID,
  ) {
    this.#clienteId = clienteId;
    this.#nome = nome;
    this.#descricao = descricao;
    this.#dataTarefa = dataTarefa;
    this.#prioridade = prioridade;
    this.#status = status;
    this.#tarefaID = tarefaID;
  }

  // GETTERS
  get tarefaID() {
    return this.#tarefaID;
  }

  get clienteId() {
    return this.#clienteId;
  }

  get nome() {
    return this.#nome;
  }

  get descricao() {
    return this.#descricao;
  }

  get dataTarefa() {
    return this.#dataTarefa;
  }

  get prioridade() {
    return this.#prioridade;
  }

  get status() {
    return this.#status;
  }

  // SETTERS
  set nome(value) {
    this.#nome = value;
  }

  set descricao(value) {
    this.#descricao = value;
  }

  set dataTarefa(value) {
    this.#dataTarefa = value;
  }

  set prioridade(value) {
    this.#prioridade = value;
  }

  set status(value) {
    this.#status = value;
  }

  set clienteId(value) {
    this.#clienteId = value;
  }

  set tarefaID(value) {
    this.#tarefaID = value;
  }

  // VALIDADORES
  #validarnome(value) {
    if (!value || value.length < 3 || value.length > 64) {
      throw new Error("nome deve ter entre 3 e 64 caracteres");
    }
  }

  #validarDescricao(value) {
    if (value && value.length > 255) {
      throw new Error("Descrição não pode passar de 255 caracteres");
    }
  }

  #validarData(value) {
    if (!value) {
      throw new Error("Data da tarefa é obrigatória");
    }
  }

  #validarprioridade(value) {
    const validos = ["Baixa", "Media", "Alta"];
    if (!validos.includes(value)) {
      throw new Error("prioridade inválida");
    }
  }

  #validarstatus(value) {
    const validos = ["Pendente", "Em andamento", "Concluida"];
    if (!validos.includes(value)) {
      throw new Error("status inválido");
    }
  }

  // FACTORY METHODS
  static criar(data) {
    return new Task(
      data.clienteId,
      data.nome,
      data.descricao,
      data.dataTarefa,
      data.prioridade,
      data.status,
      null,
    );
  }

  static atualizar(data, id) {
    return new Task(
      data.clienteId,
      data.nome,
      data.descricao,
      data.dataTarefa,
      data.prioridade,
      data.status,
      id,
    );
  }
}
export default Task;
