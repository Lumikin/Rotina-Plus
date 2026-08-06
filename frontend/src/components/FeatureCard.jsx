export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="rp-card">
      <div className="rp-icon-circle">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p style={{ color: "var(--color-text-muted)" }}>{description}</p>
    </div>
  );
}