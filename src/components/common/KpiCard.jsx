export default function KpiCard({ icon, label, value, color, trend, subtitle }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className="kpi-content">
        <span className="kpi-label">{label}</span>
        <span className="kpi-value">{value}</span>
        {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
        {trend && (
          <span className={`kpi-trend ${trend.direction === 'up' ? 'trend-up' : 'trend-down'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
