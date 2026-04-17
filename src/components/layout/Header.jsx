import { useLocation, Link } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';

const routeNames = {
  '/': 'Dashboard',
  '/incidencias': 'Incidencias',
  '/propiedades': 'Propiedades',
  '/propietarios': 'Propietarios',
  '/proveedores': 'Proveedores',
  '/simular-reclamo': 'Simular Reclamo',
};

export default function Header() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const pathParts = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Inicio', path: '/' }];
    if (pathParts.length > 0) {
      const basePath = `/${pathParts[0]}`;
      crumbs.push({ label: routeNames[basePath] || pathParts[0], path: basePath });
    }
    if (pathParts.length > 1) {
      crumbs.push({ label: pathParts[1].toUpperCase(), path: location.pathname });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="header">
      <div className="header-left">
        <nav className="breadcrumbs">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="breadcrumb-item">
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="breadcrumb-current">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="header-right">
        <div className={`header-search ${searchOpen ? 'search-open' : ''}`}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            className="search-input"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
        <button className="header-notification">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
      </div>
    </header>
  );
}
