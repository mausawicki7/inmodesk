import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Modal from '../components/common/Modal';
import { PLANES as PLANES_CONFIG, NOMBRES_PLANES, formatPrecio } from '../utils/planes';
import {
  Building2, Users, Wrench, AlertTriangle, Plus, Pencil,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, CreditCard, Clock, BadgeAlert
} from 'lucide-react';

const PLANES = NOMBRES_PLANES;
const EMPTY_FORM = { nombre: '', email: '', plan: 'Básico', estado: 'activa' };

function diasHasta(fechaStr) {
  if (!fechaStr) return null;
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const fecha = new Date(fechaStr); fecha.setHours(0,0,0,0);
  return Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));
}

function EstadoPago({ dias, estadoPago }) {
  if (estadoPago === 'vencido' || dias < 0)
    return <span className="pago-badge pago-vencido"><BadgeAlert size={12} /> Vencido</span>;
  if (dias <= 7)
    return <span className="pago-badge pago-proximo"><Clock size={12} /> Vence en {dias}d</span>;
  return <span className="pago-badge pago-ok"><CheckCircle2 size={12} /> Al día</span>;
}

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('inmobiliarias');
  const [inmobiliarias, setInmobiliarias] = useState([]);
  const [stats, setStats] = useState({ usuarios: {}, propiedades: {}, incidencias: {} });
  const [loading, setLoading] = useState(true);
  const [planesOpen, setPlanesOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cobrarModal, setCobrarModal] = useState(null); // inmo seleccionada
  const [comprobante, setComprobante] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [inmosRes, usersRes, propsRes, incsRes] = await Promise.all([
      supabase.from('inmobiliarias').select('*').order('nombre'),
      supabase.from('usuarios').select('id, inmobiliaria_id'),
      supabase.from('propiedades').select('inmobiliaria_id'),
      supabase.from('incidencias').select('inmobiliaria_id, estado'),
    ]);

    const usuarios = {}, propiedades = {}, incidencias = {};
    (usersRes.data || []).forEach(u => { if (u.inmobiliaria_id) usuarios[u.inmobiliaria_id] = (usuarios[u.inmobiliaria_id] || 0) + 1; });
    (propsRes.data || []).forEach(p => { propiedades[p.inmobiliaria_id] = (propiedades[p.inmobiliaria_id] || 0) + 1; });
    (incsRes.data || []).forEach(i => { incidencias[i.inmobiliaria_id] = (incidencias[i.inmobiliaria_id] || 0) + 1; });

    setInmobiliarias(inmosRes.data || []);
    setStats({ usuarios, propiedades, incidencias });
    setLoading(false);
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openNueva = () => { setEditingId(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEditar = (e, inmo) => {
    e.stopPropagation();
    setEditingId(inmo.id);
    setForm({ nombre: inmo.nombre || '', email: inmo.email || '', plan: inmo.plan || 'Básico', estado: inmo.estado || 'activa' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!form.email.trim()) { setError('El email es obligatorio.'); return; }
    setSaving(true); setError('');

    const hoy = new Date().toISOString().split('T')[0];
    const proximoMes = new Date(); proximoMes.setMonth(proximoMes.getMonth() + 1);
    const proximoMesStr = proximoMes.toISOString().split('T')[0];

    if (editingId) {
      const { error } = await supabase.from('inmobiliarias').update({
        nombre: form.nombre, email: form.email, plan: form.plan, estado: form.estado,
      }).eq('id', editingId);
      if (error) { setError(`Error: ${error.message}`); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('inmobiliarias').insert({
        id: crypto.randomUUID(), nombre: form.nombre, email: form.email,
        plan: form.plan, estado: form.estado,
        fecha_inicio_plan: hoy,
        fecha_proximo_cobro: proximoMesStr,
        estado_pago: 'al_dia',
        historial_pagos: [],
      });
      if (error) { setError(`Error: ${error.message}`); setSaving(false); return; }
    }

    setSaving(false); setModalOpen(false); loadData();
  };

  const abrirCobrarModal = (e, inmo) => {
    e.stopPropagation();
    setComprobante(null);
    setUploadError('');
    setCobrarModal(inmo);
  };

  const handleComprobanteChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setUploadError('Solo se aceptan archivos JPG, PNG o PDF.');
      setComprobante(null);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('El archivo no puede superar 8 MB.');
      setComprobante(null);
      return;
    }
    setUploadError('');
    setComprobante(file);
  };

  const confirmarCobro = async () => {
    if (!comprobante) { setUploadError('Debés adjuntar el comprobante de pago.'); return; }
    const inmo = cobrarModal;
    setUploading(true);
    setUploadError('');

    const ext = comprobante.name.split('.').pop();
    const path = `${inmo.id}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('comprobantes')
      .upload(path, comprobante, { upsert: false });

    if (uploadErr) {
      setUploadError(`Error al subir el archivo: ${uploadErr.message}`);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('comprobantes').getPublicUrl(path);

    const hoy = new Date().toISOString().split('T')[0];
    const proxima = new Date(inmo.fecha_proximo_cobro || new Date());
    proxima.setMonth(proxima.getMonth() + 1);
    const proximaStr = proxima.toISOString().split('T')[0];

    const nuevoPago = {
      fecha: hoy,
      monto: PLANES_CONFIG[inmo.plan]?.precio || 0,
      plan: inmo.plan,
      comprobante_path: path,
      comprobante_url: publicUrl,
      comprobante_nombre: comprobante.name,
    };

    const { error: dbErr } = await supabase.from('inmobiliarias').update({
      estado_pago: 'al_dia',
      fecha_proximo_cobro: proximaStr,
      historial_pagos: [...(inmo.historial_pagos || []), nuevoPago],
    }).eq('id', inmo.id);

    if (dbErr) {
      setUploadError(`Error al guardar: ${dbErr.message}`);
      setUploading(false);
      return;
    }

    setUploading(false);
    setCobrarModal(null);
    setComprobante(null);
    loadData();
  };

  const totales = {
    inmobiliarias: inmobiliarias.length,
    activas: inmobiliarias.filter(i => i.estado === 'activa').length,
    usuarios: Object.values(stats.usuarios).reduce((a, b) => a + b, 0),
    incidencias: Object.values(stats.incidencias).reduce((a, b) => a + b, 0),
  };

  const cobrosOrdenados = [...inmobiliarias]
    .filter(i => i.estado === 'activa')
    .sort((a, b) => new Date(a.fecha_proximo_cobro) - new Date(b.fecha_proximo_cobro));

  const vencidos = cobrosOrdenados.filter(i => diasHasta(i.fecha_proximo_cobro) < 0 || i.estado_pago === 'vencido').length;
  const proximosSemana = cobrosOrdenados.filter(i => { const d = diasHasta(i.fecha_proximo_cobro); return d >= 0 && d <= 7; }).length;

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>;

  return (
    <div className="page-superadmin">
      <div className="page-header">
        <div>
          <h1 className="page-title">Panel InmoDesk</h1>
          <p className="page-subtitle">Administración global de la plataforma</p>
        </div>
        <button className="btn btn-primary" onClick={openNueva}>
          <Plus size={16} /> Nueva inmobiliaria
        </button>
      </div>

      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card">
          <div className="kpi-header"><span className="kpi-label">Inmobiliarias</span><Building2 size={18} className="kpi-icon" /></div>
          <span className="kpi-value">{totales.inmobiliarias}</span>
          <span className="kpi-sub">{totales.activas} activas</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span className="kpi-label">Usuarios</span><Users size={18} className="kpi-icon" /></div>
          <span className="kpi-value">{totales.usuarios}</span>
          <span className="kpi-sub">en la plataforma</span>
        </div>
        <div className={`kpi-card ${vencidos > 0 ? 'kpi-card--alert' : ''}`}>
          <div className="kpi-header"><span className="kpi-label">Cobros vencidos</span><CreditCard size={18} className="kpi-icon" /></div>
          <span className="kpi-value">{vencidos}</span>
          <span className="kpi-sub">{proximosSemana} vencen esta semana</span>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span className="kpi-label">Incidencias</span><AlertTriangle size={18} className="kpi-icon" /></div>
          <span className="kpi-value">{totales.incidencias}</span>
          <span className="kpi-sub">en la plataforma</span>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 24 }}>
        {[['inmobiliarias', 'Inmobiliarias'], ['cobros', 'Cobros']].map(([val, label]) => (
          <button key={val} className={`filter-tab ${tab === val ? 'active' : ''}`} onClick={() => setTab(val)}>
            {label}
            {val === 'cobros' && vencidos > 0 && <span className="tab-alert-dot" />}
          </button>
        ))}
      </div>

      {tab === 'inmobiliarias' && (
        <>
          <div className="table-wrapper card">
            <table className="table">
              <thead>
                <tr>
                  <th>Inmobiliaria</th>
                  <th>Plan</th>
                  <th>Estado</th>
                  <th>Usuarios</th>
                  <th>Propiedades</th>
                  <th>Incidencias</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inmobiliarias.map(inmo => (
                  <tr key={inmo.id} className="table-row-clickable" onClick={() => navigate(`/superadmin/inmobiliarias/${inmo.id}`)}>
                    <td>
                      <div className="inmo-name-cell">
                        <strong>{inmo.nombre}</strong>
                        <span className="inmo-email">{inmo.email}</span>
                      </div>
                    </td>
                    <td><span className="plan-badge">{inmo.plan}</span></td>
                    <td>
                      <span className={`estado-badge ${inmo.estado === 'activa' ? 'estado-activa' : 'estado-suspendida'}`}>
                        {inmo.estado === 'activa' ? <><CheckCircle2 size={12} /> Activa</> : <><XCircle size={12} /> Suspendida</>}
                      </span>
                    </td>
                    <td className="td-num">{stats.usuarios[inmo.id] || 0}</td>
                    <td className="td-num">{stats.propiedades[inmo.id] || 0}</td>
                    <td className="td-num">{stats.incidencias[inmo.id] || 0}</td>
                    <td>
                      <button className="btn-icon-sm" title="Editar" onClick={(e) => openEditar(e, inmo)}>
                        <Pencil size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="planes-section">
            <button className="planes-toggle" onClick={() => setPlanesOpen(v => !v)}>
              <span>Planes y precios</span>
              {planesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {planesOpen && (
              <div className="planes-grid">
                {NOMBRES_PLANES.map(key => {
                  const plan = PLANES_CONFIG[key];
                  const count = inmobiliarias.filter(i => i.plan === key).length;
                  return (
                    <div key={key} className="plan-card">
                      <div className="plan-card-header">
                        <span className="plan-nombre">{plan.nombre}</span>
                        <span className="plan-precio">{formatPrecio(plan.precio)}<span className="plan-periodo">/mes</span></span>
                      </div>
                      <p className="plan-descripcion">{plan.descripcion}</p>
                      <ul className="plan-features">
                        {plan.features.map(f => <li key={f}><CheckCircle2 size={13} /> {f}</li>)}
                      </ul>
                      <div className="plan-footer">
                        <span>{count} inmobiliaria{count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'cobros' && (
        <div className="table-wrapper card">
          <table className="table">
            <thead>
              <tr>
                <th>Inmobiliaria</th>
                <th>Plan</th>
                <th>Monto</th>
                <th>Próximo cobro</th>
                <th>Estado</th>
                <th>Último pago</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cobrosOrdenados.map(inmo => {
                const dias = diasHasta(inmo.fecha_proximo_cobro);
                const ultimoPago = inmo.historial_pagos?.at(-1);
                return (
                  <tr key={inmo.id} className={`table-row-clickable ${dias < 0 ? 'row-vencida' : dias <= 7 ? 'row-proxima' : ''}`}
                    onClick={() => navigate(`/superadmin/inmobiliarias/${inmo.id}`)}>
                    <td>
                      <div className="inmo-name-cell">
                        <strong>{inmo.nombre}</strong>
                        <span className="inmo-email">{inmo.email}</span>
                      </div>
                    </td>
                    <td><span className="plan-badge">{inmo.plan}</span></td>
                    <td className="td-monto">{formatPrecio(PLANES_CONFIG[inmo.plan]?.precio || 0)}</td>
                    <td className="td-date">
                      {inmo.fecha_proximo_cobro
                        ? new Date(inmo.fecha_proximo_cobro).toLocaleDateString('es-AR')
                        : '—'}
                    </td>
                    <td><EstadoPago dias={dias} estadoPago={inmo.estado_pago} /></td>
                    <td className="td-date">
                      {ultimoPago
                        ? `${new Date(ultimoPago.fecha).toLocaleDateString('es-AR')} · ${formatPrecio(ultimoPago.monto)}`
                        : '—'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-olive"
                        onClick={(e) => abrirCobrarModal(e, inmo)}
                        title="Registrar cobro con comprobante"
                      >
                        Marcar cobrado
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!cobrarModal} onClose={() => setCobrarModal(null)} title="Registrar cobro">
        {cobrarModal && (
          <div className="form">
            <div className="cobro-resumen">
              <div className="cobro-resumen-row">
                <span>Inmobiliaria</span>
                <strong>{cobrarModal.nombre}</strong>
              </div>
              <div className="cobro-resumen-row">
                <span>Plan</span>
                <strong>{cobrarModal.plan}</strong>
              </div>
              <div className="cobro-resumen-row cobro-resumen-total">
                <span>Monto</span>
                <strong>{formatPrecio(PLANES_CONFIG[cobrarModal.plan]?.precio || 0)}</strong>
              </div>
              <div className="cobro-resumen-row">
                <span>Próximo vencimiento</span>
                <strong>
                  {(() => {
                    const d = new Date(cobrarModal.fecha_proximo_cobro || new Date());
                    d.setMonth(d.getMonth() + 1);
                    return d.toLocaleDateString('es-AR');
                  })()}
                </strong>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Comprobante de pago *</label>
              <label className="file-upload-area">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleComprobanteChange}
                  style={{ display: 'none' }}
                />
                {comprobante ? (
                  <div className="file-selected">
                    <CheckCircle2 size={18} style={{ color: 'var(--olive)' }} />
                    <span>{comprobante.name}</span>
                    <span className="file-size">({(comprobante.size / 1024).toFixed(0)} KB)</span>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <CreditCard size={22} />
                    <span>Hacé click para adjuntar</span>
                    <span className="file-hint">JPG, PNG o PDF · máx. 8 MB</span>
                  </div>
                )}
              </label>
              {uploadError && <p className="form-error">{uploadError}</p>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setCobrarModal(null)}>Cancelar</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmarCobro}
                disabled={uploading || !comprobante}
              >
                {uploading ? 'Subiendo…' : 'Confirmar cobro'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar inmobiliaria' : 'Nueva inmobiliaria'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Inmobiliaria Central" autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@inmobiliaria.com" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Plan</label>
              <select className="form-input" name="plan" value={form.plan} onChange={handleChange}>
                {PLANES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="form-input" name="estado" value={form.estado} onChange={handleChange}>
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
              </select>
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

function ProveedoresGlobalesCount() {
  const [count, setCount] = useState('…');
  useEffect(() => {
    supabase.from('proveedores').select('id', { count: 'exact' }).is('inmobiliaria_id', null)
      .then(({ count }) => setCount(count ?? 0));
  }, []);
  return count;
}
