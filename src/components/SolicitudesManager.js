import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { enviarSolicitud } from '../mock/api';
import { FaExternalLinkAlt, FaPaperclip, FaFile, FaTrash } from 'react-icons/fa';
import styles from './SolicitudesManager.module.css';

// Imágenes para todas las categorías
import becaImg from '../assets/beca.jpg';
import pagoImg from '../assets/pago.jpg';
import PagoextraImg from '../assets/pagoextra.jpg';
import reembolsoImg from '../assets/reembolso.jpg';
import convenioImg from '../assets/convenio.jpg';
import estadoImg from '../assets/estado.jpg';
import certificadoImg from '../assets/certificado.jpeg';
import cancelacionImg from '../assets/cancelacion.jpeg';
import datosImg from '../assets/datos.jpg';
import horariosImg from '../assets/horarios.jpg';
import notasImg from '../assets/notas.jpg';
import cambioGrupoImg from '../assets/programa.jpg';
import programasImg from '../assets/beca.jpg';
import docenteImg from '../assets/datos.jpg';

const SolicitudesManager = ({ navigateToView }) => {
  const { user } = useContext(AuthContext);

  // Estados del formulario
  const [selectedCategory, setSelectedCategory] = useState('academicas');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [solicitudEnviada, setSolicitudEnviada] = useState(null);
  const [mostrarModalRadicado, setMostrarModalRadicado] = useState(false);
  const [adjuntos, setAdjuntos] = useState([]);
  const [errorAdjunto, setErrorAdjunto] = useState('');
  const fileInputRef = useRef(null);

  // Tipos de solicitudes disponibles
  const tiposSolicitudes = {
    academicas: [
      { 
        titulo: 'Horarios', 
        tipo: 'enlace', 
        imagen: horariosImg,
        link: 'https://app.udem.edu.co/ConsultasServAcadem/',
        descripcion: 'Consulta tus horarios académicos'
      },
      { 
        titulo: 'Cambio de grupo', 
        tipo: 'enlace', 
        imagen: cambioGrupoImg,
        link: 'https://app.udem.edu.co/AjusteMatricPre/',
        descripcion: 'Solicita cambio de grupo o materia'
      },
      { 
        titulo: 'Notas', 
        tipo: 'enlace', 
        imagen: notasImg,
        link: 'https://app.udem.edu.co/ConsultasServAcadem/',
        descripcion: 'Consulta tus calificaciones'
      },
      { 
        titulo: 'Información de docente', 
        tipo: 'formulario',
        imagen: docenteImg,
        descripcion: 'Solicita información sobre profesores'
      },
      { 
        titulo: 'Programas académicos', 
        tipo: 'formulario',
        imagen: programasImg,
        descripcion: 'Consulta información sobre programas'
      }
    ],
    administrativas: [
      { 
        titulo: 'Certificados', 
        tipo: 'enlace', 
        imagen: certificadoImg, 
        link: 'https://app.udem.edu.co/ConsultasServAcadem/',
        descripcion: 'Consulta o solicita certificados'
      },
      { 
        titulo: 'Cancelación materias', 
        tipo: 'enlace', 
        imagen: cancelacionImg, 
        link: 'https://app.udem.edu.co/ServiciosEnLinea/login.html',
        descripcion: 'Solicita cancelar una materia'
      },
      { 
        titulo: 'Actualización datos', 
        tipo: 'enlace', 
        imagen: datosImg, 
        link: 'https://app.udem.edu.co/ActualizacionDatos/login.html',
        descripcion: 'Solicita actualización de datos personales'
      },
    ],
    pqrsf: [
      { titulo: 'Petición', tipo: 'formulario', descripcion: 'Realiza una petición' },
      { titulo: 'Queja', tipo: 'formulario', descripcion: 'Registra una queja' },
      { titulo: 'Reclamo', tipo: 'formulario', descripcion: 'Presenta un reclamo' },
      { titulo: 'Sugerencia', tipo: 'formulario', descripcion: 'Envía una sugerencia' },
      { titulo: 'Felicitación', tipo: 'formulario', descripcion: 'Envía una felicitación' }
    ],
    financieras: [
      { 
        titulo: 'Becas', 
        tipo: 'enlace', 
        imagen: becaImg, 
        link: 'https://admisiones.udemedellin.edu.co/becas-descuentos-y-financiacion-de-pregrado/',
        descripcion: 'Información sobre becas y descuentos'
      },
      { 
        titulo: 'Pago matrícula', 
        tipo: 'enlace', 
        imagen: pagoImg, 
        link: 'https://app.udem.edu.co/PagosEnLinea/',
        descripcion: 'Realiza el pago de matrícula'
      },
      { 
        titulo: 'Pago servicios extracurriculares', 
        tipo: 'enlace', 
        imagen: PagoextraImg, 
        link: 'https://app.udem.edu.co/PagosEnLinea/',
        descripcion: 'Pago de servicios adicionales'
      },
      { 
        titulo: 'Reembolsos', 
        tipo: 'enlace', 
        imagen: reembolsoImg, 
        link: 'https://app.udem.edu.co/PagosEnLinea/index.html',
        descripcion: 'Solicitud de reembolsos'
      },
      { 
        titulo: 'Convenios financieros', 
        tipo: 'enlace', 
        imagen: convenioImg, 
        link: 'https://app.udem.edu.co/ConsultasServAcadem/',
        descripcion: 'Información sobre convenios'
      },
      { 
        titulo: 'Estado de cuenta', 
        tipo: 'enlace', 
        imagen: estadoImg, 
        link: 'https://app.udem.edu.co/ConsultasServAcadem/',
        descripcion: 'Consulta tu estado financiero'
      }
    ]
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar tamaño y tipo de archivos
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    // Validar cada archivo
    for (const file of files) {
      if (file.size > maxSize) {
        setErrorAdjunto(`El archivo ${file.name} excede el tamaño máximo de 5MB`);
        return;
      }
      
      if (!validTypes.includes(file.type)) {
        setErrorAdjunto(`El archivo ${file.name} no es de un formato válido. Formatos permitidos: JPG, PNG, GIF, PDF, DOC, DOCX`);
        return;
      }
    }
    
    // Limitar a máximo 3 archivos
    if (adjuntos.length + files.length > 3) {
      setErrorAdjunto('Solo se permiten adjuntar hasta 3 archivos');
      return;
    }
    
    setErrorAdjunto('');
    setAdjuntos([...adjuntos, ...files]);
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveFile = (index) => {
    const newAdjuntos = [...adjuntos];
    newAdjuntos.splice(index, 1);
    setAdjuntos(newAdjuntos);
  };

  const handleSubmit = async () => {
    if (!selectedSolicitud || !descripcion) return;

    setIsSubmitting(true);

    try {
      // Convertir archivos a base64 para almacenarlos
      const archivosBase64 = await Promise.all(
        adjuntos.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
              nombre: file.name,
              tipo: file.type,
              tamaño: file.size,
              contenido: reader.result
            });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      const nuevaSolicitud = {
        tipo: selectedSolicitud,
        descripcion,
        categoria: selectedCategory === 'pqrsf' ? 'PQRSF' : selectedCategory,
        usuario: user?.nombre || 'Anónimo',
        email: user?.email || '',
        estado: 'pendiente',
        archivosAdjuntos: archivosBase64,
        esPQRSF: selectedCategory === 'pqrsf'
      };

      // Mostrar mensaje de espera mientras se sincroniza con el servidor
      setSuccessMessage('Enviando solicitud y sincronizando con el servidor...');
      
      // Llamar a la función asíncrona enviarSolicitud
      const resultado = await enviarSolicitud(nuevaSolicitud);
      
      if (resultado.success) {
        // Limpiar mensaje de espera
        setSuccessMessage('');
        
        // Primero guardamos la solicitud enviada
        setSolicitudEnviada(resultado.data);
        // Mostrar el modal directamente
        setMostrarModalRadicado(true);
        
        // No limpiamos el formulario inmediatamente para evitar parpadeos
        // La limpieza se realizará cuando el usuario cierre el modal
        // o navegue al historial
      } else {
        setSuccessMessage('Error al enviar la solicitud: ' + resultado.error);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setSuccessMessage('Error al enviar la solicitud: ' + error.message);
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardClick = (solicitud) => {
    if (solicitud.tipo === 'enlace') {
      window.open(solicitud.link, '_blank');
    } else {
      setSelectedSolicitud(solicitud.titulo);
    }
  };

  // Función auxiliar para sincronizar con localStorage
  const sincronizarConLocalStorage = () => {
    if (solicitudEnviada) {
      // Obtener solicitudes existentes del localStorage
      const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
      
      // Verificar si la solicitud ya existe para evitar duplicados
      if (!solicitudesGuardadas.some(sol => sol.numeroRadicado === solicitudEnviada.numeroRadicado)) {
        localStorage.setItem('solicitudes', JSON.stringify([...solicitudesGuardadas, solicitudEnviada]));
      }
    }
  };

  // Implementación simplificada del modal sin estados complejos
  // Esto elimina cualquier problema de parpadeo
  
  const handleVerHistorial = (e) => {
    if (e) e.stopPropagation(); // Detener la propagación del evento
    console.log('Botón "Ver en mi historial" presionado');
    
    // Asegurar que los datos se sincronizan antes de navegar
    sincronizarConLocalStorage();
    
    // Cerrar el modal inmediatamente
    setMostrarModalRadicado(false);
    
    // Limpiar el formulario
    setSelectedSolicitud(null);
    setDescripcion('');
    setAdjuntos([]);
    
    // Intentar navegar usando ambos métodos para garantizar que funcione
    if (typeof navigateToView === 'function') {
      navigateToView('historial');
    }
    
    // También disparar el evento como respaldo
    window.dispatchEvent(new CustomEvent('navegarAHistorial'));
  };
  
  const handleCerrarModal = (e) => {
    if (e) e.stopPropagation(); // Detener la propagación del evento
    console.log('Botón "Cerrar" del modal de radicado presionado');

    sincronizarConLocalStorage();
    
    // Cerrar el modal inmediatamente
    setMostrarModalRadicado(false);
    
    // Limpiar el formulario inmediatamente sin usar setTimeout
    setSelectedSolicitud(null);
    setDescripcion('');
    setAdjuntos([]);
  };
  
  // Modal para mostrar el número de radicado
  // Implementación simplificada sin estados de animación
  const ModalRadicado = React.memo(() => {
    // Solo renderizamos si debemos mostrar el modal y tenemos datos
    if (!mostrarModalRadicado || !solicitudEnviada) return null;
    
    // Handler específicos para cada botón dentro del componente
    const onVerHistorialClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Botón Ver Historial clickeado dentro del modal');
      handleVerHistorial(e);
    };
    
    const onCerrarClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Botón Cerrar clickeado dentro del modal');
      handleCerrarModal(e);
    };
    
    return (
      <div className={styles.modalOverlay} onClick={onCerrarClick}>
        <div 
          className={styles.modalContent} 
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', zIndex: 1050 }}
        >
          <h3 className={styles.modalTitle}>¡Solicitud Enviada Exitosamente!</h3>
          
          <div className={styles.radicadoInfo}>
            <p>Su solicitud ha sido radicada con el número:</p>
            <div className={styles.numeroRadicado}>
              {solicitudEnviada.numeroRadicado}
            </div>
            <p>Guarde este número para consultar el estado de su solicitud.</p>
          </div>
          
          <div className={styles.modalButtons}>
            <button 
              className={styles.verHistorialButton}
              onClick={onVerHistorialClick}
              style={{ position: 'relative', zIndex: 1060, cursor: 'pointer' }}
              type="button"
            >
              Ver en mi historial
            </button>
            <button 
              className={styles.cerrarModalButton}
              onClick={onCerrarClick}
              style={{ position: 'relative', zIndex: 1060, cursor: 'pointer' }}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
});

  return (
    <div className={styles.managerContainer}>
      <div className={styles.managerHeader}>
        <h2 className={styles.managerTitle}>Gestión de Solicitudes</h2>
      </div>

      {/* Modal de radicado */}
      <ModalRadicado />

      <div className={styles.mainContent}>
        {/* Selector de categoría */}
        <div className={styles.categoryTabs}>
          {Object.keys(tiposSolicitudes).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSolicitud(null);
              }}
              className={`${styles.categoryTab} ${
                selectedCategory === cat 
                  ? styles.activeCategory 
                  : styles.inactiveCategory
              }`}
            >
              {cat === 'academicas'
                ? 'Académicas'
                : cat === 'administrativas'
                ? 'Administrativas'
                : cat === 'pqrsf'
                ? 'PQRSF'
                : 'Financieras'}
            </button>
          ))}
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className={`${styles.message} ${
            successMessage.includes('Error') 
              ? styles.errorMessage 
              : styles.successMessage
          }`}>
            {successMessage}
          </div>
        )}

        {/* Listado de solicitudes o formulario */}
        {!selectedSolicitud ? (
          <div className={styles.requestsGrid}>
            {tiposSolicitudes[selectedCategory].map((solicitud, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(solicitud)}
                className={styles.requestCard}
              >
                {solicitud.imagen && (
                  <div className={styles.cardImageContainer}>
                    <img 
                      src={solicitud.imagen} 
                      alt={solicitud.titulo} 
                      className={styles.cardImage}
                    />
                  </div>
                )}
                <div className={styles.cardTextContent}>
                  <h3 className={styles.cardTitle}>
                    {solicitud.titulo}
                    {solicitud.tipo === 'enlace' && <FaExternalLinkAlt className={styles.externalLinkIcon} />}
                  </h3>
                  <p className={styles.cardDescription}>{solicitud.descripcion}</p>
                  <div className={styles.clickHint}>
                    {solicitud.tipo === 'enlace' ? 'Haz clic para acceder' : 'Haz clic para solicitar'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.requestForm}>
            <h3 className={styles.formTitle}>Solicitud: {selectedSolicitud}</h3>

            <div>
              <label className={styles.formLabel}>
                Descripción detallada
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.formTextarea}
                placeholder="Describe tu solicitud con detalles..."
                disabled={isSubmitting}
              />
            </div>
            
            {/* Sección de archivos adjuntos */}
            <div className={styles.adjuntosSection}>
              <label className={styles.formLabel}>
                Archivos adjuntos (opcional)
              </label>
              
              <div className={styles.adjuntosContainer}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className={styles.fileInput}
                  disabled={isSubmitting || adjuntos.length >= 3}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.adjuntarButton}
                  disabled={isSubmitting || adjuntos.length >= 3}
                  type="button"
                >
                  <FaPaperclip /> Adjuntar archivo
                </button>
                
                <div className={styles.adjuntosInfo}>
                  Formatos permitidos: JPG, PNG, GIF, PDF, DOC, DOCX (máx. 5MB)
                </div>
              </div>
              
              {errorAdjunto && (
                <div className={styles.errorAdjunto}>{errorAdjunto}</div>
              )}
              
              {adjuntos.length > 0 && (
                <div className={styles.adjuntosList}>
                  {adjuntos.map((file, index) => (
                    <div key={index} className={styles.adjuntoItem}>
                      <FaFile className={styles.fileIcon} />
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className={styles.removeFileButton}
                        disabled={isSubmitting}
                        type="button"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formButtons}>
              <button
                onClick={() => {
                  setSelectedSolicitud(null);
                  setDescripcion('');
                  setAdjuntos([]);
                  setErrorAdjunto('');
                }}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!descripcion || isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <span className={styles.loadingText}>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Solicitud'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudesManager;