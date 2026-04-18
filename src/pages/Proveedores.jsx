import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import { Wrench, MapPin, Star, Clock, Briefcase, Plus, Pencil, Globe, Copy } from 'lucide-react';

const RUBROS = ['Plomería', 'Electricidad', 'Gas', 'Cerrajería', 'Albañilería', 'Aire acondicionado', 'Pintura', 'General'];
const ESTADOS = ['Activo', 'Disponible', 'Inactivo'];
const CONDICIONES_FISCALES = ['Monotributo', 'Responsable Inscripto', 'Exento', 'Consumidor Final'];

const RUBRO_COLOR = {
  'Plomería': '#0ea5e9', 'Electricidad': '#f59e0b', 'Gas': '#ef4444',
  'Cerrajería': '#8b5cf6', 'Albañilería': '#f97316', 'Aire acondicionado': '#06b6d4',
  'Pintura': '#ec4899', 'General': '#6b7280',
};

const EMPTY_FORM = {
  nombre: '', rubro: 'Plomería', zona: '', telefono: '', email: '',
  estado: 'Activo', tiempoPromedioRespuesta: '', rating: '',
  dni: '', cuit: '', condicionFiscal: '',
};

export default function Proveedores() {
  const { proveedores, getIncidenciasPorProveedor, crearProveedor, editarProveedor, copiarProveedorGlobal, isSuper } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'propios' | 'globales'

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openNuevo = () => { setEditingId(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };

  const openEditar = (e, prov) => {
    e.stopPropagation();
    setEditingId(prov.id);
    setForm({
      nombre: prov.nombre || '', rubro: prov.rubro || 'Plomería', zona: prov.zona || '',
      telefono: prov.telefono || '', email: prov.email || '', estado: prov.estado || 'Activo',
      tiempoPromedioRespuesta: prov.tiempoPromedioRespuesta || '', rating: prov.rating || '',
      dni: prov.dni || '', cuit: prov.cuit || '', condicionFiscal: prov.condicionFiscal || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleCopiar = async (e, provId) => {
    e.stopPropagation();
    setSaving(true);
    await copiarProveedorGlobal(provId);
    setSaving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!form.dni.trim()) { setError('El DNI es obligatorio.'); return; }
    if (!form.cuit.trim()) { setError('El CUIT es obligatorio.'); return; }
    if (!form.condicionFiscal) { setError('La condición fiscal es obligatoria.'); return; }
    setSaving(true);
    setError('');
    const ok = editingId
      ? await editarProveedor(editingId, form)
      : await crearProveedor({ ...form, esGlobal: isSuper });
    setSaving(false);
    if (!ok) { setError('Error al guardar. Intentá de nuevo.'); return; }
    setModalOpen(false);
  };

  const propios = proveedores.filter(p => !p.esGlobal);
  const globales = proveedores.filter(p => p.esGlobal);
  const yaCopiados = new Set(globales.filter(g => propios.some(p => p.nombre === g.nombre && p.rubro === g.rubro)).map(g => g.id));

  const lista = filtro === 'propios' ? propios : filtro === 'globales' ? globales : proveedores;

  return (
    <div className="page-proveedores">
      <div className="page-header">
        <div>
          <h1 className="page-title">Proveedores</h1>
          <p className="page-subtitle">
            {isSuper
              ? `${globales.length} proveedores en el directorio global InmoDesk`
              : `${propios.length} propios · ${globales.length} en directorio InmoDesk`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNuevo}>
          <Plus size={16} /> {isSuper ? 'Nuevo proveedor global' : 'Nuevo proveedor'}
        </button>
      </div>

      <div className="filter-tabs">
        {[['todos', 'Todos'], ['propios', 'Mis proveedores'], ['globales', 'Directorio InmoDesk']].map(([val, label]) => (
          <button key={val} className={`filter-tab ${filtro === val ? 'active' : ''}`} onClick={() => setFiltro(val)}>{label}</button>
        ))}
      </div>

      <div className="cards-grid">
        {lista.map(prov => {
          const activas = getIncidenciasPorProveedor(prov.id).filter(i => !['Resuelta', 'Cerrada'].includes(i.estado));
          const color = RUBRO_COLOR[prov.rubro] || '#6b7280';
          return (
            <div key={prov.id} className="provider-card card card-hoverable" onClick={() => navigate(`/proveedores/${prov.id}`)}>
              <div className="provider-card-header">
                <div className="provider-icon" style={{ backgroundColor: `${color}20` }}>
                  <Wrench size={20} style={{ color }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {prov.esGlobal && (
                    <span className="prov-global-badge" title="Directorio InmoDesk">
                      <Globe size={12} /> InmoDesk
                    </span>
                  )}
                  <span className={`provider-status ${prov.estado === 'Activo' ? 'status-active' : 'status-available'}`}>
                    {prov.estado}
                  </span>
                  {prov.esGlobal && !isSuper ? (
                    <button
                      className="btn-icon-sm"
                      title={yaCopiados.has(prov.id) ? 'Ya está en tus proveedores' : 'Agregar a mis proveedores'}
                      onClick={(e) => !yaCopiados.has(prov.id) && handleCopiar(e, prov.id)}
                      disabled={yaCopiados.has(prov.id)}
                      style={yaCopiados.has(prov.id) ? { opacity: 0.4, cursor: 'default' } : {}}
                    >
                      <Copy size={14} />
                    </button>
                  ) : (
                    <button className="btn-icon-sm" title="Editar" onClick={(e) => openEditar(e, prov)}>
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="provider-name">{prov.nombre}</h3>
              <p className="provider-rubro">{prov.rubro}</p>
              {prov.condicionFiscal && <p className="provider-fiscal">{prov.condicionFiscal}</p>}

              <div className="provider-meta">
                <span className="provider-meta-item"><MapPin size={14} /> {prov.zona || '—'}</span>
              </div>

              <div className="provider-stats">
                <div className="provider-stat">
                  <Star size={14} className="star-icon" />
                  <span className="stat-value">{prov.rating || '—'}</span>
                </div>
                <div className="provider-stat">
                  <Clock size={14} />
                  <span className="stat-value">{prov.tiempoPromedioRespuesta || '—'}</span>
                </div>
                <div className="provider-stat">
                  <Briefcase size={14} />
                  <span className="stat-value">{prov.totalTrabajos} trabajos</span>
                </div>
              </div>

              <div className="provider-footer">
                <span>{activas.length} caso{activas.length !== 1 ? 's' : ''} activo{activas.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar proveedor' : isSuper ? 'Nuevo proveedor global' : 'Nuevo proveedor'} size="large">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-section-title">Datos generales</div>
          <div className="form-row">
            <div className="form-group form-group-grow">
              <label className="form-label">Nombre / Razón social *</label>
              <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Juan Pérez - Plomería Express" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="form-input" name="estado" value={form.estado} onChange={handleChange}>
                {ESTADOS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Rubro</label>
              <select className="form-input" name="rubro" value={form.rubro} onChange={handleChange}>
                {RUBROS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group form-group-grow">
              <label className="form-label">Zona de cobertura</label>
              <input className="form-input" name="zona" value={form.zona} onChange={handleChange} placeholder="Palermo, Recoleta, Belgrano" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+54 11 3333-0000" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="proveedor@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Tiempo resp. promedio</label>
              <input className="form-input" name="tiempoPromedioRespuesta" value={form.tiempoPromedioRespuesta} onChange={handleChange} placeholder="2 horas" />
            </div>
          </div>

          <div className="form-section-title" style={{ marginTop: '1.25rem' }}>Datos fiscales</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Condición fiscal *</label>
              <select className="form-input" name="condicionFiscal" value={form.condicionFiscal} onChange={handleChange}>
                <option value="">— Seleccionar —</option>
                {CONDICIONES_FISCALES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">DNI *</label>
              <input className="form-input" name="dni" value={form.dni} onChange={handleChange} placeholder="28.456.789" />
            </div>
            <div className="form-group">
              <label className="form-label">CUIT *</label>
              <input className="form-input" name="cuit" value={form.cuit} onChange={handleChange} placeholder="20-28456789-4" />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
