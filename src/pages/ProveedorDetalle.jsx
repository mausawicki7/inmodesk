import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/helpers';
import {
  ArrowLeft, Wrench, MapPin, Star, Clock, Phone, Mail,
  Briefcase, CheckCircle2, Pencil, Globe
} from 'lucide-react';

const RUBROS = ['Plomería', 'Electricidad', 'Gas', 'Cerrajería', 'Albañilería', 'Aire acondicionado', 'Pintura', 'General'];
const ESTADOS = ['Activo', 'Disponible', 'Inactivo'];
const CONDICIONES_FISCALES = ['Monotributo', 'Responsable Inscripto', 'Exento', 'Consumidor Final'];

export default function ProveedorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proveedores, getIncidenciasPorProveedor, editarProveedor, isSuper } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const prov = proveedores.find(p => p.id === id);
  if (!prov) return <div className="empty-state"><p>Proveedor no encontrado</p><button className="btn btn-primary" onClick={() => navigate('/proveedores')}>Volver</button></div>;

  const incidencias = getIncidenciasPorProveedor(prov.id);
  const activas = incidencias.filter(i => !['Resuelta', 'Cerrada'].includes(i.estado));

  const openEditar = () => {
    setForm({
      nombre: prov.nombre || '', rubro: prov.rubro || 'Plomería', zona: prov.zona || '',
      telefono: prov.telefono || '', email: prov.email || '', estado: prov.estado || 'Activo',
      tiempoPromedioRespuesta: prov.tiempoPromedioRespuesta || '', rating: prov.rating || '',
      dni: prov.dni || '', cuit: prov.cuit || '', condicionFiscal: prov.condicionFiscal || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!form.dni.trim()) { setError('El DNI es obligatorio.'); return; }
    if (!form.cuit.trim()) { setError('El CUIT es obligatorio.'); return; }
    if (!form.condicionFiscal) { setError('La condición fiscal es obligatoria.'); return; }
    setSaving(true);
    setError('');
    const ok = await editarProveedor(id, form);
    setSaving(false);
    if (!ok) { setError('Error al guardar. Intentá de nuevo.'); return; }
    setModalOpen(false);
  };

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <button className="btn btn-ghost" onClick={() => navigate('/proveedores')}>
          <ArrowLeft size={18} /> Volver
        </button>
        {(!prov.esGlobal || isSuper) && (
          <button className="btn btn-secondary" onClick={openEditar}>
            <Pencil size={15} /> Editar
          </button>
        )}
        <div className="detalle-title-row">
          <div>
            <span className="detalle-id">{prov.id}</span>
            <h1 className="detalle-title">
              {prov.nombre}
              {prov.esGlobal && <span className="prov-global-badge" style={{ marginLeft: 8 }}><Globe size={12} /> InmoDesk</span>}
            </h1>
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
            <span className="kpi-value">{prov.rating || '—'}</span>
            <span className="kpi-label">Rating</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <Clock size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{prov.tiempoPromedioRespuesta || '—'}</span>
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
                        <td className="td-id">{inc.codigo || inc.id}</td>
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
                <span className="entity-sub"><Phone size={12} /> {prov.telefono || '—'}</span>
                <span className="entity-sub"><Mail size={12} /> {prov.email || '—'}</span>
                <span className="entity-sub"><MapPin size={12} /> {prov.zona || '—'}</span>
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
                <span className="info-value">⭐ {prov.rating || '—'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tiempo respuesta</span>
                <span className="info-value">{prov.tiempoPromedioRespuesta || '—'}</span>
              </div>
            </div>
          </Card>

          {(prov.condicionFiscal || prov.cuit || prov.dni) && (
            <Card title="Datos Fiscales" className="detalle-card">
              <div className="info-list">
                {prov.condicionFiscal && (
                  <div className="info-item">
                    <span className="info-label">Condición fiscal</span>
                    <span className="info-value">{prov.condicionFiscal}</span>
                  </div>
                )}
                {prov.cuit && (
                  <div className="info-item">
                    <span className="info-label">CUIT</span>
                    <span className="info-value">{prov.cuit}</span>
                  </div>
                )}
                {prov.dni && (
                  <div className="info-item">
                    <span className="info-label">DNI</span>
                    <span className="info-value">{prov.dni}</span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {(!prov.esGlobal || isSuper) && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Editar proveedor" size="large">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-section-title">Datos generales</div>
            <div className="form-row">
              <div className="form-group form-group-grow">
                <label className="form-label">Nombre / Razón social *</label>
                <input className="form-input" name="nombre" value={form.nombre || ''} onChange={handleChange} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" name="estado" value={form.estado || ''} onChange={handleChange}>
                  {ESTADOS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Rubro</label>
                <select className="form-input" name="rubro" value={form.rubro || ''} onChange={handleChange}>
                  {RUBROS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group form-group-grow">
                <label className="form-label">Zona de cobertura</label>
                <input className="form-input" name="zona" value={form.zona || ''} onChange={handleChange} placeholder="Palermo, Recoleta, Belgrano" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" name="telefono" value={form.telefono || ''} onChange={handleChange} placeholder="+54 11 3333-0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" value={form.email || ''} onChange={handleChange} placeholder="proveedor@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Tiempo resp. promedio</label>
                <input className="form-input" name="tiempoPromedioRespuesta" value={form.tiempoPromedioRespuesta || ''} onChange={handleChange} placeholder="2 horas" />
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: '1.25rem' }}>Datos fiscales</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Condición fiscal *</label>
                <select className="form-input" name="condicionFiscal" value={form.condicionFiscal || ''} onChange={handleChange}>
                  <option value="">— Seleccionar —</option>
                  {CONDICIONES_FISCALES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">DNI *</label>
                <input className="form-input" name="dni" value={form.dni || ''} onChange={handleChange} placeholder="28.456.789" />
              </div>
              <div className="form-group">
                <label className="form-label">CUIT *</label>
                <input className="form-input" name="cuit" value={form.cuit || ''} onChange={handleChange} placeholder="20-28456789-4" />
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
