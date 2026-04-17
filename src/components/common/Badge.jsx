import { estadoConfig, urgenciaConfig } from '../../utils/helpers';

export default function Badge({ tipo, valor, size = 'normal' }) {
  const config = tipo === 'estado' ? estadoConfig[valor] : urgenciaConfig[valor];
  if (!config) return <span className="badge">{valor}</span>;

  return (
    <span
      className={`badge badge-${size}`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: `${config.color}30`,
      }}
    >
      {tipo === 'urgencia' && config.icon && <span className="badge-icon">{config.icon}</span>}
      {tipo === 'estado' ? valor : valor}
    </span>
  );
}
