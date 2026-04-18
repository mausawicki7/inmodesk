import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: es });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return dateStr;
  }
};

export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: es });
  } catch {
    return dateStr;
  }
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const estadoConfig = {
  'Nueva': { color: '#14181f', bg: '#ebe3d2', label: 'Nueva' },
  'Pendiente de aprobación': { color: '#8a6414', bg: '#f2e4c2', label: 'Pendiente' },
  'Aprobada': { color: '#606a3a', bg: '#e5e5cd', label: 'Aprobada' },
  'Asignada': { color: '#3c6b85', bg: '#d9e6ed', label: 'Asignada' },
  'En curso': { color: '#3c6b85', bg: '#d9e6ed', label: 'En curso' },
  'Resuelta': { color: '#424a25', bg: '#e5e5cd', label: 'Resuelta' },
  'Cerrada': { color: '#7b8192', bg: '#ebe3d2', label: 'Cerrada' },
  'Reabierta': { color: '#a8321b', bg: '#f3d2c5', label: 'Reabierta' },
};

export const urgenciaConfig = {
  'Baja': { color: '#7b8192', bg: '#ebe3d2', icon: '○' },
  'Media': { color: '#8a6414', bg: '#f2e4c2', icon: '◐' },
  'Alta': { color: '#c4563a', bg: '#f5dccf', icon: '●' },
  'Crítica': { color: '#a8321b', bg: '#f3d2c5', icon: '◆' },
};

export const rubroConfig = {
  'Plomería': { icon: '🔧', color: '#3c6b85' },
  'Electricidad': { icon: '⚡', color: '#b8892e' },
  'Gas': { icon: '🔥', color: '#a8321b' },
  'Cerrajería': { icon: '🔑', color: '#606a3a' },
  'Albañilería': { icon: '🧱', color: '#c4563a' },
  'Aire acondicionado': { icon: '❄️', color: '#5a7a90' },
  'Pintura': { icon: '🎨', color: '#9a3b22' },
  'General': { icon: '🔩', color: '#4a5162' },
};

export const timelineIconConfig = {
  'inicio': { icon: '📩', color: '#14181f' },
  'sistema': { icon: '🤖', color: '#3c6b85' },
  'aprobacion': { icon: '✅', color: '#606a3a' },
  'consulta': { icon: '💬', color: '#b8892e' },
  'asignacion': { icon: '👷', color: '#c4563a' },
  'visita': { icon: '🏠', color: '#3c6b85' },
  'trabajo': { icon: '🔨', color: '#9a3b22' },
  'cierre': { icon: '🎉', color: '#606a3a' },
  'reapertura': { icon: '🔄', color: '#a8321b' },
};

export const generateId = () => crypto.randomUUID();
