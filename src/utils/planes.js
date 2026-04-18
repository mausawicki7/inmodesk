export const PLANES = {
  Básico: {
    nombre: 'Básico',
    precio: 95000,
    propiedadesMax: 15,
    descripcion: 'Para inmobiliarias que están comenzando',
    features: ['Hasta 15 propiedades', 'Gestión de incidencias', 'Directorio de proveedores', 'Soporte por email'],
  },
  Pro: {
    nombre: 'Pro',
    precio: 220000,
    propiedadesMax: 60,
    descripcion: 'Para inmobiliarias en crecimiento',
    features: ['Hasta 60 propiedades', 'Todo lo del plan Básico', 'Historial completo de proveedores', 'Reportes avanzados', 'Soporte prioritario'],
  },
  Enterprise: {
    nombre: 'Enterprise',
    precio: 560000,
    propiedadesMax: Infinity,
    descripcion: 'Para grandes carteras sin límites',
    features: ['Propiedades ilimitadas', 'Todo lo del plan Pro', 'Usuarios ilimitados', 'Soporte dedicado', 'Onboarding personalizado'],
  },
};

export const NOMBRES_PLANES = Object.keys(PLANES);

export function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(precio);
}
