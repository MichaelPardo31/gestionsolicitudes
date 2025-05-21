import React, { useState, useEffect } from 'react';
import { actualizarEstado, responderSolicitud } from '../mock/api';
import { FaPaperclip, FaDownload, FaEye, FaFile, FaFilePdf, FaFileWord, FaFileImage, FaReply, FaSync, FaFilter } from 'react-icons/fa';
import styles from './AdminSolicitudesManager.module.css';

const AdminSolicitudesManager = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState({ estado: '', tipo: '' });
  const [busqueda, setBusqueda] = useState('');
  const [archivoPreview, setArchivoPreview] = useState(null);
  const [respuestaModal, setRespuestaModal] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');
  
  // Función para cargar solicitudes desde el servidor y localStorage
  const cargarSolicitudes = async () => {
    setCargando(true);
    setErrorCarga('');
    setMensajeExito('');
    
    try {
      console.log('Iniciando carga de solicitudes...');
      
      // Comenzar con un array vacío para evitar duplicados
      let solicitudesActualizadas = [];
      
      // 1. Primero cargar solicitudes desde el servidor (prioridad)
      try {
        console.log('Intentando cargar solicitudes del servidor...');
        const response = await fetch('http://localhost:5000/api/solicitudes');
        
        if (response.ok) {
          const solicitudesServidor = await response.json();
          console.log('Solicitudes obtenidas del servidor:', solicitudesServidor);
          
          // Mapear solicitudes del servidor al formato esperado por el componente
          solicitudesServidor.forEach(sol => {
            // Procesar archivos adjuntos si existen
            let archivosAdjuntos = [];
            let tieneAdjuntos = sol.tiene_adjuntos === 1;
            
            try {
              if (sol.archivos_adjuntos) {
                archivosAdjuntos = JSON.parse(sol.archivos_adjuntos);
              }
            } catch (e) {
              console.warn('Error al parsear archivos adjuntos:', e);
            }
            
            // Procesar historial de estados si existe
            let historialEstados = [];
            try {
              if (sol.historial_estados) {
                historialEstados = JSON.parse(sol.historial_estados);
              }
            } catch (e) {
              console.warn('Error al parsear historial de estados:', e);
            }
            
            // Añadir la solicitud al array con el formato esperado
            const solicitudFormateada = {
              id: sol.id,
              estudiante: sol.usuario || 'Usuario ' + sol.student_id,
              tipo: sol.tipo,
              descripcion: sol.descripcion,
              estado: sol.estado.charAt(0).toUpperCase() + sol.estado.slice(1), // Capitalizar estado
              fecha: new Date(sol.fecha).toLocaleDateString(),
              archivosAdjuntos: archivosAdjuntos,
              tieneAdjuntos: tieneAdjuntos,
              numeroRadicado: sol.numero_radicado || '',
              respuesta: sol.respuesta || null,
              historialEstados: historialEstados,
              categoria: sol.categoria || ''
            };
            solicitudesActualizadas.push(solicitudFormateada);
          });
          
          console.log(`Cargadas ${solicitudesActualizadas.length} solicitudes desde el servidor`);
        } else {
          console.error('Error al cargar solicitudes del servidor:', response.statusText);
          setErrorCarga(`Error al cargar solicitudes del servidor: ${response.statusText}`);
        }
      } catch (serverError) {
        console.error('Error al conectar con el servidor:', serverError);
        setErrorCarga(`Error al conectar con el servidor: ${serverError.message}`);
      }
      
      // 2. Si no hay solicitudes del servidor o hubo error, cargar desde localStorage
      if (solicitudesActualizadas.length === 0) {
        console.log('No se encontraron solicitudes en el servidor, usando localStorage como respaldo');
        
        const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
        console.log('Solicitudes en localStorage:', solicitudesGuardadas);
        
        solicitudesGuardadas.forEach(nuevaSolicitud => {
          // Adaptar el formato para que coincida con el esperado por el componente
          const solicitudFormateada = {
            id: nuevaSolicitud.id,
            estudiante: nuevaSolicitud.usuario || nuevaSolicitud.email || 'Usuario desconocido',
            tipo: nuevaSolicitud.tipo,
            descripcion: nuevaSolicitud.descripcion,
            estado: nuevaSolicitud.estado.charAt(0).toUpperCase() + nuevaSolicitud.estado.slice(1), // Capitalizar estado
            fecha: new Date(nuevaSolicitud.fecha).toLocaleDateString(),
            archivosAdjuntos: nuevaSolicitud.archivosAdjuntos || [],
            tieneAdjuntos: nuevaSolicitud.tieneAdjuntos || false,
            numeroRadicado: nuevaSolicitud.numeroRadicado || '',
            respuesta: nuevaSolicitud.respuesta || null,
            categoria: nuevaSolicitud.categoria || ''
          };
          solicitudesActualizadas.push(solicitudFormateada);
        });
      }
      
      // Si no hay solicitudes, mostrar mensaje informativo
      if (solicitudesActualizadas.length === 0) {
        console.log('No se encontraron solicitudes en el servidor ni en localStorage');
        setErrorCarga('No hay solicitudes PQRSF disponibles. Intente más tarde o verifique la conexión con el servidor.');
      }
      
      // Actualizar el estado con todas las solicitudes cargadas
      console.log('Total de solicitudes a mostrar:', solicitudesActualizadas.length);
      setSolicitudes(solicitudesActualizadas);
      
      // Mostrar mensaje de éxito temporal
      setMensajeExito(`Solicitudes sincronizadas correctamente. Total: ${solicitudesActualizadas.length}`);
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      console.error('Error al sincronizar solicitudes:', error);
      setErrorCarga(`Error al cargar las solicitudes: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };
  
  // Cargar solicitudes al montar el componente y configurar escucha de eventos
  useEffect(() => {
    cargarSolicitudes();
    
    // Configurar escucha de eventos de sincronización
    const handleSolicitudesUpdated = (event) => {
      console.log('Evento de sincronización recibido en AdminSolicitudesManager:', event.detail);
      cargarSolicitudes();
    };
    
    // Agregar escucha de eventos
    window.addEventListener('solicitudesUpdated', handleSolicitudesUpdated);
    
    // Limpiar escucha de eventos al desmontar
    return () => {
      window.removeEventListener('solicitudesUpdated', handleSolicitudesUpdated);
    };
  }, []);

  const filtrarSolicitudes = () => {
    console.log('Filtrando solicitudes. Total disponibles:', solicitudes.length);
    console.log('Filtros aplicados:', { filtroEstado: filtro.estado, filtroTipo: filtro.tipo, busqueda });
    
    if (!Array.isArray(solicitudes)) {
      console.error('Error: solicitudes no es un array', solicitudes);
      return [];
    }
    
    const resultado = solicitudes.filter(solicitud => {
      // Verificar que la solicitud tiene todos los campos necesarios
      if (!solicitud || typeof solicitud !== 'object') {
        console.warn('Solicitud inválida encontrada:', solicitud);
        return false;
      }
      
      // Filtro por estado
      const pasaFiltroEstado = !filtro.estado || 
        (solicitud.estado && solicitud.estado.toLowerCase() === filtro.estado.toLowerCase());
      
      // Filtro por tipo
      const pasaFiltroTipo = !filtro.tipo || 
        (solicitud.tipo && solicitud.tipo.toLowerCase() === filtro.tipo.toLowerCase());
      
      // Filtro por búsqueda de texto
      let pasaFiltroBusqueda = true;
      if (busqueda) {
        const terminoBusqueda = busqueda.toLowerCase();
        pasaFiltroBusqueda = 
          (solicitud.estudiante && solicitud.estudiante.toLowerCase().includes(terminoBusqueda)) ||
          (solicitud.descripcion && solicitud.descripcion.toLowerCase().includes(terminoBusqueda)) ||
          (solicitud.numeroRadicado && solicitud.numeroRadicado.toLowerCase().includes(terminoBusqueda));
      }
      
      return pasaFiltroEstado && pasaFiltroTipo && pasaFiltroBusqueda;
    });
    
    console.log('Resultado del filtrado:', resultado.length, 'solicitudes');
    return resultado;
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      setCargando(true);
      
      // Llamar a la API para actualizar el estado (ahora es asíncrona)
      const resultado = await actualizarEstado(
        id, 
        nuevoEstado.toLowerCase(), 
        `Estado cambiado a ${nuevoEstado.toLowerCase()} por administrador`
      );
      
      if (resultado.success) {
        // Actualizar el estado local
        setSolicitudes(solicitudes.map(solicitud => 
          solicitud.id === id ? { ...solicitud, estado: nuevoEstado } : solicitud
        ));

        // Mostrar mensaje de éxito con información sobre si se actualizó en el servidor
        const mensajeServidor = resultado.servidorActualizado 
          ? 'El cambio se ha guardado en el servidor.' 
          : 'El cambio se ha guardado localmente, pero no se pudo conectar con el servidor.';
        
        setMensajeExito(`Estado de la solicitud actualizado a: ${nuevoEstado}. ${mensajeServidor}`);
        setTimeout(() => setMensajeExito(''), 5000);
        
        // Recargar las solicitudes para asegurar sincronización
        await cargarSolicitudes();
      } else {
        console.error('Error al cambiar estado:', resultado.error);
        setErrorCarga(`Error al cambiar estado: ${resultado.error}`);
        setTimeout(() => setErrorCarga(''), 5000);
      }
    } catch (error) {
      console.error('Error inesperado al cambiar estado:', error);
      setErrorCarga(`Error inesperado al cambiar estado: ${error.message || error}`);
      setTimeout(() => setErrorCarga(''), 5000);
    } finally {
      setCargando(false);
    }
  };

  // Función para mostrar la vista previa de un archivo
  const mostrarArchivoPreview = (archivo) => {
    setArchivoPreview(archivo);
  };

  // Función para cerrar la vista previa
  const cerrarArchivoPreview = () => {
    setArchivoPreview(null);
  };

  // Abrir modal de respuesta
  const abrirModalRespuesta = (solicitud) => {
    setRespuestaModal(solicitud);
    setRespuestaTexto('');
  };

  // Cerrar modal de respuesta
  const cerrarModalRespuesta = () => {
    setRespuestaModal(null);
    setRespuestaTexto('');
  };

  // Enviar respuesta a la solicitud
  const enviarRespuesta = async () => {
    if (!respuestaModal || !respuestaTexto.trim()) return;

    setEnviandoRespuesta(true);
    
    try {
      // Llamar a la API para responder la solicitud (ahora es asíncrona)
      const resultado = await responderSolicitud(
        respuestaModal.id, 
        respuestaTexto,
        'Solicitud respondida por administrador'
      );

      if (resultado.success) {
        // Actualizar el estado local
        setSolicitudes(solicitudes.map(solicitud => 
          solicitud.id === respuestaModal.id ? { 
            ...solicitud, 
            estado: 'Resuelta',
            respuesta: respuestaTexto
          } : solicitud
        ));

        // Mostrar mensaje de éxito con información sobre si se actualizó en el servidor
        const mensajeServidor = resultado.servidorActualizado 
          ? 'La respuesta se ha guardado en el servidor.'
          : 'La respuesta se ha guardado localmente, pero no se pudo conectar con el servidor.';
        
        setMensajeExito(`Respuesta enviada correctamente. Se ha notificado al usuario. ${mensajeServidor}`);
        setTimeout(() => setMensajeExito(''), 5000);

        // Recargar las solicitudes para asegurar sincronización
        cargarSolicitudes();
        
        // Cerrar el modal
        cerrarModalRespuesta();
      } else {
        console.error('Error al enviar respuesta:', resultado.error);
      }
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    } finally {
      setEnviandoRespuesta(false);
    }
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

  const solicitudesFiltradas = filtrarSolicitudes();

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.adminHeader}>
            <div className={styles.headerTop}>
              <h2>Gestión de Solicitudes</h2>
              <button 
                className={styles.syncButton} 
                onClick={cargarSolicitudes} 
                disabled={cargando}
                title="Sincronizar solicitudes con el servidor"
              >
                <FaSync className={cargando ? styles.rotating : ''} /> 
                {cargando ? 'Sincronizando...' : 'Sincronizar'}
              </button>
            </div>
            
            {errorCarga && <div className={styles.errorMessage}>{errorCarga}</div>}
            {mensajeExito && <div className={styles.successMessage}>{mensajeExito}</div>}
            
            <div className={styles.filtros}>
              <div className={styles.filtroGrupo}>
                <label htmlFor="filtroEstado">Estado:</label>
                <select 
                  id="filtroEstado" 
                  value={filtro.estado} 
                  onChange={(e) => setFiltro({...filtro, estado: e.target.value})}
                >
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>
              
              <div className={styles.filtroGrupo}>
                <label htmlFor="filtroTipo">Tipo:</label>
                <select 
                  id="filtroTipo" 
                  value={filtro.tipo} 
                  onChange={(e) => setFiltro({...filtro, tipo: e.target.value})}
                >
                  <option value="">Todos</option>
                  <option value="Petición">Petición</option>
                  <option value="Queja">Queja</option>
                  <option value="Reclamo">Reclamo</option>
                  <option value="Sugerencia">Sugerencia</option>
                  <option value="Felicitación">Felicitación</option>
                </select>
              </div>
              
              <div className={styles.filtroGrupo}>
                <label htmlFor="busqueda">Buscar:</label>
                <input 
                  type="text" 
                  id="busqueda" 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)} 
                  placeholder="Buscar por descripción, estudiante o radicado..."
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.requestsList}>
          {solicitudesFiltradas.length > 0 ? (
            solicitudesFiltradas.map(solicitud => (
              <div key={solicitud.id} className={styles.requestCard}>
                <div className={styles.requestHeader}>
                  <h3 className={styles.studentName}>{solicitud.estudiante}</h3>
                  <span className={`${styles.requestStatus} ${
                    solicitud.estado === 'Aprobado' 
                      ? styles.statusApproved
                      : solicitud.estado === 'En Revisión'
                      ? styles.statusReview
                      : solicitud.estado === 'Pendiente'
                      ? styles.statusPending
                      : styles.statusRejected
                  }`}>
                    {solicitud.estado}
                  </span>
                </div>

                <div className={styles.requestMeta}>
                  <span className={styles.requestType}>{solicitud.tipo}</span>
                  <span className={styles.requestDate}>{solicitud.fecha}</span>
                </div>

                <p className={styles.requestDescription}>{solicitud.descripcion}</p>

                {/* Mostrar archivos adjuntos si existen */}
                {solicitud.tieneAdjuntos && solicitud.archivosAdjuntos && solicitud.archivosAdjuntos.length > 0 && (
                  <div className={styles.adjuntosContainer}>
                    <div className={styles.adjuntosHeader}>
                      <FaPaperclip /> <span>Archivos adjuntos ({solicitud.archivosAdjuntos.length})</span>
                    </div>
                    <div className={styles.adjuntosList}>
                      {solicitud.archivosAdjuntos.map((archivo, index) => (
                        <div key={index} className={styles.adjuntoItem}>
                          <div className={styles.adjuntoInfo}>
                            {getFileIcon(archivo.tipo)}
                            <span className={styles.adjuntoNombre}>{archivo.nombre}</span>
                            <span className={styles.adjuntoTamano}>
                              {(archivo.tamaño / 1024).toFixed(1)} KB
                            </span>
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

                <div className={styles.requestActions}>
                  <button 
                    onClick={() => cambiarEstado(solicitud.id, 'Aprobado')}
                    className={`${styles.actionButton} ${styles.approveButton}`}
                  >
                    <span>Aprobar</span>
                  </button>
                  <button 
                    onClick={() => cambiarEstado(solicitud.id, 'Rechazado')}
                    className={`${styles.actionButton} ${styles.rejectButton}`}
                  >
                    <span>Rechazar</span>
                  </button>
                  <button 
                    onClick={() => abrirModalRespuesta(solicitud)}
                    className={`${styles.actionButton} ${styles.replyButton}`}
                  >
                    <FaReply /> <span>Responder</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📭</div>
              <h3>No se encontraron solicitudes</h3>
              <p>Intenta con otros criterios de búsqueda</p>
            </div>
          )}
        </div>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div className={styles.mensajeExito}>
            {mensajeExito}
          </div>
        )}

        {/* Modal para vista previa de archivos */}
        {archivoPreview && (
          <div className={styles.modalOverlay} onClick={cerrarArchivoPreview}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{archivoPreview.nombre}</h3>
                <button onClick={cerrarArchivoPreview} className={styles.closeButton}>×</button>
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

        {/* Modal para responder solicitud */}
        {respuestaModal && (
          <div className={styles.modalOverlay} onClick={cerrarModalRespuesta}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Responder Solicitud</h3>
                <button onClick={cerrarModalRespuesta} className={styles.closeButton}>×</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.solicitudInfo}>
                  <p><strong>Estudiante:</strong> {respuestaModal.estudiante}</p>
                  <p><strong>Tipo:</strong> {respuestaModal.tipo}</p>
                  <p><strong>Descripción:</strong> {respuestaModal.descripcion}</p>
                </div>
                
                <div className={styles.respuestaForm}>
                  <label htmlFor="respuesta" className={styles.respuestaLabel}>
                    Escriba su respuesta:
                  </label>
                  <textarea
                    id="respuesta"
                    value={respuestaTexto}
                    onChange={(e) => setRespuestaTexto(e.target.value)}
                    className={styles.respuestaTextarea}
                    placeholder="Escriba aquí su respuesta para el estudiante..."
                    rows={5}
                    disabled={enviandoRespuesta}
                  />
                </div>
                
                <div className={styles.modalFooter}>
                  <button
                    onClick={cerrarModalRespuesta}
                    className={styles.cancelarButton}
                    disabled={enviandoRespuesta}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={enviarRespuesta}
                    className={styles.enviarRespuestaButton}
                    disabled={!respuestaTexto.trim() || enviandoRespuesta}
                  >
                    {enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSolicitudesManager;