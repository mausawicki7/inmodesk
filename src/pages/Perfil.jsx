import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Lock, Building2, CheckCircle } from 'lucide-react'

export default function Perfil() {
  const { usuario } = useAuth()
  const [tab, setTab] = useState('datos')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const [nombre, setNombre] = useState(usuario?.nombre || '')
  const [email] = useState(usuario?.email || '')

  const [passActual, setPassActual] = useState('')
  const [passNueva, setPassNueva] = useState('')
  const [passConfirm, setPassConfirm] = useState('')

  async function handleGuardarDatos(e) {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)
    const { error } = await supabase
      .from('usuarios')
      .update({ nombre })
      .eq('id', usuario.id)
    if (error) setError('No se pudo guardar.')
    else setSuccess('Datos actualizados correctamente.')
    setSaving(false)
  }

  async function handleCambiarPassword(e) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    if (passNueva !== passConfirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (passNueva.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: passNueva })
    if (error) setError('No se pudo cambiar la contraseña.')
    else {
      setSuccess('Contraseña actualizada correctamente.')
      setPassActual('')
      setPassNueva('')
      setPassConfirm('')
    }
    setSaving(false)
  }

  const initials = (usuario?.nombre || 'A')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mi perfil</h1>
          <p className="page-subtitle">{usuario?.inmobiliarias?.nombre}</p>
        </div>
      </div>

      <div className="perfil-layout">
        <div className="perfil-sidebar">
          <div className="perfil-avatar-wrap">
            <div className="perfil-avatar">{initials}</div>
            <div className="perfil-avatar-info">
              <span className="perfil-avatar-name">{usuario?.nombre}</span>
              <span className="perfil-avatar-role">{usuario?.rol}</span>
            </div>
          </div>

          <nav className="perfil-nav">
            <button
              className={`perfil-nav-item ${tab === 'datos' ? 'active' : ''}`}
              onClick={() => { setTab('datos'); setSuccess(null); setError(null) }}
            >
              <User size={16} /> Datos personales
            </button>
            <button
              className={`perfil-nav-item ${tab === 'password' ? 'active' : ''}`}
              onClick={() => { setTab('password'); setSuccess(null); setError(null) }}
            >
              <Lock size={16} /> Contraseña
            </button>
            <button
              className={`perfil-nav-item ${tab === 'inmobiliaria' ? 'active' : ''}`}
              onClick={() => { setTab('inmobiliaria'); setSuccess(null); setError(null) }}
            >
              <Building2 size={16} /> Inmobiliaria
            </button>
          </nav>
        </div>

        <div className="perfil-content">
          {success && (
            <div className="perfil-alert perfil-alert-success">
              <CheckCircle size={16} /> {success}
            </div>
          )}
          {error && (
            <div className="perfil-alert perfil-alert-error">
              {error}
            </div>
          )}

          {tab === 'datos' && (
            <form className="perfil-form" onSubmit={handleGuardarDatos}>
              <h2 className="perfil-form-title">Datos personales</h2>
              <div className="form-field">
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={email} disabled className="input-disabled" />
                <span className="form-hint">El email no se puede modificar.</span>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          )}

          {tab === 'password' && (
            <form className="perfil-form" onSubmit={handleCambiarPassword}>
              <h2 className="perfil-form-title">Cambiar contraseña</h2>
              <div className="form-field">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={passNueva}
                  onChange={e => setPassNueva(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="form-field">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  value={passConfirm}
                  onChange={e => setPassConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </form>
          )}

          {tab === 'inmobiliaria' && (
            <div className="perfil-form">
              <h2 className="perfil-form-title">Datos de la inmobiliaria</h2>
              <div className="perfil-info-grid">
                <div className="perfil-info-item">
                  <span className="perfil-info-label">Nombre</span>
                  <span className="perfil-info-value">{usuario?.inmobiliarias?.nombre}</span>
                </div>
                <div className="perfil-info-item">
                  <span className="perfil-info-label">Email</span>
                  <span className="perfil-info-value">{usuario?.inmobiliarias?.email}</span>
                </div>
                <div className="perfil-info-item">
                  <span className="perfil-info-label">Plan</span>
                  <span className="perfil-info-value">{usuario?.inmobiliarias?.plan}</span>
                </div>
              </div>
              <p className="form-hint">Para modificar los datos de la inmobiliaria contactá a soporte.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
