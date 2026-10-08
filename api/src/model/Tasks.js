export class Task {
  #UUID;
  #userId;
  #nome;
  #descricao;
  #dataTarefa;
  #prioridade;
  #status;
  #pontos;
  #recorrencia;
  #dataConclusao;

  constructor(
    userId,
    nome,
    descricao,
    dataTarefa,
    prioridade,
    status,
    UUID,
    pontos,
    recorrencia = "nenhuma",
    dataConclusao = null,
  ) {
    this.#userId = userId;
    this.#nome = nome;
    this.#descricao = descricao;
    this.#dataTarefa = dataTarefa;
    this.#prioridade = prioridade;
    this.#status = status;
    this.#UUID = UUID;
    this.#pontos = pontos;
    this.#recorrencia = recorrencia ?? "nenhuma";
    this.#dataConclusao = dataConclusao;
  }

  get UUID() {
    return this.#UUID;
  }

  get userId() {
    return this.#userId;
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

  get pontos() {
    return this.#pontos;
  }

  get recorrencia() {
    return this.#recorrencia;
  }

  get dataConclusao() {
    return this.#dataConclusao;
  }

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

  set userId(value) {
    this.#userId = value;
  }

  set UUID(value) {
    this.#UUID = value;
  }

  set pontos(value) {
    this.#pontos = value;
  }

  set recorrencia(value) {
    this.#recorrencia = value;
  }

  set dataConclusao(value) {
    this.#dataConclusao = value;
  }

  #validarnome(value) {
    if (!value || value.length < 3 || value.length > 64) {
      throw new Error("nome deve ter entre 3 e 64 caracteres");
    }
  }

  #validarDescricao(value) {
    if (value && value.length > 255) {
      throw new Error("Descricao nao pode passar de 255 caracteres");
    }
  }

  #validarData(value) {
    if (!value) {
      throw new Error("Data da tarefa e obrigatoria");
    }
  }

  #validarprioridade(value) {
    const validos = ["Baixa", "Media", "Alta"];
    if (!validos.includes(value)) {
      throw new Error("prioridade invalida");
    }
  }

  #validarstatus(value) {
    const validos = ["Pendente", "Em andamento", "Concluida"];
    if (!validos.includes(value)) {
      throw new Error("status invalido");
    }
  }

  #validarRecorrencia(value) {
    const validos = ["nenhuma", "diaria", "semanal", "mensal"];
    if (value !== undefined && value !== null && !validos.includes(value)) {
      throw new Error("recorrencia invalida");
    }
  }

  #validarPontos(value) {
    if (value === undefined || value === null) return;
    if (value < 0 || value > 100) {
      throw new Error("Pontos devem estar entre 0 e 100");
    }
  }

  static criar(data) {
    return new Task(
      data.userId,
      data.nome,
      data.descricao,
      data.dataTarefa,
      data.prioridade,
      data.status,
      null,
      data.pontos,
      data.recorrencia ?? "nenhuma",
    );
  }

  static atualizar(data, UUID) {
    return new Task(
      data.userId,
      data.nome,
      data.descricao,
      data.dataTarefa,
      data.prioridade,
      data.status,
      UUID,
      data.pontos,
      data.recorrencia,
    );
  }
}
export default Task;
