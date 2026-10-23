export default function StatCard({
  label,
  value
}) {
  return <div className="stat-card">
  <span>
    {label}
  </span>
  <strong>
    {value ?? "—"}
  </strong>
  <small>Smart College overview</small>
</div>;
}
