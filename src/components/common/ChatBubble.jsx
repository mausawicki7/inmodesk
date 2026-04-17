export default function ChatBubble({ mensaje }) {
  const actorColors = {
    inquilino: { bg: '#dcfce7', border: '#bbf7d0', name: '#15803d' },
    agente: { bg: '#dbeafe', border: '#bfdbfe', name: '#1d4ed8' },
    propietario: { bg: '#f3e8ff', border: '#e9d5ff', name: '#7c3aed' },
    proveedor: { bg: '#ffedd5', border: '#fed7aa', name: '#c2410c' },
  };

  const colors = actorColors[mensaje.actor] || actorColors.agente;
  const isSystem = mensaje.tipo === 'resumen';
  const isMedia = mensaje.tipo === 'imagen' || mensaje.tipo === 'video';

  return (
    <div className={`chat-bubble-wrapper ${mensaje.actor === 'agente' ? 'bubble-center' : mensaje.actor === 'inquilino' ? 'bubble-left' : 'bubble-right'}`}>
      <div
        className={`chat-bubble ${isSystem ? 'chat-bubble-system' : ''}`}
        style={{
          backgroundColor: isSystem ? '#f8fafc' : colors.bg,
          borderColor: isSystem ? '#e2e8f0' : colors.border,
        }}
      >
        <div className="chat-bubble-header">
          <span className="chat-bubble-name" style={{ color: colors.name }}>
            {mensaje.nombre}
          </span>
          <span className="chat-bubble-time">{mensaje.hora}</span>
        </div>
        <div className="chat-bubble-body">
          {isMedia ? (
            <div className="chat-media-placeholder">
              <span className="chat-media-icon">{mensaje.tipo === 'imagen' ? '🖼️' : '🎬'}</span>
              <span className="chat-media-label">{mensaje.mensaje}</span>
            </div>
          ) : (
            <p className="chat-bubble-text" style={{ whiteSpace: 'pre-line' }}>{mensaje.mensaje}</p>
          )}
        </div>
      </div>
    </div>
  );
}
