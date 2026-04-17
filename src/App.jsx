import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Incidencias from './pages/Incidencias';
import IncidenciaDetalle from './pages/IncidenciaDetalle';
import Conversacion from './pages/Conversacion';
import Propiedades from './pages/Propiedades';
import PropiedadDetalle from './pages/PropiedadDetalle';
import Propietarios from './pages/Propietarios';
import PropietarioDetalle from './pages/PropietarioDetalle';
import Proveedores from './pages/Proveedores';
import ProveedorDetalle from './pages/ProveedorDetalle';
import SimularReclamo from './pages/SimularReclamo';
import './App.css';

function ProtectedRoutes() {
  const { session, loading } = useAuth()

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  )

  if (!session) return <Navigate to="/login" replace />

  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incidencias" element={<Incidencias />} />
          <Route path="/incidencias/:id" element={<IncidenciaDetalle />} />
          <Route path="/incidencias/:id/conversacion" element={<Conversacion />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/propiedades/:id" element={<PropiedadDetalle />} />
          <Route path="/propietarios" element={<Propietarios />} />
          <Route path="/propietarios/:id" element={<PropietarioDetalle />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proveedores/:id" element={<ProveedorDetalle />} />
          <Route path="/simular-reclamo" element={<SimularReclamo />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
