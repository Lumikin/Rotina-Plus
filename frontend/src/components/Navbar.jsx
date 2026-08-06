import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-3">
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
              <a className="nav-link fw-medium" href="#funcionalidades">Funcionalidades</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#como-funciona">Como funciona</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#sobre">Sobre</a>
            </li>
          </ul>

          <div className="d-flex gap-2 mt-3 mt-lg-0">
            <a href="#entrar" className="btn btn-rp-outline">Entrar</a>
            <a href="#cadastro" className="btn btn-rp-primary">Cadastre-se</a>
          </div>
        </div>
      </div>
    </nav>
  );
}