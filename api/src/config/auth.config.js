export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_ROUNDS = 10;
export const MIN_SENHA = 4;
export const MIN_NOME = 4;

export const EXPIRES = {
  sessao: "2h",
  verificacao: "24h",
  reset: "1h",
};

export const LINK_CLAIM = {
  verificacao: "verificacaoConta",
  reset: "resetSenha",
};

export const LINK_EXPIRY_MIN = {
  verificacao: 24 * 60,
  reset: 60,
};
