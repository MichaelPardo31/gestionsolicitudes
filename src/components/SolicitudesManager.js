import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { enviarSolicitud } from '../mock/api';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileAlt,
  FaMoneyBillWave,
  FaExternalLinkAlt
} from 'react-icons/fa';
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

const SolicitudesManager = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados del formulario
  const [selectedCategory, setSelectedCategory] = useState('academicas');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Tipos de solicitudes disponibles
  const tiposSolicitudes = {
    academicas: [
      { titulo: 'Horarios', tipo: 'formulario' },
      { titulo: 'Cambio de grupo', tipo: 'formulario' },
      { titulo: 'Notas', tipo: 'formulario' },
      { titulo: 'Información de docente', tipo: 'formulario' },
      { titulo: 'Programas académicos', tipo: 'formulario' }
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
      { titulo: 'Petición', tipo: 'formulario' },
      { titulo: 'Queja', tipo: 'formulario' },
      { titulo: 'Reclamo', tipo: 'formulario' },
      { titulo: 'Sugerencia', tipo: 'formulario' },
      { titulo: 'Felicitación', tipo: 'formulario' }
    ],
    financieras: [
      { titulo: 'Becas', tipo: 'enlace', imagen: becaImg, link: 'https://admisiones.udemedellin.edu.co/becas-descuentos-y-financiacion-de-pregrado/' },
      { titulo: 'Pago matrícula', tipo: 'enlace', imagen: pagoImg, link: 'https://app.udem.edu.co/PagosEnLinea/' },
      { titulo: 'Pago servicios extracurriculares', tipo: 'enlace', imagen: PagoextraImg, link: 'https://app.udem.edu.co/PagosEnLinea/' },
      { titulo: 'Reembolsos', tipo: 'enlace', imagen: reembolsoImg, link: 'https://app.udem.edu.co/PagosEnLinea/index.html' },
      { titulo: 'Convenios financieros', tipo: 'enlace', imagen: convenioImg, link: 'https://app.udem.edu.co/ConsultasServAcadem/' },
      { titulo: 'Estado de cuenta', tipo: 'enlace', imagen: estadoImg, link: 'https://app.udem.edu.co/ConsultasServAcadem/' }
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

      <div className="p-6">
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
                  <div className={styles.cardImage}>
                    <img src={solicitud.imagen} alt={solicitud.titulo} />
                  </div>
                )}
                {solicitud.icono && (
                  <div className={styles.cardIcon}>
                    {solicitud.icono}
                  </div>
                )}
                <h3 className={styles.requestTitle}>
                  {solicitud.titulo}
                  {solicitud.tipo === 'enlace' && <FaExternalLinkAlt className={styles.externalLinkIcon} />}
                </h3>
                <p className={styles.requestDescription}>
                  {solicitud.descripcion || 'Haz clic para solicitar'}
                </p>
                <p className={styles.requestPrompt}>
                  {solicitud.tipo === 'enlace' ? 'Haz clic para acceder' : 'Haz clic para solicitar'}
                </p>
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