import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const tipoIcono = {
  critica: AlertTriangle,
  pendiente: Clock,
  resuelta: CheckCircle,
}

const tipoClase = {
  critica: 'notif-critica',
  pendiente: 'notif-pendiente',
  resuelta: 'notif-resuelta',
}

export default function NotificacionesDropdown({ onClose }) {
  const { incidencias } = useApp()
  const navigate = useNavigate()
  const ref = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const notificaciones = [
    ...incidencias
      .filter(i => i.urgencia === 'Crítica' && i.estado !== 'Resuelta' && i.estado !== 'Cerrada')
      .map(i => ({
        id: i.id,
        tipo: 'critica',
        titulo: `Incidencia crítica: ${i.titulo}`,
        subtitulo: i.estado,
        incidenciaId: i.id,
      })),
    ...incidencias
      .filter(i => i.estado === 'Pendiente de aprobación')
      .map(i => ({
        id: i.id + '-pend',
        tipo: 'pendiente',
        titulo: `Requiere aprobación: ${i.titulo}`,
        subtitulo: 'Pendiente de aprobación',
        incidenciaId: i.id,
      })),
    ...incidencias
      .filter(i => i.estado === 'Resuelta')
      .slice(0, 2)
      .map(i => ({
        id: i.id + '-res',
        tipo: 'resuelta',
        titulo: `Resuelta: ${i.titulo}`,
        subtitulo: 'Cerrada correctamente',
        incidenciaId: i.id,
      })),
  ].slice(0, 8)

  function handleClick(incidenciaId) {
    navigate(`/incidencias/${incidenciaId}`)
    onClose()
  }

  return (
    <div className="notif-dropdown" ref={ref}>
      <div className="notif-header">
        <span className="notif-title">Notificaciones</span>
        <button className="notif-close" onClick={onClose}><X size={16} /></button>
      </div>

      {notificaciones.length === 0 ? (
        <div className="notif-empty">No hay notificaciones pendientes</div>
      ) : (
        <ul className="notif-list">
          {notificaciones.map(n => {
            const Icono = tipoIcono[n.tipo]
            return (
              <li
                key={n.id}
                className={`notif-item ${tipoClase[n.tipo]}`}
                onClick={() => handleClick(n.incidenciaId)}
              >
                <div className="notif-icono"><Icono size={16} /></div>
                <div className="notif-body">
                  <span className="notif-item-titulo">{n.titulo}</span>
                  <span className="notif-item-sub">{n.subtitulo}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
