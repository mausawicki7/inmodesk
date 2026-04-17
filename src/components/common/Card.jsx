export default function Card({ children, className = '', title, subtitle, actions, onClick, hoverable = false }) {
  return (
    <div
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {(title || actions) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
