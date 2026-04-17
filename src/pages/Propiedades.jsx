import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import { Building2, MapPin, User, AlertTriangle } from 'lucide-react';

export default function Propiedades() {
  const { propiedades, getPropietario, getInquilino, getIncidenciasPorPropiedad } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page-propiedades">
      <div className="page-header">
        <h1 className="page-title">Propiedades</h1>
        <p className="page-subtitle">{propiedades.length} propiedades administradas</p>
      </div>

      <div className="cards-grid">
        {propiedades.map(prop => {
          const owner = getPropietario(prop.propietarioId);
          const tenant = getInquilino(prop.inquilinoId);
          const incidencias = getIncidenciasPorPropiedad(prop.id);
          const activas = incidencias.filter(i => !['Resuelta', 'Cerrada'].includes(i.estado));

          return (
            <div key={prop.id} className="property-card card card-hoverable" onClick={() => navigate(`/propiedades/${prop.id}`)}>
              <div className="property-card-header">
                <div className="property-icon">
                  <Building2 size={20} />
                </div>
                <div className="property-type-badge">{prop.tipo}</div>
              </div>

              <h3 className="property-address">{prop.direccion}, {prop.unidad}</h3>
              <p className="property-location">
                <MapPin size={14} /> {prop.barrio}, {prop.ciudad}
              </p>

              <div className="property-details">
                <div className="property-detail">
                  <span className="detail-label">Propietario</span>
                  <span className="detail-value">{owner?.nombre || '—'}</span>
                </div>
                <div className="property-detail">
                  <span className="detail-label">Inquilino</span>
                  <span className="detail-value">{tenant?.nombre || '—'}</span>
                </div>
                <div className="property-detail">
                  <span className="detail-label">Ambientes</span>
                  <span className="detail-value">{prop.ambientes}</span>
                </div>
                <div className="property-detail">
                  <span className="detail-label">Superficie</span>
                  <span className="detail-value">{prop.metros} m²</span>
                </div>
              </div>

              <div className="property-footer">
                <div className="incidencias-count">
                  <AlertTriangle size={14} />
                  <span>{activas.length} activa{activas.length !== 1 ? 's' : ''}</span>
                </div>
                <span className="incidencias-total">{incidencias.length} total</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
