export class Users {
  constructor({ nome, email, senha, dataNascimento, UUID = null }) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.dataNascimento = dataNascimento;
    this.UUID = UUID;
  }

  static criar(data) {
    return new Users(data);
  }

  static atualizar(data, UUID) {
    return new Users({ ...data, UUID });
  }
}
