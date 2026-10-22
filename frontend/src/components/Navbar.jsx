import { Link } from "react-router-dom";
import { Sun, Moon, ListTodo, User, Trophy, LogIn, UserPlus, LogOut, Flame } from "lucide-react";
import logo from "../assets/logo.png";

function fecharMenu() {
  // Remove manual para não bloquear a navegação do Router.
  document.getElementById("navbarContent")?.classList.remove("show");
}

export default function Navbar({
  temaEscuro = false,
  toggleTema,
  nomeUsuario = "",
  onSair,
  mostrarLogo = true,
  streak = 0,
}) {
  const logado = Boolean(nomeUsuario && onSair);

  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm sticky-top py-3 ${
        temaEscuro ? "navbar-dark bg-dark" : "navbar-light bg-white"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container">
        {mostrarLogo ? (
          <Link to="/" className="navbar-brand d-flex align-items-center" onClick={fecharMenu}>
            <img src={logo} alt="Rotina Plus" height="36" />
          </Link>
        ) : (
          <div className="navbar-brand d-flex align-items-center text-truncate" aria-label="Usuário logado">
            <span className={`d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 ${temaEscuro ? "bg-dark-subtle text-light" : "bg-light text-dark"}`} style={{ border: "none" }}>
              <span className="fw-semibold">{nomeUsuario}</span>
              <span className="d-inline-flex align-items-center gap-1 fw-bold text-warning">
                <Flame size={16} fill="currentColor" aria-hidden="true" />
                <span>{streak}</span>
              </span>
            </span>
          </div>
        )}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="mx-auto" />

          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 mt-3 mt-lg-0">
            {toggleTema && (
              <button
                type="button"
                className={`btn btn-sm d-inline-flex align-items-center justify-content-center gap-1 ${
                  temaEscuro ? "btn-outline-light" : "btn-outline-dark"
                }`}
                onClick={toggleTema}
                aria-label={temaEscuro ? "Ativar modo claro" : "Ativar modo escuro"}
                aria-pressed={temaEscuro}
              >
                {temaEscuro ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                {temaEscuro ? "Claro" : "Escuro"}
              </button>
            )}

            {logado ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-sm btn-rp-outline d-inline-flex align-items-center justify-content-center gap-1"
                  onClick={fecharMenu}
                >
                  <ListTodo size={16} aria-hidden="true" /> Tarefas
                </Link>
                <Link
                  to="/perfil"
                  className="btn btn-sm btn-rp-outline d-inline-flex align-items-center justify-content-center gap-1"
                  onClick={fecharMenu}
                >
                  <User size={16} aria-hidden="true" /> Meu perfil
                </Link>
                <Link
                  to="/ranking"
                  className="btn btn-sm btn-rp-outline d-inline-flex align-items-center justify-content-center gap-1"
                  onClick={fecharMenu}
                >
                  <Trophy size={16} aria-hidden="true" /> Ranking
                </Link>
                <button
                  type="button"
                  className="btn btn-rp-outline d-inline-flex align-items-center justify-content-center gap-1"
                  onClick={() => {
                    fecharMenu();
                    onSair();
                  }}
                >
                  <LogOut size={16} aria-hidden="true" /> Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-rp-outline d-inline-flex align-items-center justify-content-center gap-1"
                  onClick={fecharMenu}
                >
                  <LogIn size={16} aria-hidden="true" /> Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn btn-rp-primary d-inline-flex align-items-center justify-content-center gap-1"
                  onClick={fecharMenu}
                >
                  <UserPlus size={16} aria-hidden="true" /> Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
