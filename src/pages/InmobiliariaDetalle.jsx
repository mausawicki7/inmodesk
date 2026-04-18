import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { formatDate } from '../utils/helpers';
import {
  ArrowLeft, Building2, Users, AlertTriangle, Wrench,
  CheckCircle2, XCircle, Mail, ShieldCheck, User
} from 'lucide-react';
import { PLANES as PLANES_CONFIG, formatPrecio } from '../utils/planes';

const ROL_LABEL = { superadmin: 'SuperAdmin', admin: 'Admin', operador: 'Operador' };
const ROL_COLOR = { superadmin: 'badge-terra', admin: 'badge-olive', operador: 'badge-sky' };

export default function InmobiliariaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inmo, setInmo] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    setLoading(true);
    const [inmoRes, usersRes, incsRes, propsRes, provsRes] = await Promise.all([
      supabase.from('inmobiliarias').select('*').eq('id', id).single(),
      supabase.from('usuarios').select('id, nombre, email, rol, created_at').eq('inmobiliaria_id', id),
      supabase.from('incidencias').select('id, titulo, estado, urgencia, fecha_creacion').eq('inmobiliaria_id', id).order('fecha_creacion', { ascending: false }).limit(10),
      supabase.from('propiedades').select('id', { count: 'exact' }).eq('inmobiliaria_id', id),
      supabase.from('proveedores').select('id', { count: 'exact' }).eq('inmobiliaria_id', id),
    ]);

    setInmo(inmoRes.data);
    setUsuarios(usersRes.data || []);
    setIncidencias(incsRes.data || []);
    setPropiedades(propsRes.data || []);
    setProveedores(provsRes.data || []);
    setLoading(false);
  }

  async function toggleEstado() {
    if (!inmo) return;
    setToggling(true);
    const nuevoEstado = inmo.estado === 'activa' ? 'suspendida' : 'activa';
    const { error } = await supabase.from('inmobiliarias').update({ estado: nuevoEstado }).eq('id', id);
    if (!error) setInmo(prev => ({ ...prev, estado: nuevoEstado }));
    setToggling(false);
  }

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>;
  if (!inmo) return <div className="empty-state"><p>Inmobiliaria no encontrada</p><button className="btn btn-primary" onClick={() => navigate('/superadmin')}>Volver</button></div>;

  const activas = incidencias.filter(i => !['Resuelta', 'Cerrada'].includes(i.estado));

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <button className="btn btn-ghost" onClick={() => navigate('/superadmin')}>
          <ArrowLeft size={18} /> Volver
        </button>
        <button
          className={`btn ${inmo.estado === 'activa' ? 'btn-danger' : 'btn-secondary'}`}
          onClick={toggleEstado}
          disabled={toggling}
        >
          {inmo.estado === 'activa'
            ? <><XCircle size={15} /> Suspender</>
            : <><CheckCircle2 size={15} /> Reactivar</>}
        </button>
        <div className="detalle-title-row">
          <div>
            <h1 className="detalle-title">{inmo.nombre}</h1>
            <p className="detalle-subtitle"><Mail size={14} /> {inmo.email}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="plan-badge">{inmo.plan}</span>
            <span className={`estado-badge ${inmo.estado === 'activa' ? 'estado-activa' : 'estado-suspendida'}`}>
              {inmo.estado === 'activa' ? <><CheckCircle2 size={12} /> Activa</> : <><XCircle size={12} /> Suspendida</>}
            </span>
          </div>
        </div>
      </div>

      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card mini">
          <Users size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{usuarios.length}</span>
            <span className="kpi-label">Usuarios</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <Building2 size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{propiedades.length}</span>
            <span className="kpi-label">Propiedades</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <AlertTriangle size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{incidencias.length}</span>
            <span className="kpi-label">Incidencias</span>
          </div>
        </div>
        <div className="kpi-card mini">
          <Wrench size={20} className="kpi-mini-icon" />
          <div className="kpi-content">
            <span className="kpi-value">{proveedores.length}</span>
            <span className="kpi-label">Proveedores propios</span>
          </div>
        </div>
      </div>

      <div className="detalle-grid">
        <div className="detalle-main">
          <Card title="Incidencias recientes" className="detalle-card">
            {incidencias.length > 0 ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Urgencia</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidencias.map(inc => (
                      <tr key={inc.id}>
                        <td className="td-title">{inc.titulo}</td>
                        <td><Badge tipo="urgencia" valor={inc.urgencia} size="small" /></td>
                        <td><Badge tipo="estado" valor={inc.estado} size="small" /></td>
                        <td className="td-date">{formatDate(inc.fecha_creacion)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="empty-text">Sin incidencias registradas.</p>}
          </Card>
        </div>

        <div className="detalle-sidebar">
          <Card title="Usuarios" className="detalle-card">
            <div className="entity-list">
              {usuarios.length > 0 ? usuarios.map(u => (
                <div key={u.id} className="entity-card">
                  <div className={`user-rol-icon ${u.rol === 'superadmin' ? 'icon-super' : 'icon-admin'}`}>
                    {u.rol === 'superadmin' ? <ShieldCheck size={16} /> : <User size={16} />}
                  </div>
                  <div>
                    <strong>{u.nombre || '—'}</strong>
                    <span className="entity-sub"><Mail size={12} /> {u.email}</span>
                    <span className={`badge-inline ${ROL_COLOR[u.rol] || 'badge-info'}`} style={{ marginTop: 4 }}>
                      {ROL_LABEL[u.rol] || u.rol}
                    </span>
                  </div>
                </div>
              )) : <p className="empty-text">Sin usuarios.</p>}
            </div>
          </Card>

          <Card title="Información" className="detalle-card">
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Plan</span>
                <span className="info-value">{inmo.plan}</span>
              </div>
              {PLANES_CONFIG[inmo.plan] && (
                <div className="info-item">
                  <span className="info-label">Precio</span>
                  <span className="info-value">{formatPrecio(PLANES_CONFIG[inmo.plan].precio)}/mes</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Propiedades</span>
                <span className="info-value">
                  {propiedades.length} / {PLANES_CONFIG[inmo.plan]?.propiedadesMax === Infinity ? '∞' : PLANES_CONFIG[inmo.plan]?.propiedadesMax ?? '—'}
                  {PLANES_CONFIG[inmo.plan] && propiedades.length >= PLANES_CONFIG[inmo.plan].propiedadesMax && (
                    <span className="limit-reached"> · Límite alcanzado</span>
                  )}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado</span>
                <span className="info-value">{inmo.estado}</span>
              </div>
              {inmo.created_at && (
                <div className="info-item">
                  <span className="info-label">Alta</span>
                  <span className="info-value">{formatDate(inmo.created_at)}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Incidencias activas</span>
                <span className="info-value">{activas.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
