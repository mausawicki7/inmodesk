import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Building2,
  Users,
  Wrench,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/incidencias', icon: AlertTriangle, label: 'Incidencias' },
  { to: '/propiedades', icon: Building2, label: 'Propiedades' },
  { to: '/propietarios', icon: Users, label: 'Propietarios' },
  { to: '/proveedores', icon: Wrench, label: 'Proveedores' },
  { to: '/simular-reclamo', icon: PlusCircle, label: 'Simular Reclamo' },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const initials = (usuario?.nombre || 'A')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  function handleUserClick() {
    setMobileOpen(false)
    navigate('/perfil')
  }

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Building2 size={22} />
            </div>
            <div className="logo-text">
              <span className="logo-name">InmoDesk</span>
              <span className="logo-tagline">Claro · Trazable</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Principal</span>
            {navItems.slice(0, 2).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Directorio</span>
            {navItems.slice(2, 5).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Demo</span>
            {navItems.slice(5).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-user" onClick={handleUserClick}>
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{usuario?.nombre || 'Admin'}</span>
              <span className="user-role">{usuario?.inmobiliarias?.nombre || ''}</span>
            </div>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
