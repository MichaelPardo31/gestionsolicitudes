import React, { useEffect, useState, useContext } from 'react';
import { getSolicitudesByUsuario } from '../mock/api';
import { AuthContext } from '../context/AuthContext';
import { FaPaperclip, FaDownload, FaEye, FaFile, FaFilePdf, FaFileWord, FaFileImage, FaCircle, FaSearch } from 'react-icons/fa';
import styles from './SolicitudesHistorial.module.css';

const SolicitudesHistorial = () => {
  const { user } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [archivoPreview, setArchivoPreview] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busquedaRadicado, setBusquedaRadicado] = useState('');
  const [mostrandoBusqueda, setMostrandoBusqueda] = useState(false);

  const loadSolicitudes = async () => {
    if (!user || !user.email) {
      setError('Debes iniciar sesión para ver tu historial');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Usar la nueva función para obtener solicitudes del usuario (ahora es asíncrona)
      const response = await getSolicitudesByUsuario(user.email);
      if (response.success) {
        setSolicitudes(response.data);
      } else {
        setError(response.error || 'Error al cargar el historial de solicitudes');
      }
    } catch (err) {
      setError('Error al cargar el historial de solicitudes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    loadSolicitudes();
    
    // Configurar escucha de eventos de sincronización
    const handleSolicitudesUpdated = (event) => {
      console.log('Evento de sincronización recibido en SolicitudesHistorial:', event.detail);
      loadSolicitudes();
    };
    
    // Agregar escucha de eventos
    window.addEventListener('solicitudesUpdated', handleSolicitudesUpdated);
    
    // Limpiar escucha de eventos al desmontar
    return () => {
      window.removeEventListener('solicitudesUpdated', handleSolicitudesUpdated);
    };
  }, [user]);

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (tipoArchivo) => {
    if (tipoArchivo.includes('pdf')) {
      return <FaFilePdf />;
    } else if (tipoArchivo.includes('word') || tipoArchivo.includes('doc')) {
      return <FaFileWord />;
    } else if (tipoArchivo.includes('image')) {
      return <FaFileImage />;
    } else {
      return <FaFile />;
    }
  };

  // Función para mostrar la vista previa de un archivo
  const mostrarArchivoPreview = (archivo) => {
    console.log('Mostrando archivo:', archivo);
    setArchivoPreview(archivo);
  };

  // Función para cerrar la vista previa
  const cerrarArchivoPreview = (e) => {
    if (e) e.stopPropagation();
    console.log('Cerrando preview');
    setArchivoPreview(null);
  };

  // Función para descargar un archivo
  const descargarArchivo = (archivo) => {
    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = archivo.contenido;
    link.download = archivo.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Obtener el color del estado
  const getEstadoColor = (estado) => {
    switch(estado.toLowerCase()) {
      case 'pendiente': return '#3182ce'; // Azul
      case 'aprobado': case 'aprobada': return '#38a169'; // Verde
      case 'rechazado': case 'rechazada': return '#e53e3e'; // Rojo
      case 'en revisión': case 'en revision': return '#dd6b20'; // Naranja
      case 'resuelta': return '#805ad5'; // Púrpura
      default: return '#718096'; // Gris por defecto
    }
  };

  // Función para buscar por número de radicado
  const buscarPorRadicado = () => {
    if (!busquedaRadicado.trim()) {
      setMostrandoBusqueda(false);
      return;
    }
    setMostrandoBusqueda(true);
  };

  // Filtrar solicitudes por estado y/o número de radicado
  const solicitudesFiltradas = () => {
    let resultado = solicitudes;
    
    // Filtrar por estado si no es 'todos'
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(s => s.estado.toLowerCase() === filtroEstado.toLowerCase());
    }
    
    // Filtrar por número de radicado si hay búsqueda activa
    if (mostrandoBusqueda && busquedaRadicado.trim()) {
      resultado = resultado.filter(s => 
        s.numeroRadicado && s.numeroRadicado.toLowerCase().includes(busquedaRadicado.toLowerCase())
      );
    }
    
    return resultado;
  };
  
  const solicitudesMostradas = solicitudesFiltradas();

  if (loading) return <div className={styles.loadingContainer}>Cargando historial de solicitudes...</div>;
  if (error) return <div className={styles.errorContainer}>{error}</div>;

  return (
    <div className={styles.historialContainer}>
      <div className={styles.historialHeader}>
        <h2 className={styles.historialTitle}>Mi Historial de Solicitudes</h2>
        
        <div className={styles.filtrosContainer}>
          <div className={styles.busquedaContainer}>
            <input
              type="text"
              value={busquedaRadicado}
              onChange={(e) => setBusquedaRadicado(e.target.value)}
              placeholder="Buscar por número de radicado"
              className={styles.busquedaInput}
            />
            <button 
              onClick={buscarPorRadicado}
              className={styles.busquedaButton}
            >
              <FaSearch />
            </button>
            {mostrandoBusqueda && (
              <button 
                onClick={() => {
                  setBusquedaRadicado('');
                  setMostrandoBusqueda(false);
                }}
                className={styles.limpiarBusquedaButton}
              >
                Limpiar
              </button>
            )}
          </div>
          
          <div className={styles.filtroEstadoContainer}>
            <label className={styles.filtroLabel}>Filtrar por estado:</label>
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={styles.filtroSelect}
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
              <option value="resuelta">Resuelta</option>
            </select>
          </div>
        </div>
      </div>

      {solicitudesMostradas.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          {mostrandoBusqueda ? (
            <h3>No se encontraron solicitudes con el número de radicado "{busquedaRadicado}"</h3>
          ) : (
            <h3>No tienes solicitudes {filtroEstado !== 'todos' ? `con estado ${filtroEstado}` : 'registradas'}</h3>
          )}
          <p>Cuando realices solicitudes, podrás ver su estado e historial aquí.</p>
        </div>
      ) : (
        <div className={styles.solicitudesList}>
          {solicitudesMostradas.map((solicitud) => (
            <div key={solicitud.id} className={styles.solicitudCard}>
              <div className={styles.solicitudHeader}>
                <div className={styles.solicitudTipo}>{solicitud.tipo}</div>
                <div className={styles.solicitudEstado} style={{ backgroundColor: getEstadoColor(solicitud.estado) }}>
                  <FaCircle className={styles.estadoIcon} />
                  {solicitud.estado}
                </div>
              </div>
              
              {/* Número de radicado */}
              {solicitud.numeroRadicado && (
                <div className={styles.numeroRadicadoContainer}>
                  <span className={styles.radicadoLabel}>Número de radicado:</span>
                  <span className={styles.radicadoValor}>{solicitud.numeroRadicado}</span>
                </div>
              )}

              <div className={styles.solicitudFecha}>
                {new Date(solicitud.fecha).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              <div className={styles.solicitudDescripcion}>
                <h4>Descripción:</h4>
                <p>{solicitud.descripcion}</p>
              </div>

              {/* Mostrar archivos adjuntos si existen */}
              {solicitud.tieneAdjuntos && solicitud.archivosAdjuntos && solicitud.archivosAdjuntos.length > 0 && (
                <div className={styles.adjuntosContainer}>
                  <h4 className={styles.adjuntosTitle}>
                    <FaPaperclip /> Archivos adjuntos ({solicitud.archivosAdjuntos.length})
                  </h4>
                  <div className={styles.adjuntosList}>
                    {solicitud.archivosAdjuntos.map((archivo, index) => (
                      <div key={index} className={styles.adjuntoItem}>
                        <div className={styles.adjuntoInfo}>
                          {getFileIcon(archivo.tipo)}
                          <span className={styles.adjuntoNombre}>{archivo.nombre}</span>
                        </div>
                        <div className={styles.adjuntoAcciones}>
                          <button 
                            onClick={() => mostrarArchivoPreview(archivo)}
                            className={styles.adjuntoBoton}
                            title="Ver archivo"
                          >
                            <FaEye />
                          </button>
                          <button 
                            onClick={() => descargarArchivo(archivo)}
                            className={styles.adjuntoBoton}
                            title="Descargar archivo"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mostrar respuesta si existe */}
              {solicitud.respuesta && (
                <div className={styles.respuestaContainer}>
                  <h4>Respuesta:</h4>
                  <div className={styles.respuestaContent}>
                    <p>{solicitud.respuesta}</p>
                    {solicitud.fechaResolucion && (
                      <div className={styles.fechaRespuesta}>
                        Respondido el: {new Date(solicitud.fechaResolucion).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mostrar seguimiento de estado */}
              <div className={styles.seguimientoContainer}>
                <h4>Seguimiento:</h4>
                <div className={styles.timelineContainer}>
                  <div className={`${styles.timelineItem} ${styles.timelineActive}`}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>Solicitud enviada</div>
                      <div className={styles.timelineDate}>
                        {new Date(solicitud.fecha).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.timelineItem} ${solicitud.estado !== 'pendiente' ? styles.timelineActive : ''}`}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>En revisión</div>
                    </div>
                  </div>

                  <div className={`${styles.timelineItem} ${solicitud.estado === 'aprobada' || solicitud.estado === 'rechazada' || solicitud.estado === 'resuelta' ? styles.timelineActive : ''}`}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>
                        {solicitud.estado === 'aprobada' ? 'Aprobada' : 
                         solicitud.estado === 'rechazada' ? 'Rechazada' : 
                         solicitud.estado === 'resuelta' ? 'Resuelta' : 'Pendiente de resolución'}
                      </div>
                      {solicitud.fechaResolucion && (
                        <div className={styles.timelineDate}>
                          {new Date(solicitud.fechaResolucion).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para vista previa de archivos */}
      {archivoPreview && (
        <div className={styles.modalOverlay} onClick={(e) => cerrarArchivoPreview(e)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{archivoPreview.nombre}</h3>
              <button onClick={(e) => cerrarArchivoPreview(e)} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalBody}>
              {archivoPreview.tipo.includes('image') ? (
                <img 
                  src={archivoPreview.contenido} 
                  alt={archivoPreview.nombre} 
                  className={styles.previewImage} 
                />
              ) : archivoPreview.tipo.includes('pdf') ? (
                <div className={styles.pdfContainer}>
                  <iframe 
                    src={archivoPreview.contenido} 
                    title={archivoPreview.nombre}
                    className={styles.pdfViewer}
                  />
                </div>
              ) : (
                <div className={styles.noPreviewContainer}>
                  {getFileIcon(archivoPreview.tipo)}
                  <p>Vista previa no disponible para este tipo de archivo</p>
                  <button 
                    onClick={() => descargarArchivo(archivoPreview)}
                    className={styles.downloadButton}
                  >
                    <FaDownload /> Descargar archivo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesHistorial;
