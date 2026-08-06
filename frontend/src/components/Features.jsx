import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: "bi bi-check2-square",
    title: "Gestão de tarefas",
    description:
      "Crie, edite e organize suas tarefas diárias e semanais definindo prioridades e prazos.",
  },
  {
    icon: "bi bi-star",
    title: "Pontos e recompensas",
    description:
      "Ganhe pontos a cada tarefa concluída e acompanhe sua evolução dentro do sistema de gamificação.",
  },
  {
    icon: "bi bi-graph-up-arrow",
    title: "Acompanhamento de progresso",
    description:
      "Visualize seu histórico de conquistas e entenda como sua constância evolui ao longo do tempo.",
  },
  {
    icon: "bi bi-calendar-check",
    title: "Histórico de constância",
    description:
      "Registre seus acessos e mantenha sua sequência de dias ativos para não perder o ritmo.",
  },
];

export default function Features() {
  return (
    <section id="funcionalidades" className="py-6 bg-white">
      <div className="container py-5">
        <div className="text-center mb-5" style={{ maxWidth: "640px", margin: "0 auto" }}>
          <span className="fw-semibold text-primary-rp text-uppercase" style={{ fontSize: "14px", letterSpacing: "1px" }}>
            Funcionalidades
          </span>
          <h2 className="mt-2 mb-3">Tudo que você precisa para manter sua rotina em dia</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            O Rotina Plus une organização e gamificação para tornar seus hábitos
            diários mais simples de acompanhar e mais divertidos de manter.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature) => (
            <div className="col-md-6 col-lg-3" key={feature.title}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}