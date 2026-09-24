import logo from "../assets/logo.png";

export default function Navbar({ temaEscuro, toggleTema }) {
  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm sticky-top py-3 ${
        temaEscuro ? "navbar-dark bg-dark border-bottom border-secondary" : "navbar-light bg-white"
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
                  temaEscuro ? "text-light" : "text-dark"
                }`}
                href="#funcionalidades"
              >
                Funcionalidades
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link fw-medium ${
                  temaEscuro ? "text-light" : "text-dark"
                }`}
                href="#como-funciona"
              >
                Como funciona
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link fw-medium ${
                  temaEscuro ? "text-light" : "text-dark"
                }`}
                href="#sobre"
              >
                Sobre
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {/* Botão para alternar Tema */}
            <button
              type="button"
              className={`btn btn-sm px-3 rounded-pill me-2 ${
                temaEscuro ? "btn-outline-light" : "btn-outline-dark"
              }`}
              onClick={toggleTema}
            >
              {temaEscuro ? "☀️ Claro" : "🌙 Escuro"}
            </button>

            <a
              href="/login"
              className={`btn btn-sm px-3 fw-semibold ${
                temaEscuro ? "btn-outline-light text-white" : "btn-outline-info text-info"
              }`}
            >
              Entrar
            </a>
            <a href="/register" className="btn btn-info text-white btn-sm px-3 fw-semibold">
              Cadastrar
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}