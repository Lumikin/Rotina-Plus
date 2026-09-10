import bcrypt from "bcrypt"; // Criptografia
import usersRepository from "../repositories/user.repositorie.js";
import { Users } from "../model/Users.js";

const saltRounds = 10; //O quao complexo será o hash

const usersController = {
  listarUsuarios: async (req, res) => {
    try {
      const result = await usersRepository.listarUsuarios();
      if (result.length === 0) {
        return res.status(200).json({
          message: "Nao existe usuarios cadastrados",
        });
      }
      return res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        error: error.message,
      });
    }
  },
  listarIDUsuarios: async (req, res) => {
    try {
      const idUsuario = req.params.id;
      const result = await usersRepository.listarIDUsuarios(idUsuario);
      if (!idUsuario || idUsuario.length <= 0 || isNaN(idUsuario)) {
        return res.status(404).json({
          message: "Id invalido",
        });
      }
      if (result.length === 0) {
        return res.status(404).json({
          message: "Usuario nao encontrado",
        });
      }
      return res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        error: error.message,
      });
    }
  },
  alterarUsuario: async (req, res) => {
    try {
      const idUsuario = req.params.id;

      let { nome, email, senha } = req.body;

      if (!idUsuario || isNaN(Number(idUsuario))) {
        return res.status(400).json({ message: "Id invalido" });
      }
      const userAtual = await usersRepository.buscarUsuarioPorId(idUsuario);
      if (!userAtual || userAtual.length === 0) {
        // Se o usuario nao for encontrado retorna um erro
        return res.status(404).json({ message: "Usuario nao encontrado" });
      }
      if (senha && senha.length < 4) {
        return res
          .status(400)
          .json({ message: "A senha deve ter no minimo 4 caracteres" });
      }
      if (!nome && !email && !senha) {
        // Se nenhum campo for preenchido retorna um erro
        return res.status(400).json({
          message: "Pelo menos um campo é obrigatório para atualização",
        });
      }

      const dadosAtuais = userAtual[0]; // Dados atuais do usuario

      nome = nome || dadosAtuais.nome;
      email = email || dadosAtuais.email;

      let hashedPassword; // Hash da senha
      if (senha) {
        const senhaDuplicada = await bcrypt.compare(
          senha,
          dadosAtuais.password_hash,
        );
        if (senhaDuplicada) {
          return res
            .status(400)
            .json({ message: "A senha não pode ser a mesma que a atual" });
        }
        // Se tiver uma senha nova, calcula o hash
        hashedPassword = await bcrypt.hash(senha, saltRounds);
      } else {
        // Se nao, mantem o atual
        hashedPassword = dadosAtuais.password_hash;
      }

      const user = await Users.atualizar(
        { nome, email, senha: hashedPassword },
        idUsuario,
      );
      console.log(user);
      const updated = await usersRepository.alterarUsuario(idUsuario, user);
      return res.status(200).json({ result: updated });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ocorreu um erro no servidor", error: error.message });
    }
  },
  deletarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await usersRepository.listarIDUsuarios(id);
      if (!user || user.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      const result = await usersRepository.deletarUsuario(id);
      return res
        .status(200)
        .json({ message: "usuario deletado!", result: result });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ocorreu um erro no servidor", error: error.message });
    }
  },
};

export default usersController;
