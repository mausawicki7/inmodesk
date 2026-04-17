import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Timeline from '../components/common/Timeline';
import {
  FileText, Mic, Camera, Video, Zap, CheckCircle2,
  ArrowRight, Building2, User, AlertTriangle
} from 'lucide-react';

const TIPOS_ENTRADA = [
  { id: 'texto', icon: FileText, label: 'Mensaje de texto', desc: 'El inquilino describe el problema por escrito' },
  { id: 'audio', icon: Mic, label: 'Audio transcripto', desc: 'Audio de WhatsApp convertido a texto' },
  { id: 'foto', icon: Camera, label: 'Foto', desc: 'Imagen del problema reportado' },
  { id: 'video', icon: Video, label: 'Video', desc: 'Video mostrando el problema' },
];

const RUBROS = ['Plomería', 'Electricidad', 'Gas', 'Cerrajería', 'Albañilería', 'Aire acondicionado', 'Pintura', 'General'];
const URGENCIAS = ['Baja', 'Media', 'Alta', 'Crítica'];

export default function SimularReclamo() {
  const navigate = useNavigate();
  const { propiedades, getInquilino, getPropietario, crearIncidencia } = useApp();

  const [step, setStep] = useState(1);
  const [tipoEntrada, setTipoEntrada] = useState('texto');
  const [propiedadId, setPropiedadId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [rubro, setRubro] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [resultado, setResultado] = useState(null);

  const propSeleccionada = propiedades.find(p => p.id === propiedadId);
  const inquilino = propSeleccionada ? getInquilino(propSeleccionada.inquilinoId) : null;
  const propietario = propSeleccionada ? getPropietario(propSeleccionada.propietarioId) : null;

  const canProceed = () => {
    if (step === 1) return !!tipoEntrada;
    if (step === 2) return !!propiedadId;
    if (step === 3) return descripcion.trim().length > 10;
    if (step === 4) return !!rubro && !!urgencia;
    return false;
  };

  const generarTitulo = () => {
    const titulos = {
      'Plomería': ['Pérdida de agua', 'Caño roto', 'Canilla que gotea', 'Desagüe tapado'],
      'Electricidad': ['Corte eléctrico', 'Enchufe no funciona', 'Luz que parpadea', 'Térmica que salta'],
      'Gas': ['Pérdida de gas', 'Calefactor no enciende', 'Calefón sin funcionar', 'Termotanque no enciende'],
      'Cerrajería': ['Cerradura rota', 'Llave trabada', 'Puerta no cierra', 'Cerrojo dañado'],
      'Albañilería': ['Humedad en pared', 'Grieta en techo', 'Pared descascarada', 'Filtración de agua'],
      'Aire acondicionado': ['Aire no enfría', 'Split pierde agua', 'Aire hace ruido', 'No enciende el aire'],
      'Pintura': ['Pintura descascarada', 'Manchas en pared', 'Techo con humedad', 'Pintura deteriorada'],
      'General': ['Persiana trabada', 'Puerta que no cierra', 'Ventana rota', 'Problema general'],
    };
    const opciones = titulos[rubro] || titulos['General'];
    return opciones[Math.floor(Math.random() * opciones.length)];
  };

  const handleSubmit = () => {
    const titulo = generarTitulo();
    const nuevaIncidencia = crearIncidencia({
      propiedadId,
      inquilinoId: propSeleccionada.inquilinoId,
      propietarioId: propSeleccionada.propietarioId,
      rubro,
      urgencia,
      titulo,
      descripcion,
      inquilinoNombre: inquilino?.nombre || 'Inquilino',
      evidencias: tipoEntrada === 'foto' ? ['foto_reclamo.jpg'] : tipoEntrada === 'video' ? ['video_reclamo.mp4'] : [],
    });
    setResultado(nuevaIncidencia);
    setStep(5);
  };

  return (
    <div className="simular-page">
      <div className="page-header">
        <h1 className="page-title">Simular Ingreso de Reclamo</h1>
        <p className="page-subtitle">Creá una incidencia de prueba para demostrar el flujo del producto</p>
      </div>

      <div className="stepper">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className={`step ${step === s ? 'step-active' : step > s ? 'step-done' : ''}`}>
            <div className="step-number">{step > s ? '✓' : s}</div>
            <span className="step-label">
              {s === 1 ? 'Tipo' : s === 2 ? 'Propiedad' : s === 3 ? 'Descripción' : s === 4 ? 'Clasificar' : 'Resultado'}
            </span>
          </div>
        ))}
      </div>

      <div className="simular-content">
        {step === 1 && (
          <Card title="¿Cómo ingresa el reclamo?" className="simular-card">
            <div className="tipo-grid">
              {TIPOS_ENTRADA.map(tipo => (
                <div
                  key={tipo.id}
                  className={`tipo-option ${tipoEntrada === tipo.id ? 'tipo-selected' : ''}`}
                  onClick={() => setTipoEntrada(tipo.id)}
                >
                  <tipo.icon size={24} />
                  <strong>{tipo.label}</strong>
                  <span>{tipo.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card title="Seleccioná la propiedad" className="simular-card">
            <div className="propiedad-options">
              {propiedades.map(p => {
                const inq = getInquilino(p.inquilinoId);
                return (
                  <div
                    key={p.id}
                    className={`propiedad-option ${propiedadId === p.id ? 'option-selected' : ''}`}
                    onClick={() => setPropiedadId(p.id)}
                  >
                    <Building2 size={18} />
                    <div>
                      <strong>{p.direccion}, {p.unidad}</strong>
                      <span>{p.barrio} · Inquilino: {inq?.nombre || '—'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card title="Descripción del reclamo" className="simular-card">
            {inquilino && (
              <div className="reclamo-from">
                <User size={16} />
                <span>Reportado por: <strong>{inquilino.nombre}</strong></span>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">
                {tipoEntrada === 'texto' ? 'Mensaje del inquilino:' :
                 tipoEntrada === 'audio' ? 'Transcripción del audio:' :
                 'Descripción del problema:'}
              </label>
              <textarea
                className="form-textarea"
                rows={5}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Ej: Hola, tengo una pérdida de agua debajo de la pileta de la cocina. Está goteando bastante y puse un balde..."
              />
            </div>
            {(tipoEntrada === 'foto' || tipoEntrada === 'video') && (
              <div className="media-preview">
                <div className="media-placeholder-large">
                  {tipoEntrada === 'foto' ? <Camera size={32} /> : <Video size={32} />}
                  <span>{tipoEntrada === 'foto' ? 'foto_reclamo.jpg' : 'video_reclamo.mp4'}</span>
                  <small>Archivo adjunto simulado</small>
                </div>
              </div>
            )}
          </Card>
        )}

        {step === 4 && (
          <Card title="Clasificación del reclamo" className="simular-card">
            <div className="classification-section">
              <div className="ai-badge">
                <Zap size={16} /> Clasificación automática por InmoDesk AI
              </div>

              <div className="form-group">
                <label className="form-label">Rubro detectado:</label>
                <div className="rubro-options">
                  {RUBROS.map(r => (
                    <button
                      key={r}
                      className={`rubro-btn ${rubro === r ? 'rubro-btn-active' : ''}`}
                      onClick={() => setRubro(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Urgencia estimada:</label>
                <div className="urgencia-options">
                  {URGENCIAS.map(u => (
                    <button
                      key={u}
                      className={`urgencia-btn urgencia-btn-${u.toLowerCase()} ${urgencia === u ? 'urgencia-btn-active' : ''}`}
                      onClick={() => setUrgencia(u)}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {step === 5 && resultado && (
          <div className="resultado-section">
            <Card className="resultado-card">
              <div className="resultado-header">
                <CheckCircle2 size={48} className="resultado-icon" />
                <h2>¡Incidencia creada exitosamente!</h2>
                <p>La incidencia <strong>{resultado.id}</strong> fue generada y clasificada automáticamente.</p>
              </div>

              <div className="resultado-summary">
                <div className="resultado-item">
                  <span className="resultado-label">ID</span>
                  <span className="resultado-value">{resultado.id}</span>
                </div>
                <div className="resultado-item">
                  <span className="resultado-label">Título</span>
                  <span className="resultado-value">{resultado.titulo}</span>
                </div>
                <div className="resultado-item">
                  <span className="resultado-label">Rubro</span>
                  <span className="resultado-value">{resultado.rubro}</span>
                </div>
                <div className="resultado-item">
                  <span className="resultado-label">Urgencia</span>
                  <span className="resultado-value">{resultado.urgencia}</span>
                </div>
                <div className="resultado-item">
                  <span className="resultado-label">Estado</span>
                  <span className="resultado-value">{resultado.estado}</span>
                </div>
              </div>

              <Card title="Timeline Inicial" className="resultado-timeline">
                <Timeline events={resultado.timeline} />
              </Card>

              <div className="resultado-actions">
                <button className="btn btn-primary" onClick={() => navigate(`/incidencias/${resultado.id}`)}>
                  Ver incidencia <ArrowRight size={16} />
                </button>
                <button className="btn btn-outline" onClick={() => { setStep(1); setResultado(null); setDescripcion(''); setPropiedadId(''); setRubro(''); setUrgencia(''); }}>
                  Simular otro reclamo
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {step < 5 && (
        <div className="simular-navigation">
          {step > 1 && (
            <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              ← Anterior
            </button>
          )}
          <div className="nav-spacer" />
          {step < 4 ? (
            <button className="btn btn-primary" disabled={!canProceed()} onClick={() => setStep(step + 1)}>
              Siguiente →
            </button>
          ) : (
            <button className="btn btn-success" disabled={!canProceed()} onClick={handleSubmit}>
              <Zap size={16} /> Generar Incidencia
            </button>
          )}
        </div>
      )}
    </div>
  );
}
