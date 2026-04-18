import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import { formatDate, formatCurrency, rubroConfig } from '../utils/helpers';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

const ESTADOS = ['Todas', 'Nueva', 'Pendiente de aprobación', 'Aprobada', 'Asignada', 'En curso', 'Resuelta', 'Cerrada', 'Reabierta'];
const URGENCIAS = ['Todas', 'Baja', 'Media', 'Alta', 'Crítica'];
const RUBROS = ['Todos', 'Plomería', 'Electricidad', 'Gas', 'Cerrajería', 'Albañilería', 'Aire acondicionado', 'Pintura', 'General'];

export default function Incidencias() {
  const { incidencias, getPropiedad, getInquilino, getProveedor } = useApp();
  const navigate = useNavigate();

  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [filtroUrgencia, setFiltroUrgencia] = useState('Todas');
  const [filtroRubro, setFiltroRubro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [ordenDesc, setOrdenDesc] = useState(true);

  const filtradas = useMemo(() => {
    let result = [...incidencias];

    if (filtroEstado !== 'Todas') result = result.filter(i => i.estado === filtroEstado);
    if (filtroUrgencia !== 'Todas') result = result.filter(i => i.urgencia === filtroUrgencia);
    if (filtroRubro !== 'Todos') result = result.filter(i => i.rubro === filtroRubro);

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter(i => {
        const prop = getPropiedad(i.propiedadId);
        const inq = getInquilino(i.inquilinoId);
        return (
          i.id.toLowerCase().includes(q) ||
          i.titulo.toLowerCase().includes(q) ||
          prop?.direccion.toLowerCase().includes(q) ||
          inq?.nombre.toLowerCase().includes(q)
        );
      });
    }

    result.sort((a, b) => {
      const diff = new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      return ordenDesc ? diff : -diff;
    });

    return result;
  }, [incidencias, filtroEstado, filtroUrgencia, filtroRubro, busqueda, ordenDesc, getPropiedad, getInquilino]);

  return (
    <div className="page-incidencias">
      <div className="page-header">
        <div>
          <h1 className="page-title">Incidencias</h1>
          <p className="page-subtitle">{filtradas.length} incidencias encontradas</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-filter">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por ID, título, propiedad o inquilino..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={14} />
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="filter-select">
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <select value={filtroUrgencia} onChange={e => setFiltroUrgencia(e.target.value)} className="filter-select">
              {URGENCIAS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <select value={filtroRubro} onChange={e => setFiltroRubro(e.target.value)} className="filter-select">
              {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <button className="btn btn-icon" onClick={() => setOrdenDesc(!ordenDesc)} title="Ordenar por fecha">
            {ordenDesc ? <SortDesc size={18} /> : <SortAsc size={18} />}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Propiedad</th>
              <th>Inquilino</th>
              <th>Rubro</th>
              <th>Urgencia</th>
              <th>Estado</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Presupuesto</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(inc => {
              const prop = getPropiedad(inc.propiedadId);
              const inq = getInquilino(inc.inquilinoId);
              const prov = getProveedor(inc.proveedorId);
              return (
                <tr key={inc.id} className="table-row-clickable" onClick={() => navigate(`/incidencias/${inc.id}`)}>
                  <td className="td-id">{inc.codigo}</td>
                  <td className="td-title">{inc.titulo}</td>
                  <td className="td-prop">{prop ? `${prop.direccion}, ${prop.unidad}` : '—'}</td>
                  <td>{inq?.nombre || '—'}</td>
                  <td>
                    <span className="rubro-tag">
                      <span>{rubroConfig[inc.rubro]?.icon}</span> {inc.rubro}
                    </span>
                  </td>
                  <td><Badge tipo="urgencia" valor={inc.urgencia} size="small" /></td>
                  <td><Badge tipo="estado" valor={inc.estado} size="small" /></td>
                  <td className="td-prov">{prov?.nombre?.split(' - ')[0] || '—'}</td>
                  <td className="td-date">{formatDate(inc.fechaCreacion)}</td>
                  <td className="td-currency">{formatCurrency(inc.presupuestoEstimado)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtradas.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron incidencias con los filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}
