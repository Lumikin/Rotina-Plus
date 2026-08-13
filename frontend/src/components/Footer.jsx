import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer id="sobre" className="py-5 bg-white border-top">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <img src={logo} alt="Rotina Plus" height="32" className="mb-3" />
            <p style={{ color: "var(--color-text-muted)" }}>
              Sistema gamificado de acompanhamento de hábitos e rotina.
              Projeto com fins educacionais.
            </p>
          </div>

          <div className="col-md-4">
            <h3 className="mb-3">Links</h3>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><a href="#funcionalidades" className="text-decoration-none" style={{ color: "var(--color-text-muted)" }}>Funcionalidades</a></li>
              <li><a href="#como-funciona" className="text-decoration-none" style={{ color: "var(--color-text-muted)" }}>Como funciona</a></li>
              <li><a href="#entrar" className="text-decoration-none" style={{ color: "var(--color-text-muted)" }}>Entrar</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h3 className="mb-3">Documentação</h3>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><a href="https://github.com" className="text-decoration-none" style={{ color: "var(--color-text-muted)" }}>Repositório</a></li>
              <li><a href="https://www.figma.com" className="text-decoration-none" style={{ color: "var(--color-text-muted)" }}>Figma</a></li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        <p className="text-center mb-0" style={{ color: "var(--color-text-muted)" }}>
          <small>© {new Date().getFullYear()} Rotina Plus. Projeto educacional.</small>
        </p>
      </div>
    </footer>
  );
}