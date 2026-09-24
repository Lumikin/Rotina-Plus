export default function CallToAction({ temaEscuro }) {
  return (
    <section
      id="cadastro"
      className={`py-6 ${
        temaEscuro ? "bg-dark text-white" : "bg-white text-dark"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container">
        <div
          className="rounded-4 text-center px-4 py-5 bg-secondary-rp"
          style={{ color: "#ffffff" }}
        >
          <h2 style={{ color: "#ffffff" }} className="mb-3">
            Pronto para dar o próximo passo na sua rotina?
          </h2>
          <p
            className="mb-4"
            style={{
              color: "rgba(255,255,255,0.8)",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Junte-se ao Rotina Plus e comece hoje mesmo a transformar seus
            hábitos em conquistas.
          </p>
          <a href="/register" className="btn btn-rp-primary btn-lg">
            Criar minha conta grátis
          </a>
        </div>
      </div>
    </section>
  );
}