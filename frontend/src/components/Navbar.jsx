import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const { temaEscuro, toggleTema } = useTheme();

  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm sticky-top py-3 ${
        temaEscuro ? "navbar-dark bg-dark" : "navbar-light bg-white"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#top">
          <img src={logo} alt="Rotina Plus" height="36" />
        </a>

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
          <ul className="navbar-nav mx-auto gap-lg-4 mt-3 mt-lg-0">
            <li className="nav-item">
              <a
                className={`nav-link fw-medium ${
                  temaEscuro ? "text-light" : ""
                }`}
                href="#funcionalidades"
              >
                Funcionalidades
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link fw-medium ${
                  temaEscuro ? "text-light" : ""
                }`}
                href="#como-funciona"
              >
                Como funciona
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link fw-medium ${
                  temaEscuro ? "text-light" : ""
                }`}
                href="#sobre"
              >
                Sobre
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {/* Botão para alternar Tema Claro / Escuro */}
            <button
              type="button"
              className={`btn btn-sm ${
                temaEscuro ? "btn-outline-light" : "btn-outline-dark"
              }`}
              onClick={toggleTema}
            >
              {temaEscuro ? "☀️ Claro" : "🌙 Escuro"}
            </button>

            <Link to="/login" className="btn btn-rp-outline">
              Entrar
            </Link>
            <Link to="/register" className="btn btn-rp-primary">
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
