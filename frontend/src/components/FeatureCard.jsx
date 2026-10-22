export default function FeatureCard({ Icon, title, description }) {
  return (
    <div className="rp-card">
      <div className="rp-icon-circle">
        {Icon && <Icon size={22} strokeWidth={2} aria-hidden="true" />}
      </div>
      <h3>{title}</h3>
      <p style={{ color: "var(--color-text-muted)" }}>{description}</p>
    </div>
  );
}
