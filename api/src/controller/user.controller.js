import bcrypt from "bcrypt";
import usersRepository from "../repositories/user.repositorie.js";
import { Users } from "../model/Users.js";

const saltRounds = 10;

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
      if (!idUsuario || idUsuario.length === 0) {
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

      if (!idUsuario || idUsuario.length === 0) {
        return res.status(400).json({ message: "Id invalido" });
      }
      const userAtual = await usersRepository.buscarUsuarioPorId(idUsuario);
      if (!userAtual || userAtual.length === 0) {
        return res.status(404).json({ message: "Usuario nao encontrado" });
      }
      if (senha && senha.length < 4) {
        return res
          .status(400)
          .json({ message: "A senha deve ter no minimo 4 caracteres" });
      }
      if (!nome && !email && !senha) {
        return res.status(400).json({
          message: "Pelo menos um campo e obrigatorio para atualizacao",
        });
      }

      const dadosAtuais = userAtual[0];

      nome = nome || dadosAtuais.nome;
      email = email || dadosAtuais.email;

      let hashedPassword;
      if (senha) {
        const senhaDuplicada = await bcrypt.compare(
          senha,
          dadosAtuais.password_hash,
        );
        if (senhaDuplicada) {
          return res
            .status(400)
            .json({ message: "A senha nao pode ser a mesma que a atual" });
        }
        hashedPassword = await bcrypt.hash(senha, saltRounds);
      } else {
        hashedPassword = dadosAtuais.password_hash;
      }

      const user = Users.atualizar(
        { nome, email, senha: hashedPassword },
        idUsuario,
      );
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
        return res.status(404).json({ message: "Usuario nao encontrado" });
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
