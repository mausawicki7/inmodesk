import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { formatDate } from '../utils/helpers';
import {
  ArrowLeft, Wrench, MapPin, Star, Clock, Phone, Mail,
  Briefcase, CheckCircle2
} from 'lucide-react';

export default function ProveedorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proveedores, getIncidenciasPorProveedor } = useApp();

  const prov = proveedores.find(p => p.id === id);
  if (!prov) return <div className="empty-state"><p>Proveedor no encontrado</p><button className="btn btn-primary" onClick={() => navigate('/proveedores')}>Volver</button></div>;

  const incidencias = getIncidenciasPorProveedor(prov.id);
  const activas = incidencias.filter(i => !['Resuelta', 'Cerrada'].includes(i.estado));

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <button className="btn btn-ghost" onClick={() => navigate('/proveedores')}>
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="detalle-title-row">
          <div>
            <span className="detalle-id">{prov.id}</span>
            <h1 className="detalle-title">{prov.nombre}</h1>
            <p className="detalle-subtitle">{prov.rubro} · {prov.zona}</p>
          </div>
          <span className={`provider-status large ${prov.estado === 'Activo' ? 'status-active' : 'status-available'}`}>
            {prov.estado}
          </span>
        </div>
      </div>

      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card mini">
          <Star size={20} className="kpi-mini-icon star" />
          <div className="kpi-content">
            <span className="kpi-value">{prov.rating}</span>
            <span className="kpi-label">Rating</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <Clock size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{prov.tiempoPromedioRespuesta}</span>
            <span className="kpi-label">Resp. Promedio</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <Briefcase size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{prov.totalTrabajos}</span>
            <span className="kpi-label">Total Trabajos</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <CheckCircle2 size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{activas.length}</span>
            <span className="kpi-label">Casos Activos</span>
          </div>
        </div>
      </div>

      <div className="detalle-grid">
        <div className="detalle-main">
          {activas.length > 0 && (
            <Card title={`Casos Activos (${activas.length})`} className="detalle-card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Urgencia</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activas.map(inc => (
                      <tr key={inc.id} className="table-row-clickable" onClick={() => navigate(`/incidencias/${inc.id}`)}>
                        <td className="td-id">{inc.id}</td>
                        <td className="td-title">{inc.titulo}</td>
                        <td><Badge tipo="urgencia" valor={inc.urgencia} size="small" /></td>
                        <td><Badge tipo="estado" valor={inc.estado} size="small" /></td>
                        <td className="td-date">{formatDate(inc.fechaCreacion)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card title="Historial de Trabajos" className="detalle-card">
            {prov.historial && prov.historial.length > 0 ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Trabajo</th>
                      <th>Propiedad</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prov.historial.map((h, i) => (
                      <tr key={i}>
                        <td className="td-date">{formatDate(h.fecha)}</td>
                        <td>{h.trabajo}</td>
                        <td>{h.propiedad}</td>
                        <td>
                          <span className={`badge-inline ${h.resultado === 'Completado' ? 'badge-success' : 'badge-info'}`}>
                            {h.resultado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="empty-text">Sin historial de trabajos.</p>}
          </Card>
        </div>

        <div className="detalle-sidebar">
          <Card title="Datos de Contacto" className="detalle-card">
            <div className="entity-card">
              <Wrench size={18} className="entity-icon prov" />
              <div>
                <strong>{prov.nombre}</strong>
                <span className="entity-sub"><Phone size={12} /> {prov.telefono}</span>
                <span className="entity-sub"><Mail size={12} /> {prov.email}</span>
                <span className="entity-sub"><MapPin size={12} /> {prov.zona}</span>
              </div>
            </div>
          </Card>

          <Card title="Información" className="detalle-card">
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Rubro</span>
                <span className="info-value">{prov.rubro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado</span>
                <span className={`badge-inline ${prov.estado === 'Activo' ? 'badge-success' : 'badge-info'}`}>{prov.estado}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rating</span>
                <span className="info-value">⭐ {prov.rating} / 5.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tiempo respuesta</span>
                <span className="info-value">{prov.tiempoPromedioRespuesta}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
