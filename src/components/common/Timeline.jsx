import { formatDateTime, timelineIconConfig } from '../../utils/helpers';

export default function Timeline({ events }) {
  if (!events || events.length === 0) return <p className="empty-text">Sin eventos en el timeline.</p>;

  return (
    <div className="timeline">
      {events.map((event, index) => {
        const config = timelineIconConfig[event.tipo] || { icon: '📌', color: '#6b7280' };
        return (
          <div key={index} className="timeline-item">
            <div className="timeline-line-container">
              <div className="timeline-dot" style={{ backgroundColor: config.color, color: config.color }}>
                <span className="timeline-icon">{config.icon}</span>
              </div>
              {index < events.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <strong className="timeline-event">{event.evento}</strong>
                <span className="timeline-date">{formatDateTime(event.fecha)}</span>
              </div>
              <p className="timeline-description">{event.descripcion}</p>
              <span className="timeline-actor">{event.actor}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
