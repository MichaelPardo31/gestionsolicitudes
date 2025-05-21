import React, { useState, useEffect } from 'react';
import { actualizarEstado, responderSolicitud } from '../mock/api';
import { obtenerRespuestasAutomaticas, obtenerTiposSolicitudes } from '../mock/respuestasAutomaticas';
import { FaPaperclip, FaDownload, FaEye, FaFile, FaFilePdf, FaFileWord, FaFileImage, FaReply, FaSync, FaFilter, FaLightbulb } from 'react-icons/fa';
import styles from './AdminPQRSFManager.module.css';

const AdminPQRSFManager = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState({ estado: '', tipo: '', categoria: '' });
  const [busqueda, setBusqueda] = useState('');
  const [archivoPreview, setArchivoPreview] = useState(null);
  const [respuestaModal, setRespuestaModal] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');
  
  // Estado para almacenar las respuestas rápidas cargadas dinámicamente del mock
  const [respuestasRapidas, setRespuestasRapidas] = useState([]);
  
  // Cargar respuestas rápidas desde el mock
  useEffect(() => {
    // Obtener todos los tipos de solicitudes disponibles en el mock
    const tiposSolicitudes = obtenerTiposSolicitudes();
    
    // Crear array para almacenar todas las respuestas rápidas
    const todasRespuestas = [];
    let idCounter = 1;
    
    // Por cada tipo de solicitud, obtener sus respuestas y agregarlas al array
    tiposSolicitudes.forEach(tipo => {
      const respuestas = obtenerRespuestasAutomaticas(tipo);
      
      // Agregar cada respuesta con un id único y el título del tipo
      respuestas.forEach(respuesta => {
        todasRespuestas.push({
          id: idCounter++,
          titulo: tipo,
          texto: respuesta
        });
      });
    });
    
    // También agregar las respuestas generales
    const respuestasGenerales = obtenerRespuestasAutomaticas('general');
    respuestasGenerales.forEach(respuesta => {
      todasRespuestas.push({
        id: idCounter++,
        titulo: 'Respuesta general',
        texto: respuesta
      });
    });
    
    // Actualizar el estado con todas las respuestas
    setRespuestasRapidas(todasRespuestas);
  }, []);
  
  // Función para seleccionar una respuesta rápida
  const seleccionarRespuestaRapida = (texto) => {
    setRespuestaTexto(texto);
  };
  
  // Función para cargar solicitudes PQRSF desde localStorage y el servidor
  const cargarSolicitudes = async () => {
    setCargando(true);
    setErrorCarga('');
    setMensajeExito('');
    
    try {
      console.log('Iniciando carga de solicitudes PQRSF...');
      
      // Comenzar con un array vacío para evitar duplicados
      let solicitudesPQRSF = [];
      
      // 1. Primero cargar solicitudes desde localStorage (prioridad)
      console.log('Cargando solicitudes PQRSF desde localStorage...');
      
      const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
      console.log('Solicitudes en localStorage:', solicitudesGuardadas);
      
      // Filtrar solo las solicitudes de tipo PQRSF o que tengan número de radicado
      const tiposPQRSF = ['petición', 'queja', 'reclamo', 'sugerencia', 'felicitación', 'peticion', 'felicitacion'];
      const solicitudesFiltradas = solicitudesGuardadas.filter(sol => 
        sol.esPQRSF || // Verificar el indicador explícito de PQRSF
        (sol.tipo && tiposPQRSF.includes(sol.tipo.toLowerCase())) || 
        (sol.categoria && sol.categoria.toLowerCase().includes('pqrsf')) || 
        (sol.numeroRadicado && sol.numeroRadicado.includes('PQRSF'))
      );
      
      console.log('Solicitudes PQRSF filtradas de localStorage:', solicitudesFiltradas);
      
      solicitudesFiltradas.forEach(nuevaSolicitud => {
        // Adaptar el formato para que coincida con el esperado por el componente
        // Asegurarse de que el número de radicado esté presente y sea consistente
        const numeroRadicado = nuevaSolicitud.numeroRadicado || '';
        console.log('Número de radicado detectado:', numeroRadicado, 'para solicitud ID:', nuevaSolicitud.id);
        
        const solicitudFormateada = {
          id: nuevaSolicitud.id,
          estudiante: nuevaSolicitud.usuario || nuevaSolicitud.email || 'Usuario desconocido',
          tipo: nuevaSolicitud.tipo,
          descripcion: nuevaSolicitud.descripcion,
          estado: nuevaSolicitud.estado.charAt(0).toUpperCase() + nuevaSolicitud.estado.slice(1), // Capitalizar estado
          fecha: new Date(nuevaSolicitud.fecha).toLocaleDateString(),
          archivosAdjuntos: nuevaSolicitud.archivosAdjuntos || [],
          tieneAdjuntos: nuevaSolicitud.archivosAdjuntos?.length > 0 || false,
          numeroRadicado: numeroRadicado,
          respuesta: nuevaSolicitud.respuesta || null,
          categoria: nuevaSolicitud.categoria || '',
          historialEstados: nuevaSolicitud.historial || nuevaSolicitud.historialEstados || []
        };
        solicitudesPQRSF.push(solicitudFormateada);
      });
      
      console.log(`Cargadas ${solicitudesPQRSF.length} solicitudes PQRSF desde localStorage`);
      
      // 2. Si hay pocas solicitudes en localStorage, intentar cargar también del servidor
      try {
        console.log('Intentando cargar solicitudes PQRSF adicionales del servidor...');
        const response = await fetch('http://localhost:5000/api/solicitudes');
        
        if (response.ok) {
          const todasSolicitudes = await response.json();
          console.log('Todas las solicitudes obtenidas del servidor:', todasSolicitudes);
          
          // Filtrar solo las solicitudes de tipo PQRSF (Petición, Queja, Reclamo, Sugerencia, Felicitación)
          const tiposPQRSF = ['petición', 'queja', 'reclamo', 'sugerencia', 'felicitación'];
          const solicitudesServidor = todasSolicitudes.filter(sol => 
            (sol.tipo && tiposPQRSF.includes(sol.tipo.toLowerCase())) || 
            sol.categoria?.toLowerCase().includes('pqrsf')
          );
          
          console.log('Solicitudes PQRSF filtradas del servidor:', solicitudesServidor);
          
          // Mapear solicitudes del servidor al formato esperado por el componente
          // Pero solo agregar las que no están ya en el array (evitar duplicados)
          solicitudesServidor.forEach(sol => {
            // Verificar si ya existe esta solicitud (por ID)
            const existente = solicitudesPQRSF.find(s => s.id === sol.id);
            if (existente) {
              return; // Ya existe, no agregar
            }
            
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
              categoria: sol.categoria || '',
              historialEstados: historialEstados
            };
            solicitudesPQRSF.push(solicitudFormateada);
          });
          
          console.log(`Total de solicitudes PQRSF después de combinar: ${solicitudesPQRSF.length}`);
        }
      } catch (serverError) {
        console.warn('No se pudieron cargar solicitudes adicionales del servidor:', serverError);
        // No establecer error para no confundir al usuario, ya que tenemos datos de localStorage
      }
      
      // Si no hay solicitudes, mostrar mensaje informativo
      if (solicitudesPQRSF.length === 0) {
        console.log('No se encontraron solicitudes PQRSF en el servidor ni en localStorage');
        setErrorCarga('No hay solicitudes PQRSF disponibles. Intente más tarde o verifique la conexión con el servidor.');
      }
      
      // Actualizar el estado con todas las solicitudes cargadas
      console.log('Total de solicitudes PQRSF a mostrar:', solicitudesPQRSF.length);
      setSolicitudes(solicitudesPQRSF);
      
      // Mostrar mensaje de éxito temporal
      setMensajeExito(`Solicitudes PQRSF sincronizadas correctamente. Total: ${solicitudesPQRSF.length}`);
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      console.error('Error al sincronizar solicitudes PQRSF:', error);
      setErrorCarga(`Error al cargar las solicitudes PQRSF: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };
  
  // Cargar solicitudes al montar el componente y configurar escucha de eventos
  useEffect(() => {
    cargarSolicitudes();
    
    // Configurar escucha de eventos de sincronización
    const handleSolicitudesUpdated = (event) => {
      console.log('Evento de sincronización recibido en AdminPQRSFManager:', event.detail);
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
    console.log('Filtrando solicitudes PQRSF. Total disponibles:', solicitudes.length);
    console.log('Filtros aplicados:', { filtroEstado: filtro.estado, filtroTipo: filtro.tipo, filtroCategoria: filtro.categoria, busqueda });
    
    if (!Array.isArray(solicitudes)) {
      console.error('Error: solicitudes no es un array', solicitudes);
      return [];
    }
    
    return solicitudes.filter(solicitud => {
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
      
      // Filtro por categoría
      const pasaFiltroCategoria = !filtro.categoria || 
        (solicitud.categoria && solicitud.categoria.toLowerCase() === filtro.categoria.toLowerCase());
      
      // Búsqueda por texto en descripción, tipo, estudiante o número de radicado
      const pasaBusqueda = !busqueda || (
        (solicitud.descripcion && solicitud.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
        (solicitud.tipo && solicitud.tipo.toLowerCase().includes(busqueda.toLowerCase())) ||
        (solicitud.estudiante && solicitud.estudiante.toLowerCase().includes(busqueda.toLowerCase())) ||
        (solicitud.numeroRadicado && solicitud.numeroRadicado.toLowerCase().includes(busqueda.toLowerCase()))
      );
      
      return pasaFiltroEstado && pasaFiltroTipo && pasaFiltroCategoria && pasaBusqueda;
    });
  };

  const handleCambioEstado = async (id, nuevoEstado) => {
    try {
      const resultado = await actualizarEstado(id, nuevoEstado.toLowerCase(), `Estado cambiado a ${nuevoEstado.toLowerCase()} por administrador`);
      
      if (resultado.success) {
        // Actualizar el estado local
        setSolicitudes(prevSolicitudes => 
          prevSolicitudes.map(sol => 
            sol.id === id ? { ...sol, estado: nuevoEstado } : sol
          )
        );
        
        setMensajeExito(`Estado actualizado correctamente a: ${nuevoEstado}`);
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        console.error('Error al actualizar estado:', resultado.error);
        setErrorCarga(`Error al actualizar estado: ${resultado.error}`);
        setTimeout(() => setErrorCarga(''), 5000);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setErrorCarga(`Error al actualizar estado: ${error.message}`);
      setTimeout(() => setErrorCarga(''), 5000);
    }
  };

  const handleMostrarModalRespuesta = (solicitud) => {
    setRespuestaModal(solicitud);
    setRespuestaTexto(solicitud.respuesta || '');
  };

  const handleEnviarRespuesta = async () => {
    if (!respuestaModal || !respuestaTexto.trim()) {
      setErrorCarga('Por favor ingrese una respuesta válida');
      setTimeout(() => setErrorCarga(''), 3000);
      return;
    }
    
    setEnviandoRespuesta(true);
    
    try {
      const resultado = await responderSolicitud(respuestaModal.id, respuestaTexto, 'Solicitud respondida por administrador');
      
      if (resultado.success) {
        // Actualizar el estado local
        setSolicitudes(prevSolicitudes => 
          prevSolicitudes.map(sol => 
            sol.id === respuestaModal.id ? { ...sol, respuesta: respuestaTexto, estado: 'Resuelta' } : sol
          )
        );
        
        setMensajeExito('Respuesta enviada correctamente');
        setTimeout(() => setMensajeExito(''), 3000);
        
        // Cerrar el modal
        setRespuestaModal(null);
        setRespuestaTexto('');
      } else {
        console.error('Error al enviar respuesta:', resultado.error);
        setErrorCarga(`Error al enviar respuesta: ${resultado.error}`);
        setTimeout(() => setErrorCarga(''), 5000);
      }
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      setErrorCarga(`Error al enviar respuesta: ${error.message}`);
      setTimeout(() => setErrorCarga(''), 5000);
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const handleMostrarArchivo = (archivo) => {
    setArchivoPreview(archivo);
  };

  const handleCerrarPreview = () => {
    setArchivoPreview(null);
  };

  const getIconoArchivo = (tipo) => {
    if (tipo.includes('pdf')) return <FaFilePdf />;
    if (tipo.includes('word') || tipo.includes('doc')) return <FaFileWord />;
    if (tipo.includes('image')) return <FaFileImage />;
    return <FaFile />;
  };

  const solicitudesFiltradas = filtrarSolicitudes();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gestión de PQRSF</h2>
        
        <button 
          className={styles.syncButton} 
          onClick={cargarSolicitudes}
          disabled={cargando}
        >
          <FaSync className={cargando ? styles.spinning : ''} />
          {cargando ? 'Sincronizando...' : 'Sincronizar'}
        </button>
      </div>
      
      {mensajeExito && (
        <div className={styles.successMessage}>
          {mensajeExito}
        </div>
      )}
      
      {errorCarga && (
        <div className={styles.errorMessage}>
          {errorCarga}
        </div>
      )}
      
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Estado:</label>
          <select 
            value={filtro.estado} 
            onChange={(e) => setFiltro({...filtro, estado: e.target.value})}
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en revisión">En Revisión</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="resuelta">Resuelta</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Tipo:</label>
          <select 
            value={filtro.tipo} 
            onChange={(e) => setFiltro({...filtro, tipo: e.target.value})}
          >
            <option value="">Todos</option>
            <option value="petición">Petición</option>
            <option value="queja">Queja</option>
            <option value="reclamo">Reclamo</option>
            <option value="sugerencia">Sugerencia</option>
            <option value="felicitación">Felicitación</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Categoría:</label>
          <select 
            value={filtro.categoria} 
            onChange={(e) => setFiltro({...filtro, categoria: e.target.value})}
          >
            <option value="">Todas</option>
            <option value="académico">Académico</option>
            <option value="administrativo">Administrativo</option>
            <option value="financiero">Financiero</option>
            <option value="sistemas">Sistemas</option>
            <option value="infraestructura">Infraestructura</option>
          </select>
        </div>
        
        <div className={styles.searchGroup}>
          <input 
            type="text" 
            placeholder="Buscar por descripción, tipo, estudiante o radicado..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <FaFilter />
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Radicado</th>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Adjuntos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesFiltradas.length > 0 ? (
              solicitudesFiltradas.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td className={styles.radicadoCell}>
                    {solicitud.numeroRadicado && solicitud.numeroRadicado !== '' ? 
                      <span className={styles.radicadoNumero}>{solicitud.numeroRadicado}</span> : 
                      <span className={styles.sinRadicado}>Sin radicado</span>
                    }
                  </td>
                  <td>{solicitud.fecha}</td>
                  <td>{solicitud.estudiante}</td>
                  <td>{solicitud.tipo}</td>
                  <td>{solicitud.categoria || 'N/A'}</td>
                  <td className={styles.descripcionCell}>
                    <div className={styles.descripcionText}>
                      {solicitud.descripcion}
                    </div>
                  </td>
                  <td>
                    <select 
                      value={solicitud.estado} 
                      onChange={(e) => handleCambioEstado(solicitud.id, e.target.value)}
                      className={styles.estadoSelect}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                      <option value="Resuelta">Resuelta</option>
                    </select>
                  </td>
                  <td>
                    {solicitud.tieneAdjuntos && solicitud.archivosAdjuntos && solicitud.archivosAdjuntos.length > 0 ? (
                      <div className={styles.adjuntosContainer}>
                        {solicitud.archivosAdjuntos.map((archivo, index) => (
                          <div key={index} className={styles.adjuntoItem}>
                            <button 
                              className={styles.viewButton}
                              onClick={() => handleMostrarArchivo(archivo)}
                              title={archivo.nombre}
                            >
                              {getIconoArchivo(archivo.tipo)}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>No</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className={styles.responderButton}
                      onClick={() => handleMostrarModalRespuesta(solicitud)}
                      disabled={solicitud.estado === 'Resuelta'}
                    >
                      <FaReply />
                      {solicitud.respuesta ? 'Ver/Editar' : 'Responder'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  {cargando ? 'Cargando solicitudes...' : 'No se encontraron solicitudes PQRSF con los filtros aplicados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal para ver archivos adjuntos */}
      {archivoPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{archivoPreview.nombre}</h3>
              <button className={styles.closeButton} onClick={handleCerrarPreview}>×</button>
            </div>
            <div className={styles.modalBody}>
              {archivoPreview.tipo.includes('image') ? (
                <img src={archivoPreview.contenido} alt={archivoPreview.nombre} className={styles.previewImage} />
              ) : (
                <div className={styles.fileInfo}>
                  <p>
                    <strong>Tipo:</strong> {archivoPreview.tipo}
                  </p>
                  <p>
                    <strong>Tamaño:</strong> {Math.round(archivoPreview.tamaño / 1024)} KB
                  </p>
                  <a 
                    href={archivoPreview.contenido} 
                    download={archivoPreview.nombre}
                    className={styles.downloadButton}
                  >
                    <FaDownload /> Descargar
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para responder solicitud */}
      {respuestaModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Responder Solicitud</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => {
                  setRespuestaModal(null);
                  setRespuestaTexto('');
                }}
              >×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.solicitudInfo}>
                <p><strong>Radicado:</strong> {respuestaModal.numeroRadicado || 'N/A'}</p>
                <p><strong>Tipo:</strong> {respuestaModal.tipo}</p>
                <p><strong>Estudiante:</strong> {respuestaModal.estudiante}</p>
                <p><strong>Descripción:</strong> {respuestaModal.descripcion}</p>
              </div>
              <div className={styles.respuestaForm}>
                <div className={styles.respuestasRapidas}>
                  <div className={styles.respuestasRapidasHeader}>
                    <FaLightbulb /> <span>Respuestas rápidas:</span>
                  </div>
                  <div className={styles.respuestasRapidasList}>
                    {respuestasRapidas.map(respuesta => (
                      <button
                        key={respuesta.id}
                        className={styles.respuestaRapidaButton}
                        onClick={() => seleccionarRespuestaRapida(respuesta.texto)}
                        disabled={enviandoRespuesta}
                      >
                        {respuesta.titulo}
                      </button>
                    ))}
                  </div>
                </div>
                
                <label>Respuesta:</label>
                <textarea 
                  value={respuestaTexto} 
                  onChange={(e) => setRespuestaTexto(e.target.value)}
                  placeholder="Ingrese su respuesta aquí o seleccione una respuesta rápida..."
                  rows={5}
                  disabled={enviandoRespuesta}
                />
                <button 
                  className={styles.sendButton}
                  onClick={handleEnviarRespuesta}
                  disabled={enviandoRespuesta || !respuestaTexto.trim()}
                >
                  {enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPQRSFManager;
