export class Users {
  #nome;
  #email;
  #senha;
  #dataNascimento;
  #UUID;

  constructor(nome, email, senha, dataNascimento, UUID) {
    this.#nome = nome;
    this.#email = email;
    this.#senha = senha;
    this.#dataNascimento = dataNascimento;
    this.#UUID = UUID;
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
  get UUID() {
    return this.#UUID;
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
  set UUID(UUID) {
    this.#UUID = UUID;
  }

  #validarNome(value) {
    if (!value || value.length < 3 || value.length > 64)
      throw new Error(
        "O campo nome e obrigatorio e deve ter entre 3 e 64 caracteres",
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

  static atualizar(data, UUID) {
    return new Users(
      data.nome,
      data.email,
      data.senha,
      data.dataNascimento,
      UUID,
    );
  }
}
