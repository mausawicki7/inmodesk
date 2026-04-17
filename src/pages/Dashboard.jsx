import { useApp } from '../context/AppContext';
import KpiCard from '../components/common/KpiCard';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency, rubroConfig } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertTriangle, Clock, CheckCircle2, Zap, Timer, TrendingUp } from 'lucide-react';

const PIE_COLORS = ['#14181f', '#c4563a', '#b8892e', '#606a3a', '#3c6b85', '#9a3b22', '#7b8192', '#a8321b'];

export default function Dashboard() {
  const { incidencias } = useApp();
  const navigate = useNavigate();

  const abiertas = incidencias.filter(i => !['Resuelta', 'Cerrada'].includes(i.estado)).length;
  const pendientes = incidencias.filter(i => i.estado === 'Pendiente de aprobación').length;
  const urgentes = incidencias.filter(i => ['Alta', 'Crítica'].includes(i.urgencia) && !['Resuelta', 'Cerrada'].includes(i.estado)).length;
  const enCurso = incidencias.filter(i => i.estado === 'En curso').length;
  const resueltas = incidencias.filter(i => i.estado === 'Resuelta').length;
  const tiempoPromedio = '3.2 días';

  const porRubro = Object.entries(
    incidencias.reduce((acc, inc) => {
      acc[inc.rubro] = (acc[inc.rubro] || 0) + 1;
      return acc;
    }, {})
  ).map(([rubro, cantidad]) => ({
    name: rubro,
    cantidad,
    icon: rubroConfig[rubro]?.icon || '📌',
    fill: rubroConfig[rubro]?.color || '#6b7280',
  })).sort((a, b) => b.cantidad - a.cantidad);

  const porEstado = Object.entries(
    incidencias.reduce((acc, inc) => {
      acc[inc.estado] = (acc[inc.estado] || 0) + 1;
      return acc;
    }, {})
  ).map(([estado, value]) => ({ name: estado, value }));

  const recientes = [...incidencias]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 6);

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="hero-headline">
          <div>
            <span className="hero-eyebrow">Panel de operaciones · {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <br />
            <h1 className="hero-title">Cada reclamo,<br /><em>claro y trazable.</em></h1>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-value">{abiertas}</span>
              <span className="hero-meta-label">Activas</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-value">{urgentes}</span>
              <span className="hero-meta-label">Urgentes</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-value">{tiempoPromedio}</span>
              <span className="hero-meta-label">Tiempo promedio</span>
            </div>
          </div>
        </div>

        <div className="hero-aside">
          <KpiCard icon={<Clock size={22} />} label="Pendientes" value={pendientes} color="#b8892e" subtitle="esperan aprobación" />
          <KpiCard icon={<Zap size={22} />} label="Urgentes" value={urgentes} color="#c4563a" subtitle="alta o crítica" />
        </div>
      </div>

      <div className="kpi-grid kpi-grid-4">
        <KpiCard icon={<AlertTriangle size={22} />} label="Abiertas" value={abiertas} color="#14181f" subtitle="incidencias activas" />
        <KpiCard icon={<TrendingUp size={22} />} label="En Curso" value={enCurso} color="#3c6b85" subtitle="en reparación" />
        <KpiCard icon={<CheckCircle2 size={22} />} label="Resueltas" value={resueltas} color="#606a3a" subtitle="este período" />
        <KpiCard icon={<Timer size={22} />} label="Tiempo Prom." value={tiempoPromedio} color="#8a6414" subtitle="de resolución" />
      </div>

      <div className="charts-grid">
        <Card title="Incidencias por Rubro" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porRubro} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#d9cfb9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4a5162', fontFamily: 'Instrument Sans' }} axisLine={{ stroke: '#c5b897' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7b8192', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(20, 24, 31, 0.06)' }}
                contentStyle={{ borderRadius: '2px', border: '1px solid #14181f', background: '#faf6ed', boxShadow: '3px 3px 0 #c4563a', fontFamily: 'Instrument Sans', fontSize: 12 }}
                labelStyle={{ color: '#14181f', fontWeight: 600 }}
                formatter={(value) => [value, 'Cantidad']}
              />
              <Bar dataKey="cantidad" radius={[2, 2, 0, 0]}>
                {porRubro.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Distribución por Estado" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={porEstado}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {porEstado.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '2px', border: '1px solid #14181f', background: '#faf6ed', boxShadow: '3px 3px 0 #c4563a', fontFamily: 'Instrument Sans', fontSize: 12 }}
                labelStyle={{ color: '#14181f', fontWeight: 600 }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="square"
                iconSize={9}
                formatter={(value) => <span style={{ color: '#4a5162', fontSize: '11px', fontFamily: 'Instrument Sans', letterSpacing: '0.3px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Incidencias Recientes" className="recent-table-card" actions={
        <button className="btn btn-ghost" onClick={() => navigate('/incidencias')}>Ver todas →</button>
      }>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Rubro</th>
                <th>Urgencia</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Presupuesto</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map(inc => (
                <tr key={inc.id} className="table-row-clickable" onClick={() => navigate(`/incidencias/${inc.id}`)}>
                  <td className="td-id">{inc.id}</td>
                  <td className="td-title">{inc.titulo}</td>
                  <td>
                    <span className="rubro-tag">
                      <span>{rubroConfig[inc.rubro]?.icon}</span> {inc.rubro}
                    </span>
                  </td>
                  <td><Badge tipo="urgencia" valor={inc.urgencia} size="small" /></td>
                  <td><Badge tipo="estado" valor={inc.estado} size="small" /></td>
                  <td className="td-date">{formatDate(inc.fechaCreacion)}</td>
                  <td className="td-currency">{formatCurrency(inc.presupuestoEstimado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
