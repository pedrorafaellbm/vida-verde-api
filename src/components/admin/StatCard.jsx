export function StatCard({ title, value, helper }) {
  return (
    <article className="admin-stat-card">
      <p className="admin-stat-title">{title}</p>
      <strong className="admin-stat-value">{value}</strong>
      {helper ? <span className="admin-stat-helper">{helper}</span> : null}
    </article>
  )
}
