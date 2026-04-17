import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { formatDate, formatCurrency } from '../utils/helpers';
import { ArrowLeft, User, Phone, Mail, Building2, AlertTriangle, Clock } from 'lucide-react';

export default function PropietarioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { propietarios, propiedades, getInquilino, getIncidenciasPorPropietario } = useApp();

  const owner = propietarios.find(o => o.id === id);
  if (!owner) return <div className="empty-state"><p>Propietario no encontrado</p><button className="btn btn-primary" onClick={() => navigate('/propietarios')}>Volver</button></div>;

  const props = propiedades.filter(p => owner.propiedades.includes(p.id));
  const incidencias = getIncidenciasPorPropietario(owner.id);
  const pendientes = incidencias.filter(i => i.estado === 'Pendiente de aprobación');
  const recientes = [...incidencias].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)).slice(0, 10);

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <button className="btn btn-ghost" onClick={() => navigate('/propietarios')}>
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="detalle-title-row">
          <div className="owner-detail-header">
            <div className="owner-avatar large">
              {owner.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h1 className="detalle-title">{owner.nombre}</h1>
              <p className="detalle-subtitle">{owner.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-grid kpi-grid-3">
        <div className="kpi-card mini">
          <Building2 size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{props.length}</span>
            <span className="kpi-label">Propiedades</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <AlertTriangle size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{incidencias.length}</span>
            <span className="kpi-label">Total Incidencias</span>
          </div>
        </div>
        <div className="kpi-card mini warning">
          <Clock size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{pendientes.length}</span>
            <span className="kpi-label">Pend. Aprobación</span>
          </div>
        </div>
      </div>

      <div className="detalle-grid">
        <div className="detalle-main">
          {pendientes.length > 0 && (
            <Card title={`Aprobaciones Pendientes (${pendientes.length})`} className="detalle-card highlight-card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Propiedad</th>
                      <th>Urgencia</th>
                      <th>Presupuesto</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendientes.map(inc => {
                      const prop = propiedades.find(p => p.id === inc.propiedadId);
                      return (
                        <tr key={inc.id} className="table-row-clickable" onClick={() => navigate(`/incidencias/${inc.id}`)}>
                          <td className="td-id">{inc.id}</td>
                          <td className="td-title">{inc.titulo}</td>
                          <td>{prop ? `${prop.direccion}, ${prop.unidad}` : '—'}</td>
                          <td><Badge tipo="urgencia" valor={inc.urgencia} size="small" /></td>
                          <td className="td-currency">{formatCurrency(inc.presupuestoEstimado)}</td>
                          <td className="td-date">{formatDate(inc.fechaCreacion)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card title="Incidencias Recientes" className="detalle-card">
            {recientes.length > 0 ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Estado</th>
                      <th>Urgencia</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map(inc => (
                      <tr key={inc.id} className="table-row-clickable" onClick={() => navigate(`/incidencias/${inc.id}`)}>
                        <td className="td-id">{inc.id}</td>
                        <td className="td-title">{inc.titulo}</td>
                        <td><Badge tipo="estado" valor={inc.estado} size="small" /></td>
                        <td><Badge tipo="urgencia" valor={inc.urgencia} size="small" /></td>
                        <td className="td-date">{formatDate(inc.fechaCreacion)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="empty-text">Sin incidencias.</p>}
          </Card>
        </div>

        <div className="detalle-sidebar">
          <Card title="Contacto" className="detalle-card">
            <div className="entity-card">
              <User size={18} className="entity-icon owner" />
              <div>
                <strong>{owner.nombre}</strong>
                <span className="entity-sub"><Phone size={12} /> {owner.telefono}</span>
                <span className="entity-sub"><Mail size={12} /> {owner.email}</span>
              </div>
            </div>
          </Card>

          <Card title="Propiedades Asociadas" className="detalle-card">
            <div className="entity-list">
              {props.map(p => {
                const tenant = getInquilino(p.inquilinoId);
                return (
                  <div key={p.id} className="entity-card clickable" onClick={() => navigate(`/propiedades/${p.id}`)}>
                    <Building2 size={18} className="entity-icon" />
                    <div>
                      <strong>{p.direccion}, {p.unidad}</strong>
                      <span className="entity-sub">{p.barrio} · {tenant?.nombre || 'Sin inquilino'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
