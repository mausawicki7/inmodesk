import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { formatDate, formatCurrency } from '../utils/helpers';
import {
  ArrowLeft, Building2, MapPin, User, Phone, Mail,
  Calendar, Ruler, DoorOpen, Banknote
} from 'lucide-react';

export default function PropiedadDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { propiedades, getPropietario, getInquilino, getIncidenciasPorPropiedad } = useApp();

  const prop = propiedades.find(p => p.id === id);
  if (!prop) return <div className="empty-state"><p>Propiedad no encontrada</p><button className="btn btn-primary" onClick={() => navigate('/propiedades')}>Volver</button></div>;

  const owner = getPropietario(prop.propietarioId);
  const tenant = getInquilino(prop.inquilinoId);
  const incidencias = getIncidenciasPorPropiedad(prop.id);
  const activas = incidencias.filter(i => !['Resuelta', 'Cerrada'].includes(i.estado));

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <button className="btn btn-ghost" onClick={() => navigate('/propiedades')}>
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="detalle-title-row">
          <div>
            <span className="detalle-id">{prop.id}</span>
            <h1 className="detalle-title">{prop.direccion}, {prop.unidad}</h1>
            <p className="detalle-subtitle"><MapPin size={14} /> {prop.barrio}, {prop.ciudad}</p>
          </div>
          <div className="property-type-badge large">{prop.tipo}</div>
        </div>
      </div>

      <div className="detalle-grid">
        <div className="detalle-main">
          <Card title="Datos del Inmueble" className="detalle-card">
            <div className="info-grid-2col">
              <div className="info-item">
                <DoorOpen size={16} />
                <span className="info-label">Ambientes</span>
                <span className="info-value">{prop.ambientes}</span>
              </div>
              <div className="info-item">
                <Ruler size={16} />
                <span className="info-label">Superficie</span>
                <span className="info-value">{prop.metros} m²</span>
              </div>
              <div className="info-item">
                <Building2 size={16} />
                <span className="info-label">Tipo</span>
                <span className="info-value">{prop.tipo}</span>
              </div>
              <div className="info-item">
                <Banknote size={16} />
                <span className="info-label">Alquiler</span>
                <span className="info-value">{formatCurrency(prop.alquilerMensual)}/mes</span>
              </div>
              <div className="info-item">
                <Calendar size={16} />
                <span className="info-label">Inicio contrato</span>
                <span className="info-value">{formatDate(prop.fechaInicioContrato)}</span>
              </div>
              <div className="info-item">
                <Calendar size={16} />
                <span className="info-label">Fin contrato</span>
                <span className="info-value">{formatDate(prop.fechaFinContrato)}</span>
              </div>
            </div>
          </Card>

          {activas.length > 0 && (
            <Card title={`Incidencias Activas (${activas.length})`} className="detalle-card">
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

          <Card title={`Historial de Incidencias (${incidencias.length})`} className="detalle-card">
            {incidencias.length > 0 ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Rubro</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidencias.map(inc => (
                      <tr key={inc.id} className="table-row-clickable" onClick={() => navigate(`/incidencias/${inc.id}`)}>
                        <td className="td-id">{inc.id}</td>
                        <td className="td-title">{inc.titulo}</td>
                        <td>{inc.rubro}</td>
                        <td><Badge tipo="estado" valor={inc.estado} size="small" /></td>
                        <td className="td-date">{formatDate(inc.fechaCreacion)}</td>
                        <td className="td-currency">{formatCurrency(inc.costoFinal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-text">Sin incidencias registradas.</p>
            )}
          </Card>
        </div>

        <div className="detalle-sidebar">
          <Card title="Propietario" className="detalle-card">
            {owner ? (
              <div className="entity-card" onClick={() => navigate(`/propietarios/${owner.id}`)}>
                <User size={18} className="entity-icon owner" />
                <div>
                  <strong>{owner.nombre}</strong>
                  <span className="entity-sub"><Phone size={12} /> {owner.telefono}</span>
                  <span className="entity-sub"><Mail size={12} /> {owner.email}</span>
                </div>
              </div>
            ) : <p className="empty-text">Sin propietario</p>}
          </Card>

          <Card title="Inquilino" className="detalle-card">
            {tenant ? (
              <div className="entity-card">
                <User size={18} className="entity-icon" />
                <div>
                  <strong>{tenant.nombre}</strong>
                  <span className="entity-sub"><Phone size={12} /> {tenant.telefono}</span>
                  <span className="entity-sub"><Mail size={12} /> {tenant.email}</span>
                </div>
              </div>
            ) : <p className="empty-text">Sin inquilino</p>}
          </Card>

          <Card title="Estado del Contrato" className="detalle-card">
            <div className="contract-status">
              <span className="badge" style={{ color: '#10b981', backgroundColor: '#ecfdf5', borderColor: '#10b98130' }}>
                {prop.estadoContrato}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
