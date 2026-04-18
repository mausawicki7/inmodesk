import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { generateId } from '../utils/helpers';

const AppContext = createContext();

// --- mappers snake_case → camelCase ---

function mapIncidencia(row) {
  return {
    id: row.id,
    codigo: `INC-${String(row.numero).padStart(4, '0')}`,
    propiedadId: row.propiedad_id,
    inquilinoId: row.inquilino_id,
    propietarioId: row.propietario_id,
    proveedorId: row.proveedor_id,
    rubro: row.rubro,
    urgencia: row.urgencia,
    estado: row.estado,
    titulo: row.titulo,
    descripcion: row.descripcion,
    fechaCreacion: row.fecha_creacion,
    fechaActualizacion: row.fecha_actualizacion,
    presupuestoEstimado: row.presupuesto_estimado,
    costoFinal: row.costo_final,
    notas: row.notas || '',
    evidencias: row.evidencias || [],
    timeline: row.timeline || [],
    conversacion: row.conversacion || [],
  };
}

function mapPropiedad(row) {
  return {
    id: row.id,
    direccion: row.direccion,
    unidad: row.unidad,
    tipo: row.tipo,
    barrio: row.barrio,
    ciudad: row.ciudad,
    propietarioId: row.propietario_id,
    inquilinoId: row.inquilino_id,
    ambientes: row.ambientes,
    metros: row.metros,
    alquilerMensual: row.alquiler_mensual,
    estadoContrato: row.estado_contrato,
    fechaInicioContrato: row.fecha_inicio_contrato,
    fechaFinContrato: row.fecha_fin_contrato,
  };
}

function mapPropietario(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    email: row.email,
    dni: row.dni,
    cuit: row.cuit,
  };
}

function mapInquilino(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    email: row.email,
    dni: row.dni,
    propiedadId: row.propiedad_id,
  };
}

function mapProveedor(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    rubro: row.rubro,
    zona: row.zona,
    telefono: row.telefono,
    email: row.email,
    estado: row.estado,
    tiempoPromedioRespuesta: row.tiempo_promedio_respuesta,
    rating: row.rating,
    totalTrabajos: row.total_trabajos,
    historial: row.historial || [],
    dni: row.dni,
    cuit: row.cuit,
    condicionFiscal: row.condicion_fiscal,
    esGlobal: row.inmobiliaria_id === null,
  };
}

// inquilino_id se deriva de propiedades; lo dejamos null y lo resolvemos por join
function enrichInquilinos(inquilinos, propiedades) {
  const propByInquilino = {};
  propiedades.forEach(p => { if (p.inquilinoId) propByInquilino[p.inquilinoId] = p.id; });
  return inquilinos.map(i => ({ ...i, propiedadId: propByInquilino[i.id] || null }));
}

export function AppProvider({ children }) {
  const { usuario, isSuper } = useAuth();
  const inmobiliariaId = usuario?.inmobiliaria_id;

  const [incidencias, setIncidencias] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!inmobiliariaId && !isSuper) return;
    loadAll();
  }, [inmobiliariaId, isSuper]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      if (isSuper) {
        // Superadmin: carga todos los proveedores, sin datos de inmobiliaria específica
        const { data, error } = await supabase.from('proveedores').select('*').order('nombre');
        if (error) throw error;
        setProveedores(data.map(mapProveedor));
      } else {
        const [incRes, propRes, ownerRes, inqRes, provRes] = await Promise.all([
          supabase.from('incidencias').select('*').eq('inmobiliaria_id', inmobiliariaId).order('fecha_creacion', { ascending: false }),
          supabase.from('propiedades').select('*').eq('inmobiliaria_id', inmobiliariaId),
          supabase.from('propietarios').select('*').eq('inmobiliaria_id', inmobiliariaId),
          supabase.from('inquilinos').select('*').eq('inmobiliaria_id', inmobiliariaId),
          supabase.from('proveedores').select('*').or(`inmobiliaria_id.eq.${inmobiliariaId},inmobiliaria_id.is.null`),
        ]);

        for (const res of [incRes, propRes, ownerRes, inqRes, provRes]) {
          if (res.error) throw res.error;
        }

        const mappedProps = propRes.data.map(mapPropiedad);
        setIncidencias(incRes.data.map(mapIncidencia));
        setPropiedades(mappedProps);
        setPropietarios(ownerRes.data.map(mapPropietario));
        setInquilinos(enrichInquilinos(inqRes.data.map(mapInquilino), mappedProps));
        setProveedores(provRes.data.map(mapProveedor));
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateIncidenciaEstado = useCallback(async (id, nuevoEstado) => {
    const now = new Date().toISOString();
    const inc = incidencias.find(i => i.id === id);
    if (!inc) return;

    const nuevoEvento = {
      fecha: now,
      evento: `Estado cambiado a ${nuevoEstado}`,
      descripcion: `El estado fue actualizado a "${nuevoEstado}".`,
      actor: 'Sistema',
      tipo: nuevoEstado === 'Reabierta' ? 'reapertura'
          : nuevoEstado === 'Resuelta' || nuevoEstado === 'Cerrada' ? 'cierre'
          : 'sistema',
    };

    setIncidencias(prev => prev.map(i => {
      if (i.id !== id) return i;
      return { ...i, estado: nuevoEstado, fechaActualizacion: now, timeline: [...i.timeline, nuevoEvento] };
    }));

    const { error } = await supabase.from('incidencias').update({
      estado: nuevoEstado,
      fecha_actualizacion: now,
      timeline: [...inc.timeline, nuevoEvento],
    }).eq('id', id);

    if (error) {
      console.error('Error actualizando estado:', error);
      loadAll();
      return;
    }

    // Al resolver, actualizar historial del proveedor
    if ((nuevoEstado === 'Resuelta' || nuevoEstado === 'Cerrada') && inc.proveedorId) {
      const prov = proveedores.find(p => p.id === inc.proveedorId);
      if (prov) {
        const propiedad = propiedades.find(p => p.id === inc.propiedadId);
        const nuevoTrabajo = {
          fecha: now.split('T')[0],
          trabajo: inc.titulo,
          propiedad: propiedad ? `${propiedad.direccion}, ${propiedad.unidad}` : '—',
          resultado: nuevoEstado,
        };
        const historialActualizado = [...(prov.historial || []), nuevoTrabajo];
        const totalActualizado = (prov.totalTrabajos || 0) + 1;

        setProveedores(prev => prev.map(p =>
          p.id === prov.id
            ? { ...p, historial: historialActualizado, totalTrabajos: totalActualizado }
            : p
        ));

        await supabase.from('proveedores').update({
          historial: historialActualizado,
          total_trabajos: totalActualizado,
        }).eq('id', prov.id);
      }
    }
  }, [incidencias, proveedores, propiedades]);

  const asignarProveedor = useCallback(async (incId, provId) => {
    const now = new Date().toISOString();
    const prov = proveedores.find(p => p.id === provId);
    const nuevoEvento = {
      fecha: now,
      evento: 'Proveedor asignado',
      descripcion: `Se asignó a ${prov?.nombre || provId}.`,
      actor: 'Sistema',
      tipo: 'asignacion',
    };

    setIncidencias(prev => prev.map(inc => {
      if (inc.id !== incId) return inc;
      return { ...inc, proveedorId: provId, estado: 'Asignada', fechaActualizacion: now, timeline: [...inc.timeline, nuevoEvento] };
    }));

    const inc = incidencias.find(i => i.id === incId);
    if (!inc) return;

    const { error } = await supabase.from('incidencias').update({
      proveedor_id: provId,
      estado: 'Asignada',
      fecha_actualizacion: now,
      timeline: [...inc.timeline, nuevoEvento],
    }).eq('id', incId);

    if (error) {
      console.error('Error asignando proveedor:', error);
      loadAll();
    }
  }, [incidencias, proveedores]);

  const crearIncidencia = useCallback(async (data) => {
    const now = new Date().toISOString();
    const newInc = {
      id: generateId(),
      propiedad_id: data.propiedadId,
      inquilino_id: data.inquilinoId,
      propietario_id: data.propietarioId,
      proveedor_id: null,
      rubro: data.rubro,
      urgencia: data.urgencia,
      estado: 'Nueva',
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha_creacion: now,
      fecha_actualizacion: now,
      presupuesto_estimado: null,
      costo_final: null,
      notas: '',
      evidencias: data.evidencias || [],
      timeline: [
        { fecha: now, evento: 'Reclamo recibido', descripcion: `${data.inquilinoNombre} reportó: ${data.titulo}`, actor: 'Inquilino', tipo: 'inicio' },
        { fecha: new Date(Date.now() + 2 * 60000).toISOString(), evento: 'Clasificación automática', descripcion: `InmoDesk clasificó como ${data.rubro} - Urgencia ${data.urgencia}.`, actor: 'Sistema', tipo: 'sistema' },
      ],
      inmobiliaria_id: inmobiliariaId,
    };

    const { data: inserted, error } = await supabase.from('incidencias').insert(newInc).select().single();
    if (error) {
      console.error('Error creando incidencia:', error);
      return null;
    }

    const mapped = mapIncidencia(inserted);
    setIncidencias(prev => [mapped, ...prev]);
    return mapped;
  }, [inmobiliariaId]);

  const crearPropietario = useCallback(async (data) => {
    const row = {
      id: crypto.randomUUID(),
      nombre: data.nombre,
      telefono: data.telefono || null,
      email: data.email || null,
      dni: data.dni || null,
      cuit: data.cuit || null,
      inmobiliaria_id: inmobiliariaId,
    };
    const { data: inserted, error } = await supabase.from('propietarios').insert(row).select().single();
    if (error) { console.error('Error creando propietario:', error); return null; }
    const mapped = mapPropietario(inserted);
    setPropietarios(prev => [...prev, mapped]);
    return mapped;
  }, [inmobiliariaId]);

  const crearInquilino = useCallback(async (data) => {
    const row = {
      id: crypto.randomUUID(),
      nombre: data.nombre,
      telefono: data.telefono || null,
      email: data.email || null,
      dni: data.dni || null,
      inmobiliaria_id: inmobiliariaId,
    };
    const { data: inserted, error } = await supabase.from('inquilinos').insert(row).select().single();
    if (error) { console.error('Error creando inquilino:', error); return null; }
    const mapped = mapInquilino(inserted);
    setInquilinos(prev => [...prev, mapped]);
    return mapped;
  }, [inmobiliariaId]);

  const editarPropietario = useCallback(async (id, data) => {
    const changes = {
      nombre: data.nombre,
      telefono: data.telefono || null,
      email: data.email || null,
      dni: data.dni || null,
      cuit: data.cuit || null,
    };
    const { error } = await supabase.from('propietarios').update(changes).eq('id', id);
    if (error) { console.error('Error editando propietario:', error); return false; }
    setPropietarios(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
    return true;
  }, []);

  const crearProveedor = useCallback(async (data) => {
    const row = {
      id: crypto.randomUUID(),
      nombre: data.nombre,
      rubro: data.rubro || null,
      zona: data.zona || null,
      telefono: data.telefono || null,
      email: data.email || null,
      estado: data.estado || 'Activo',
      tiempo_promedio_respuesta: data.tiempoPromedioRespuesta || null,
      rating: data.rating ? Number(data.rating) : null,
      total_trabajos: 0,
      historial: [],
      dni: data.dni || null,
      cuit: data.cuit || null,
      condicion_fiscal: data.condicionFiscal || null,
      inmobiliaria_id: data.esGlobal ? null : inmobiliariaId,
    };
    const { data: inserted, error } = await supabase.from('proveedores').insert(row).select().single();
    if (error) { console.error('Error creando proveedor:', error); return null; }
    const mapped = mapProveedor(inserted);
    setProveedores(prev => [...prev, mapped]);
    return mapped;
  }, [inmobiliariaId]);

  const editarProveedor = useCallback(async (id, data) => {
    const changes = {
      nombre: data.nombre,
      rubro: data.rubro || null,
      zona: data.zona || null,
      telefono: data.telefono || null,
      email: data.email || null,
      estado: data.estado || 'Activo',
      tiempo_promedio_respuesta: data.tiempoPromedioRespuesta || null,
      rating: data.rating ? Number(data.rating) : null,
      dni: data.dni || null,
      cuit: data.cuit || null,
      condicion_fiscal: data.condicionFiscal || null,
    };
    const { error } = await supabase.from('proveedores').update(changes).eq('id', id);
    if (error) { console.error('Error editando proveedor:', error); return false; }
    setProveedores(prev => prev.map(p => p.id === id ? { ...p, ...mapProveedor({ ...changes, id, inmobiliaria_id: inmobiliariaId, total_trabajos: p.totalTrabajos, historial: p.historial }) } : p));
    return true;
  }, [inmobiliariaId]);

  const copiarProveedorGlobal = useCallback(async (provId) => {
    const prov = proveedores.find(p => p.id === provId);
    if (!prov) return null;
    return crearProveedor({
      nombre: prov.nombre, rubro: prov.rubro, zona: prov.zona,
      telefono: prov.telefono, email: prov.email, estado: prov.estado,
      tiempoPromedioRespuesta: prov.tiempoPromedioRespuesta,
      rating: prov.rating, dni: prov.dni, cuit: prov.cuit,
      condicionFiscal: prov.condicionFiscal,
    });
  }, [proveedores, crearProveedor]);

  const editarPropiedad = useCallback(async (id, data) => {
    const changes = {
      direccion: data.direccion,
      unidad: data.unidad || null,
      tipo: data.tipo || null,
      barrio: data.barrio || null,
      ciudad: data.ciudad || null,
      propietario_id: data.propietarioId || null,
      ambientes: data.ambientes ? Number(data.ambientes) : null,
      metros: data.metros ? Number(data.metros) : null,
      alquiler_mensual: data.alquilerMensual ? Number(data.alquilerMensual) : null,
      estado_contrato: data.estadoContrato || null,
      fecha_inicio_contrato: data.fechaInicioContrato || null,
      fecha_fin_contrato: data.fechaFinContrato || null,
    };
    const { error } = await supabase.from('propiedades').update(changes).eq('id', id);
    if (error) { console.error('Error editando propiedad:', error); return false; }
    setPropiedades(prev => prev.map(p => p.id === id ? { ...p, ...mapPropiedad({ id, inmobiliaria_id: inmobiliariaId, inquilino_id: p.inquilinoId, ...changes }) } : p));
    return true;
  }, [inmobiliariaId]);

  const crearPropiedad = useCallback(async (data) => {
    const row = {
      id: crypto.randomUUID(),
      direccion: data.direccion,
      unidad: data.unidad || null,
      tipo: data.tipo || null,
      barrio: data.barrio || null,
      ciudad: data.ciudad || null,
      propietario_id: data.propietarioId || null,
      inquilino_id: data.inquilinoId || null,
      ambientes: data.ambientes ? Number(data.ambientes) : null,
      metros: data.metros ? Number(data.metros) : null,
      alquiler_mensual: data.alquilerMensual ? Number(data.alquilerMensual) : null,
      estado_contrato: data.estadoContrato || 'Vigente',
      fecha_inicio_contrato: data.fechaInicioContrato || null,
      fecha_fin_contrato: data.fechaFinContrato || null,
      inmobiliaria_id: inmobiliariaId,
    };
    const { data: inserted, error } = await supabase.from('propiedades').insert(row).select().single();
    if (error) { console.error('Error creando propiedad:', error); return null; }
    const mapped = mapPropiedad(inserted);
    setPropiedades(prev => [...prev, mapped]);
    return mapped;
  }, [inmobiliariaId]);

  const getPropiedad = useCallback((id) => propiedades.find(p => p.id === id), [propiedades]);
  const getPropietario = useCallback((id) => propietarios.find(p => p.id === id), [propietarios]);
  const getProveedor = useCallback((id) => proveedores.find(p => p.id === id), [proveedores]);
  const getInquilino = useCallback((id) => inquilinos.find(i => i.id === id), [inquilinos]);

  const getConversacion = useCallback((incId) => {
    const inc = incidencias.find(i => i.id === incId);
    return inc?.conversacion || [];
  }, [incidencias]);

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
    loading,
    error,
    isSuper,
    updateIncidenciaEstado,
    asignarProveedor,
    crearIncidencia,
    crearPropietario,
    editarPropietario,
    crearProveedor,
    editarProveedor,
    copiarProveedorGlobal,
    crearInquilino,
    crearPropiedad,
    editarPropiedad,
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
