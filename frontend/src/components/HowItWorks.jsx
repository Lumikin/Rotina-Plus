const steps = [
  {
    number: "1",
    title: "Crie sua conta",
    description: "Cadastre-se em poucos segundos e monte seu perfil no Rotina Plus.",
  },
  {
    number: "2",
    title: "Adicione suas tarefas",
    description: "Liste seus hábitos e tarefas diárias ou semanais com prioridade e prazo.",
  },
  {
    number: "3",
    title: "Ganhe pontos e evolua",
    description: "Complete tarefas, acumule pontos e acompanhe sua constância crescer.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-6">
      <div className="container py-5">
        <div className="text-center mb-5" style={{ maxWidth: "640px", margin: "0 auto" }}>
          <span className="fw-semibold text-primary-rp text-uppercase" style={{ fontSize: "14px", letterSpacing: "1px" }}>
            Como funciona
          </span>
          <h2 className="mt-2 mb-3">Comece em 3 passos simples</h2>
        </div>

        <div className="row g-4">
          {steps.map((step) => (
            <div className="col-md-4" key={step.number}>
              <div className="rp-card text-center">
                <div
                  className="rp-icon-circle mx-auto"
                  style={{ backgroundColor: "var(--color-secondary)", color: "#fff" }}
                >
                  <strong>{step.number}</strong>
                </div>
                <h3>{step.title}</h3>
                <p style={{ color: "var(--color-text-muted)" }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}