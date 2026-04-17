import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wrench, MapPin, Star, Clock, Briefcase } from 'lucide-react';

export default function Proveedores() {
  const { proveedores } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page-proveedores">
      <div className="page-header">
        <h1 className="page-title">Proveedores</h1>
        <p className="page-subtitle">{proveedores.length} proveedores registrados</p>
      </div>

      <div className="cards-grid">
        {proveedores.map(prov => (
          <div key={prov.id} className="provider-card card card-hoverable" onClick={() => navigate(`/proveedores/${prov.id}`)}>
            <div className="provider-card-header">
              <div className="provider-icon" style={{ backgroundColor: `${prov.rubro === 'Plomería' ? '#0ea5e9' : prov.rubro === 'Electricidad' ? '#f59e0b' : prov.rubro === 'Gas' ? '#ef4444' : prov.rubro === 'Cerrajería' ? '#8b5cf6' : prov.rubro === 'Albañilería' ? '#f97316' : prov.rubro === 'Aire acondicionado' ? '#06b6d4' : prov.rubro === 'Pintura' ? '#ec4899' : '#6b7280'}20` }}>
                <Wrench size={20} style={{ color: prov.rubro === 'Plomería' ? '#0ea5e9' : prov.rubro === 'Electricidad' ? '#f59e0b' : prov.rubro === 'Gas' ? '#ef4444' : prov.rubro === 'Cerrajería' ? '#8b5cf6' : prov.rubro === 'Albañilería' ? '#f97316' : prov.rubro === 'Aire acondicionado' ? '#06b6d4' : prov.rubro === 'Pintura' ? '#ec4899' : '#6b7280' }} />
              </div>
              <span className={`provider-status ${prov.estado === 'Activo' ? 'status-active' : 'status-available'}`}>
                {prov.estado}
              </span>
            </div>

            <h3 className="provider-name">{prov.nombre}</h3>
            <p className="provider-rubro">{prov.rubro}</p>

            <div className="provider-meta">
              <span className="provider-meta-item"><MapPin size={14} /> {prov.zona}</span>
            </div>

            <div className="provider-stats">
              <div className="provider-stat">
                <Star size={14} className="star-icon" />
                <span className="stat-value">{prov.rating}</span>
              </div>
              <div className="provider-stat">
                <Clock size={14} />
                <span className="stat-value">{prov.tiempoPromedioRespuesta}</span>
              </div>
              <div className="provider-stat">
                <Briefcase size={14} />
                <span className="stat-value">{prov.totalTrabajos} trabajos</span>
              </div>
            </div>

            <div className="provider-footer">
              <span>{prov.incidenciasActivas.length} caso{prov.incidenciasActivas.length !== 1 ? 's' : ''} activo{prov.incidenciasActivas.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
