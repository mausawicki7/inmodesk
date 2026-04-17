import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Building2, AlertTriangle, Clock } from 'lucide-react';

export default function Propietarios() {
  const { propietarios, propiedades, getIncidenciasPorPropietario } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page-propietarios">
      <div className="page-header">
        <h1 className="page-title">Propietarios</h1>
        <p className="page-subtitle">{propietarios.length} propietarios registrados</p>
      </div>

      <div className="cards-grid">
        {propietarios.map(owner => {
          const props = propiedades.filter(p => owner.propiedades.includes(p.id));
          const incidencias = getIncidenciasPorPropietario(owner.id);
          const pendientes = incidencias.filter(i => i.estado === 'Pendiente de aprobación');

          return (
            <div key={owner.id} className="owner-card card card-hoverable" onClick={() => navigate(`/propietarios/${owner.id}`)}>
              <div className="owner-card-header">
                <div className="owner-avatar">
                  {owner.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="owner-name">{owner.nombre}</h3>
                  <p className="owner-contact">{owner.email}</p>
                </div>
              </div>

              <div className="owner-stats">
                <div className="owner-stat">
                  <Building2 size={16} />
                  <span className="stat-value">{props.length}</span>
                  <span className="stat-label">Propiedades</span>
                </div>
                <div className="owner-stat">
                  <AlertTriangle size={16} />
                  <span className="stat-value">{incidencias.length}</span>
                  <span className="stat-label">Incidencias</span>
                </div>
                <div className="owner-stat warning">
                  <Clock size={16} />
                  <span className="stat-value">{pendientes.length}</span>
                  <span className="stat-label">Pendientes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
