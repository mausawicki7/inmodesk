import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import { User, Building2, AlertTriangle, Clock, Plus, Pencil } from 'lucide-react';

const EMPTY_FORM = { nombre: '', email: '', telefono: '', dni: '', cuit: '' };

export default function Propietarios() {
  const { propietarios, propiedades, getIncidenciasPorPropietario, crearPropietario, editarPropietario } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openNuevo = () => { setEditingId(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };

  const openEditar = (e, owner) => {
    e.stopPropagation();
    setEditingId(owner.id);
    setForm({ nombre: owner.nombre || '', email: owner.email || '', telefono: owner.telefono || '', dni: owner.dni || '', cuit: owner.cuit || '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!form.dni.trim()) { setError('El DNI es obligatorio.'); return; }
    if (!form.cuit.trim()) { setError('El CUIT es obligatorio.'); return; }
    setSaving(true);
    setError('');
    const ok = editingId
      ? await editarPropietario(editingId, form)
      : await crearPropietario(form);
    setSaving(false);
    if (!ok) { setError('Error al guardar. Intentá de nuevo.'); return; }
    setModalOpen(false);
  };

  return (
    <div className="page-propietarios">
      <div className="page-header">
        <div>
          <h1 className="page-title">Propietarios</h1>
          <p className="page-subtitle">{propietarios.length} propietarios registrados</p>
        </div>
        <button className="btn btn-primary" onClick={openNuevo}>
          <Plus size={16} /> Nuevo propietario
        </button>
      </div>

      <div className="cards-grid">
        {propietarios.map(owner => {
          const props = propiedades.filter(p => p.propietarioId === owner.id);
          const incidencias = getIncidenciasPorPropietario(owner.id);
          const pendientes = incidencias.filter(i => i.estado === 'Pendiente de aprobación');

          return (
            <div key={owner.id} className="owner-card card card-hoverable" onClick={() => navigate(`/propietarios/${owner.id}`)}>
              <div className="owner-card-header">
                <div className="owner-avatar">
                  {owner.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="owner-name">{owner.nombre}</h3>
                  <p className="owner-contact">{owner.email}</p>
                </div>
                <button className="btn-icon-sm" title="Editar" onClick={(e) => openEditar(e, owner)}>
                  <Pencil size={14} />
                </button>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar propietario' : 'Nuevo propietario'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Roberto Álvarez" autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="roberto@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input className="form-input" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+54 11 4444-0000" />
          </div>
          <div className="form-row">
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
