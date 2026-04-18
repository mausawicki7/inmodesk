import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { PLANES } from '../utils/planes';
import { Building2, MapPin, AlertTriangle, Plus, Pencil } from 'lucide-react';

const TIPOS = ['Departamento', 'PH', 'Casa', 'Local', 'Oficina'];
const ESTADOS_CONTRATO = ['Vigente', 'Vencido', 'Sin contrato'];

const EMPTY_FORM = {
  direccion: '', unidad: '', tipo: 'Departamento', barrio: '', ciudad: 'CABA',
  ambientes: '', metros: '', alquilerMensual: '',
  estadoContrato: 'Vigente', fechaInicioContrato: '', fechaFinContrato: '',
  propietarioId: '',
  inquilinoNombre: '', inquilinoEmail: '', inquilinoTelefono: '', inquilinoDni: '',
};

export default function Propiedades() {
  const { propiedades, propietarios, getPropietario, getInquilino, getIncidenciasPorPropiedad, crearPropiedad, crearInquilino, editarPropiedad } = useApp();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const plan = PLANES[usuario?.inmobiliarias?.plan] || PLANES['Básico'];
  const limiteAlcanzado = propiedades.length >= plan.propiedadesMax;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openNuevo = () => { setEditingId(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };

  const openEditar = (e, prop) => {
    e.stopPropagation();
    setEditingId(prop.id);
    setForm({
      direccion: prop.direccion || '', unidad: prop.unidad || '',
      tipo: prop.tipo || 'Departamento', barrio: prop.barrio || '', ciudad: prop.ciudad || 'CABA',
      ambientes: prop.ambientes || '', metros: prop.metros || '', alquilerMensual: prop.alquilerMensual || '',
      estadoContrato: prop.estadoContrato || 'Vigente',
      fechaInicioContrato: prop.fechaInicioContrato || '', fechaFinContrato: prop.fechaFinContrato || '',
      propietarioId: prop.propietarioId || '',
      inquilinoNombre: '', inquilinoEmail: '', inquilinoTelefono: '', inquilinoDni: '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.direccion.trim()) { setError('La dirección es obligatoria.'); return; }
    setSaving(true);
    setError('');

    if (editingId) {
      const ok = await editarPropiedad(editingId, form);
      setSaving(false);
      if (!ok) { setError('Error al guardar. Intentá de nuevo.'); return; }
    } else {
      let inquilinoId = null;
      if (form.inquilinoNombre.trim()) {
        const inq = await crearInquilino({ nombre: form.inquilinoNombre, email: form.inquilinoEmail, telefono: form.inquilinoTelefono, dni: form.inquilinoDni });
        if (!inq) { setError('Error al crear el inquilino.'); setSaving(false); return; }
        inquilinoId = inq.id;
      }
      const result = await crearPropiedad({ ...form, inquilinoId });
      setSaving(false);
      if (!result) { setError('Error al guardar. Intentá de nuevo.'); return; }
    }
    setModalOpen(false);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="page-propiedades">
      <div className="page-header">
        <div>
          <h1 className="page-title">Propiedades</h1>
          <p className="page-subtitle">{propiedades.length} propiedades administradas</p>
        </div>
        <button className="btn btn-primary" onClick={openNuevo} disabled={limiteAlcanzado} title={limiteAlcanzado ? `Límite del plan ${plan.nombre} alcanzado (${plan.propiedadesMax} propiedades)` : ''}>
          <Plus size={16} /> Nueva propiedad
        </button>
        {limiteAlcanzado && (
          <p className="plan-limit-warning">
            Alcanzaste el límite de <strong>{plan.propiedadesMax} propiedades</strong> del plan {plan.nombre}. Contactá a InmoDesk para hacer un upgrade.
          </p>
        )}
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
                <div className="property-icon"><Building2 size={20} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="property-type-badge">{prop.tipo}</div>
                  <button className="btn-icon-sm" title="Editar" onClick={(e) => openEditar(e, prop)}><Pencil size={14} /></button>
                </div>
              </div>
              <h3 className="property-address">{prop.direccion}, {prop.unidad}</h3>
              <p className="property-location"><MapPin size={14} /> {prop.barrio}, {prop.ciudad}</p>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar propiedad' : 'Nueva propiedad'} size="large">
        <form onSubmit={handleSubmit} className="form">

          <div className="form-section-title">Datos de la propiedad</div>
          <div className="form-row">
            <div className="form-group form-group-grow">
              <label className="form-label">Dirección *</label>
              <input className="form-input" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Av. Santa Fe 2100" autoFocus />
            </div>
            <div className="form-group form-group-sm">
              <label className="form-label">Unidad</label>
              <input className="form-input" name="unidad" value={form.unidad} onChange={handleChange} placeholder="4B" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-input" name="tipo" value={form.tipo} onChange={handleChange}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Barrio</label>
              <input className="form-input" name="barrio" value={form.barrio} onChange={handleChange} placeholder="Palermo" />
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input className="form-input" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="CABA" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ambientes</label>
              <input className="form-input" name="ambientes" type="number" min="1" value={form.ambientes} onChange={handleChange} placeholder="3" />
            </div>
            <div className="form-group">
              <label className="form-label">Superficie (m²)</label>
              <input className="form-input" name="metros" type="number" min="1" value={form.metros} onChange={handleChange} placeholder="75" />
            </div>
            <div className="form-group">
              <label className="form-label">Alquiler mensual ($)</label>
              <input className="form-input" name="alquilerMensual" type="number" min="0" value={form.alquilerMensual} onChange={handleChange} placeholder="350000" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estado contrato</label>
              <select className="form-input" name="estadoContrato" value={form.estadoContrato} onChange={handleChange}>
                {ESTADOS_CONTRATO.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Inicio contrato</label>
              <input className="form-input" name="fechaInicioContrato" type="date" value={form.fechaInicioContrato} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Fin contrato</label>
              <input className="form-input" name="fechaFinContrato" type="date" value={form.fechaFinContrato} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Propietario</label>
            <select className="form-input" name="propietarioId" value={form.propietarioId} onChange={handleChange}>
              <option value="">— Sin asignar —</option>
              {propietarios.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
            </select>
          </div>

          {!editingId && <div className="form-section-title" style={{ marginTop: '1.25rem' }}>Inquilino (opcional)</div>}
          {!editingId && <>
          <div className="form-row">
            <div className="form-group form-group-grow">
              <label className="form-label">Nombre</label>
              <input className="form-input" name="inquilinoNombre" value={form.inquilinoNombre} onChange={handleChange} placeholder="María González" />
            </div>
            <div className="form-group">
              <label className="form-label">DNI</label>
              <input className="form-input" name="inquilinoDni" value={form.inquilinoDni} onChange={handleChange} placeholder="28.456.789" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="inquilinoEmail" type="email" value={form.inquilinoEmail} onChange={handleChange} placeholder="maria@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" name="inquilinoTelefono" value={form.inquilinoTelefono} onChange={handleChange} placeholder="+54 11 5555-0000" />
            </div>
          </div>
          </>}

          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar propiedad'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
