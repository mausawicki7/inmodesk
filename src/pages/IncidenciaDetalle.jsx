import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Timeline from '../components/common/Timeline';
import Modal from '../components/common/Modal';
import { formatDateTime, formatCurrency, rubroConfig } from '../utils/helpers';
import { useState } from 'react';
import {
  ArrowLeft, MessageSquare, CheckCircle2, RotateCcw, UserPlus,
  PlayCircle, XCircle, FileText, Camera, StickyNote, Building2,
  User, Phone, Mail, Wrench
} from 'lucide-react';

export default function IncidenciaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incidencias, getPropiedad, getPropietario, getProveedor, getInquilino, updateIncidenciaEstado, asignarProveedor, proveedores } = useApp();

  const [showProvModal, setShowProvModal] = useState(false);

  const inc = incidencias.find(i => i.id === id);
  if (!inc) return <div className="empty-state"><p>Incidencia no encontrada</p><button className="btn btn-primary" onClick={() => navigate('/incidencias')}>Volver</button></div>;

  const prop = getPropiedad(inc.propiedadId);
  const owner = getPropietario(inc.propietarioId);
  const prov = getProveedor(inc.proveedorId);
  const tenant = getInquilino(inc.inquilinoId);
  const rubro = rubroConfig[inc.rubro];

  const handleAction = (action) => {
    switch (action) {
      case 'aprobar': updateIncidenciaEstado(id, 'Aprobada'); break;
      case 'asignar': setShowProvModal(true); break;
      case 'en-curso': updateIncidenciaEstado(id, 'En curso'); break;
      case 'resolver': updateIncidenciaEstado(id, 'Resuelta'); break;
      case 'cerrar': updateIncidenciaEstado(id, 'Cerrada'); break;
      case 'reabrir': updateIncidenciaEstado(id, 'Reabierta'); break;
    }
  };

  const handleAsignar = (provId) => {
    asignarProveedor(id, provId);
    setShowProvModal(false);
  };

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <button className="btn btn-ghost" onClick={() => navigate('/incidencias')}>
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="detalle-title-row">
          <div>
            <div className="detalle-id-row">
              <span className="detalle-id">{inc.id}</span>
              <span className="rubro-tag"><span>{rubro?.icon}</span> {inc.rubro}</span>
            </div>
            <h1 className="detalle-title">{inc.titulo}</h1>
          </div>
          <div className="detalle-badges">
            <Badge tipo="estado" valor={inc.estado} />
            <Badge tipo="urgencia" valor={inc.urgencia} />
          </div>
        </div>
      </div>

      <div className="detalle-actions">
        {['Nueva', 'Pendiente de aprobación'].includes(inc.estado) && (
          <button className="btn btn-success" onClick={() => handleAction('aprobar')}>
            <CheckCircle2 size={16} /> Aprobar presupuesto
          </button>
        )}
        {['Aprobada', 'Reabierta'].includes(inc.estado) && (
          <button className="btn btn-primary" onClick={() => handleAction('asignar')}>
            <UserPlus size={16} /> Asignar proveedor
          </button>
        )}
        {['Asignada'].includes(inc.estado) && (
          <button className="btn btn-info" onClick={() => handleAction('en-curso')}>
            <PlayCircle size={16} /> Marcar en curso
          </button>
        )}
        {['En curso'].includes(inc.estado) && (
          <button className="btn btn-success" onClick={() => handleAction('resolver')}>
            <CheckCircle2 size={16} /> Marcar resuelto
          </button>
        )}
        {['Resuelta'].includes(inc.estado) && (
          <button className="btn btn-ghost" onClick={() => handleAction('cerrar')}>
            <XCircle size={16} /> Cerrar caso
          </button>
        )}
        {['Resuelta', 'Cerrada'].includes(inc.estado) && (
          <button className="btn btn-warning" onClick={() => handleAction('reabrir')}>
            <RotateCcw size={16} /> Reabrir
          </button>
        )}
        <Link to={`/incidencias/${id}/conversacion`} className="btn btn-outline">
          <MessageSquare size={16} /> Ver conversación
        </Link>
      </div>

      <div className="detalle-grid">
        <div className="detalle-main">
          <Card title="Descripción del Reclamo" className="detalle-card">
            <p className="detalle-description">{inc.descripcion}</p>
          </Card>

          <Card title="Evidencia" className="detalle-card">
            {inc.evidencias && inc.evidencias.length > 0 ? (
              <div className="evidence-grid">
                {inc.evidencias.map((ev, i) => (
                  <div key={i} className="evidence-item">
                    <div className="evidence-placeholder">
                      <Camera size={24} />
                      <span>{ev}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">Sin evidencia adjunta.</p>
            )}
          </Card>

          {inc.notas && (
            <Card title="Notas Internas" className="detalle-card">
              <div className="notes-content">
                <StickyNote size={16} />
                <p>{inc.notas}</p>
              </div>
            </Card>
          )}

          <Card title="Timeline del Caso" className="detalle-card">
            <Timeline events={inc.timeline} />
          </Card>
        </div>

        <div className="detalle-sidebar">
          <Card title="Resumen" className="detalle-card">
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Estado</span>
                <Badge tipo="estado" valor={inc.estado} />
              </div>
              <div className="info-item">
                <span className="info-label">Urgencia</span>
                <Badge tipo="urgencia" valor={inc.urgencia} />
              </div>
              <div className="info-item">
                <span className="info-label">Rubro</span>
                <span className="rubro-tag"><span>{rubro?.icon}</span> {inc.rubro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Creado</span>
                <span className="info-value">{formatDateTime(inc.fechaCreacion)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Actualizado</span>
                <span className="info-value">{formatDateTime(inc.fechaActualizacion)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Presupuesto</span>
                <span className="info-value info-currency">{formatCurrency(inc.presupuestoEstimado)}</span>
              </div>
              {inc.costoFinal && (
                <div className="info-item">
                  <span className="info-label">Costo final</span>
                  <span className="info-value info-currency success">{formatCurrency(inc.costoFinal)}</span>
                </div>
              )}
            </div>
          </Card>

          <Card title="Propiedad" className="detalle-card">
            <div className="entity-card" onClick={() => prop && navigate(`/propiedades/${prop.id}`)}>
              <Building2 size={18} className="entity-icon" />
              <div>
                <strong>{prop ? `${prop.direccion}, ${prop.unidad}` : '—'}</strong>
                <span className="entity-sub">{prop?.barrio}, {prop?.ciudad}</span>
              </div>
            </div>
          </Card>

          <Card title="Inquilino" className="detalle-card">
            <div className="entity-card">
              <User size={18} className="entity-icon" />
              <div>
                <strong>{tenant?.nombre || '—'}</strong>
                <span className="entity-sub"><Phone size={12} /> {tenant?.telefono}</span>
                <span className="entity-sub"><Mail size={12} /> {tenant?.email}</span>
              </div>
            </div>
          </Card>

          <Card title="Propietario" className="detalle-card">
            <div className="entity-card" onClick={() => owner && navigate(`/propietarios/${owner.id}`)}>
              <User size={18} className="entity-icon owner" />
              <div>
                <strong>{owner?.nombre || '—'}</strong>
                <span className="entity-sub"><Phone size={12} /> {owner?.telefono}</span>
                <span className="entity-sub"><Mail size={12} /> {owner?.email}</span>
              </div>
            </div>
          </Card>

          <Card title="Proveedor Asignado" className="detalle-card">
            {prov ? (
              <div className="entity-card" onClick={() => navigate(`/proveedores/${prov.id}`)}>
                <Wrench size={18} className="entity-icon prov" />
                <div>
                  <strong>{prov.nombre}</strong>
                  <span className="entity-sub">{prov.rubro} · ⭐ {prov.rating}</span>
                  <span className="entity-sub"><Phone size={12} /> {prov.telefono}</span>
                </div>
              </div>
            ) : (
              <p className="empty-text">Sin proveedor asignado</p>
            )}
          </Card>
        </div>
      </div>

      <Modal isOpen={showProvModal} onClose={() => setShowProvModal(false)} title="Asignar Proveedor">
        <div className="prov-list-modal">
          {proveedores
            .filter(p => p.rubro === inc.rubro || p.rubro === 'General')
            .map(p => (
              <div key={p.id} className="prov-option" onClick={() => handleAsignar(p.id)}>
                <div className="prov-option-info">
                  <strong>{p.nombre}</strong>
                  <span>{p.rubro} · {p.zona}</span>
                  <span>⭐ {p.rating} · Resp. promedio: {p.tiempoPromedioRespuesta}</span>
                </div>
                <button className="btn btn-sm btn-primary">Asignar</button>
              </div>
            ))}
          {proveedores.filter(p => p.rubro === inc.rubro || p.rubro === 'General').length === 0 && (
            <p className="empty-text">No hay proveedores disponibles para este rubro.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
