import { createContext, useContext, useState, useCallback } from 'react';
import { incidencias as initialIncidencias } from '../data/incidencias';
import { propiedades } from '../data/propiedades';
import { propietarios } from '../data/propietarios';
import { proveedores } from '../data/proveedores';
import { inquilinos } from '../data/inquilinos';
import { conversaciones } from '../data/conversaciones';
import { generateId } from '../utils/helpers';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [incidencias, setIncidencias] = useState(initialIncidencias);

  const updateIncidenciaEstado = useCallback((id, nuevoEstado) => {
    setIncidencias(prev => prev.map(inc => {
      if (inc.id === id) {
        const now = new Date().toISOString();
        const nuevoEvento = {
          fecha: now,
          evento: `Estado cambiado a ${nuevoEstado}`,
          descripcion: `El estado fue actualizado a "${nuevoEstado}".`,
          actor: 'Sistema',
          tipo: nuevoEstado === 'Reabierta' ? 'reapertura' : nuevoEstado === 'Resuelta' || nuevoEstado === 'Cerrada' ? 'cierre' : 'sistema',
        };
        return {
          ...inc,
          estado: nuevoEstado,
          fechaActualizacion: now,
          timeline: [...inc.timeline, nuevoEvento],
        };
      }
      return inc;
    }));
  }, []);

  const asignarProveedor = useCallback((incId, provId) => {
    setIncidencias(prev => prev.map(inc => {
      if (inc.id === incId) {
        const now = new Date().toISOString();
        const prov = proveedores.find(p => p.id === provId);
        const nuevoEvento = {
          fecha: now,
          evento: 'Proveedor asignado',
          descripcion: `Se asignó a ${prov?.nombre || provId}.`,
          actor: 'Sistema',
          tipo: 'asignacion',
        };
        return {
          ...inc,
          proveedorId: provId,
          estado: 'Asignada',
          fechaActualizacion: now,
          timeline: [...inc.timeline, nuevoEvento],
        };
      }
      return inc;
    }));
  }, []);

  const crearIncidencia = useCallback((data) => {
    const now = new Date().toISOString();
    const newInc = {
      id: generateId(),
      propiedadId: data.propiedadId,
      inquilinoId: data.inquilinoId,
      propietarioId: data.propietarioId,
      proveedorId: null,
      rubro: data.rubro,
      urgencia: data.urgencia,
      estado: 'Nueva',
      titulo: data.titulo,
      descripcion: data.descripcion,
      fechaCreacion: now,
      fechaActualizacion: now,
      presupuestoEstimado: null,
      costoFinal: null,
      notas: '',
      evidencias: data.evidencias || [],
      timeline: [
        {
          fecha: now,
          evento: 'Reclamo recibido',
          descripcion: `${data.inquilinoNombre} reportó: ${data.titulo}`,
          actor: 'Inquilino',
          tipo: 'inicio',
        },
        {
          fecha: new Date(Date.now() + 2 * 60000).toISOString(),
          evento: 'Clasificación automática',
          descripcion: `InmoDesk clasificó como ${data.rubro} - Urgencia ${data.urgencia}.`,
          actor: 'Sistema',
          tipo: 'sistema',
        },
      ],
    };
    setIncidencias(prev => [newInc, ...prev]);
    return newInc;
  }, []);

  const getPropiedad = useCallback((id) => propiedades.find(p => p.id === id), []);
  const getPropietario = useCallback((id) => propietarios.find(p => p.id === id), []);
  const getProveedor = useCallback((id) => proveedores.find(p => p.id === id), []);
  const getInquilino = useCallback((id) => inquilinos.find(i => i.id === id), []);
  const getConversacion = useCallback((incId) => conversaciones[incId] || [], []);

  const getIncidenciasPorPropiedad = useCallback((propId) =>
    incidencias.filter(i => i.propiedadId === propId), [incidencias]);

  const getIncidenciasPorPropietario = useCallback((ownerId) =>
    incidencias.filter(i => i.propietarioId === ownerId), [incidencias]);

  const getIncidenciasPorProveedor = useCallback((provId) =>
    incidencias.filter(i => i.proveedorId === provId), [incidencias]);

  const value = {
    incidencias,
    propiedades,
    propietarios,
    proveedores,
    inquilinos,
    updateIncidenciaEstado,
    asignarProveedor,
    crearIncidencia,
    getPropiedad,
    getPropietario,
    getProveedor,
    getInquilino,
    getConversacion,
    getIncidenciasPorPropiedad,
    getIncidenciasPorPropietario,
    getIncidenciasPorProveedor,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
