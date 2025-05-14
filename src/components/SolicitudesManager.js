import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { enviarSolicitud } from '../mock/api';
import { FaExternalLinkAlt } from 'react-icons/fa';
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

const SolicitudesManager = () => {
  const { user } = useContext(AuthContext);

  // Estados del formulario
  const [selectedCategory, setSelectedCategory] = useState('academicas');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      { 
        titulo: 'Solicitud de documentos', 
        tipo: 'formulario',
        descripcion: 'Solicita documentos oficiales'
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

  const handleSubmit = async () => {
    if (!selectedSolicitud || !descripcion) return;

    setIsSubmitting(true);

    try {
      const nuevaSolicitud = {
        tipo: selectedSolicitud,
        descripcion,
        categoria: selectedCategory,
        usuario: user?.nombre || 'Anónimo',
        email: user?.email || '',
        estado: 'pendiente'
      };

      await enviarSolicitud(nuevaSolicitud);
      
      setSuccessMessage('¡Solicitud enviada correctamente!');
      setSelectedSolicitud(null);
      setDescripcion('');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setSuccessMessage('Error al enviar la solicitud');
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

  return (
    <div className={styles.managerContainer}>
      <div className={styles.managerHeader}>
        <h2 className={styles.managerTitle}>Gestión de Solicitudes</h2>
      </div>

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

            <div className={styles.formButtons}>
              <button
                onClick={() => {
                  setSelectedSolicitud(null);
                  setDescripcion('');
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