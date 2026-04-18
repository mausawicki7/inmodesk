import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { loading, error } = useApp();
  const { usuario, isSuper, logout } = useAuth();

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  );

  if (error) return (
    <div className="loading-screen">
      <p style={{ color: '#c4563a', fontFamily: 'Instrument Sans' }}>
        Error conectando a la base de datos. Verificá tu conexión.
      </p>
    </div>
  );

  if (!isSuper && usuario?.inmobiliarias?.estado === 'suspendida') return (
    <div className="suspended-screen">
      <div className="suspended-card">
        <div className="suspended-icon">🔒</div>
        <h1 className="suspended-title">Cuenta suspendida</h1>
        <p className="suspended-msg">
          El acceso a <strong>{usuario.inmobiliarias.nombre}</strong> fue suspendido.
          Contactate con InmoDesk para regularizar tu situación.
        </p>
        <a href="mailto:soporte@inmodesk.com" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          Contactar soporte
        </a>
        <button className="btn btn-ghost" onClick={logout} style={{ marginTop: 8 }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
