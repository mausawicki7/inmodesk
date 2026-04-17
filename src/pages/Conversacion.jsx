import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ChatBubble from '../components/common/ChatBubble';
import { ArrowLeft, Send, Paperclip, Mic, Image } from 'lucide-react';

export default function Conversacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incidencias, getConversacion } = useApp();

  const inc = incidencias.find(i => i.id === id);
  const mensajes = getConversacion(id);

  if (!inc) return <div className="empty-state"><p>Incidencia no encontrada</p></div>;

  const noMessages = mensajes.length === 0;

  return (
    <div className="conversacion-page">
      <div className="conversacion-header">
        <button className="btn btn-ghost" onClick={() => navigate(`/incidencias/${id}`)}>
          <ArrowLeft size={18} /> Volver al detalle
        </button>
        <div className="conversacion-info">
          <h2>{inc.id} — Conversación</h2>
          <p>{inc.titulo}</p>
        </div>
      </div>

      <div className="conversacion-participants">
        <span className="participant participant-inquilino">🟢 Inquilino</span>
        <span className="participant participant-agente">🔵 InmoDesk</span>
        <span className="participant participant-propietario">🟣 Propietario</span>
        <span className="participant participant-proveedor">🟠 Proveedor</span>
      </div>

      <div className="chat-container">
        {noMessages ? (
          <div className="empty-state">
            <p>No hay conversación disponible para esta incidencia.</p>
            <p className="empty-sub">La conversación se generaría automáticamente con la integración de WhatsApp.</p>
          </div>
        ) : (
          <div className="chat-messages">
            {mensajes.map((msg, i) => {
              const prevMsg = mensajes[i - 1];
              const showDate = !prevMsg || prevMsg.fecha !== msg.fecha;
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="chat-date-divider">
                      <span>{msg.fecha}</span>
                    </div>
                  )}
                  <ChatBubble mensaje={msg} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="chat-input-bar">
        <button className="chat-input-btn" title="Adjuntar archivo">
          <Paperclip size={20} />
        </button>
        <button className="chat-input-btn" title="Enviar imagen">
          <Image size={20} />
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Escribir mensaje... (modo demo)"
          disabled
        />
        <button className="chat-input-btn" title="Audio">
          <Mic size={20} />
        </button>
        <button className="chat-send-btn" title="Enviar">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
