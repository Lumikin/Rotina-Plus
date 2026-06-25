export class Users {
  #nome;
  #email;
  #senha;
  #dataNascimento;
  #id;
  constructor(nome, email, senha, dataNascimento, id) {
    this.#nome = nome;
    this.#email = email;
    this.#senha = senha;
    this.#dataNascimento = dataNascimento;
    this.#id = id;
  }

  get nome() {
    return this.#nome;
  }
  get email() {
    return this.#email;
  }
  get senha() {
    return this.#senha;
  }
  get dataNascimento() {
    return this.#dataNascimento;
  }
  get id() {
    return this.#id;
  }

  set nome(nome) {
    this.#nome = nome;
  }
  set email(email) {
    this.#email = email;
  }
  set senha(senha) {
    this.#senha = senha;
  }
  set dataNascimento(dataNascimento) {
    this.#dataNascimento = dataNascimento;
  }
  set id(id) {
    this.#id = id;
  }

  #validarID(value) {
    if (!value || isNaN(value) || value < 0)
      throw new Error("O campo ID é obrigatório e deve ter 3 e 45 caracteres");
  }

  #validarNome(value) {
    if (!value || value.length < 3 || value.length > 64)
      throw new Error(
        "O campo nome é obrigatório e deve ter 3 e 64 caracteres",
      );
  }

  static criar(data) {
    return new Users(
      data.nome,
      data.email,
      data.senha,
      data.dataNascimento,
      null,
    );
  }

  static atualizar(data, id) {
    return new Users(
      data.nome,
      data.email,
      data.senha,
      id,
    );
  }
}
