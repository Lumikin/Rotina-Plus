export default function Hero({ temaEscuro }) {
  return (
    <header id="top" className="py-6">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <span
              className="badge rounded-pill px-3 py-2 mb-3"
              style={{
                backgroundColor: "rgba(46,196,182,0.12)",
                color: "var(--color-primary)",
              }}
            >
              🎮 Hábitos com gamificação
            </span>

            <h1 className="display-5 fw-bold mb-3">
              Transforme sua rotina em uma{" "}
              <span className="text-primary-rp">jornada de conquistas</span>
            </h1>

            <p
              className="mb-4"
              style={{
                color: temaEscuro ? "#e0e0e0" : "var(--color-text-muted)",
                fontSize: "18px",
              }}
            >
              O Rotina Plus ajuda você a organizar tarefas diárias e semanais,
              acompanhar seu progresso e ganhar pontos a cada conquista.
              Constância nunca foi tão divertida.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <a href="/register" className="btn btn-rp-primary btn-lg">
                Começar agora
              </a>
              <a
                href="#como-funciona"
                className={`btn btn-lg ${
                  temaEscuro
                    ? "btn-outline-light text-white"
                    : "btn-rp-outline"
                }`}
              >
                Ver como funciona
              </a>
            </div>

            <div className="d-flex gap-4 mt-5">
              <div>
                <h3 className="mb-0 fw-bold">+1000</h3>
                <small className={temaEscuro ? "text-light" : "text-muted"}>
                  Tarefas concluídas
                </small>
              </div>
              <div>
                <h3 className="mb-0 fw-bold">+300</h3>
                <small className={temaEscuro ? "text-light" : "text-muted"}>
                  Usuários ativos
                </small>
              </div>
              <div>
                <h3 className="mb-0 fw-bold">98%</h3>
                <small className={temaEscuro ? "text-light" : "text-muted"}>
                  Satisfação
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0">
            <div
              className={`rp-card mx-auto p-4 rounded-3 shadow-sm ${
                temaEscuro
                  ? "bg-secondary text-white border border-secondary"
                  : "bg-white text-dark"
              }`}
              style={{ maxWidth: "420px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0 fs-5 fw-bold">Minhas tarefas de hoje</h3>
                <span className="badge bg-secondary-rp">Nível 4</span>
              </div>

              <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                <li className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "var(--color-primary)" }}
                  ></i>
                  <span
                    className={`text-decoration-line-through ${
                      temaEscuro ? "text-light opacity-50" : "text-muted"
                    }`}
                  >
                    Beber 2L de água
                  </span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "var(--color-primary)" }}
                  ></i>
                  <span
                    className={`text-decoration-line-through ${
                      temaEscuro ? "text-light opacity-50" : "text-muted"
                    }`}
                  >
                    Estudar 30 minutos
                  </span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-circle"
                    style={{
                      color: temaEscuro ? "#fff" : "var(--color-text-muted)",
                    }}
                  ></i>
                  <span>Treinar na academia</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-circle"
                    style={{
                      color: temaEscuro ? "#fff" : "var(--color-text-muted)",
                    }}
                  ></i>
                  <span>Organizar a semana</span>
                </li>
              </ul>

              <div className="d-flex justify-content-between align-items-center">
                <small className={temaEscuro ? "text-light" : "text-muted"}>
                  Progresso diário
                </small>
                <small className="fw-bold">2/4</small>
              </div>
              <div className="progress mt-2" style={{ height: "8px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "50%",
                    backgroundColor: "var(--color-primary)",
                  }}
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <div className="d-flex align-items-center gap-2 mt-4">
                <i
                  className="bi bi-star-fill"
                  style={{ color: "#F4A100" }}
                ></i>
                <small className="fw-medium">
                  +120 pontos ganhos essa semana
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );   
}