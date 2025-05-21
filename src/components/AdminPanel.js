import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import RespuestasAutomaticas from './RespuestasAutomaticas';
import styles from './AdminPanel.module.css';
import themeStyles from './UdemTheme.module.css';
// Importar logo de la Universidad de Medellín
import udemLogo from '../assets/udem-logo.png';

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const [respuestaActual, setRespuestaActual] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    const cargarSolicitudes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/solicitudes');
        if (!response.ok) {
          throw new Error('Error al cargar solicitudes');
        }
        const data = await response.json();
        setSolicitudes(data);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setSolicitudes([]);
      } finally {
        setIsLoading(false);
      }
    };

    cargarSolicitudes();
  }, []);

  // Filtrar solicitudes según estado
  const solicitudesFiltradas = solicitudes.filter(s => {
    if (filtro === 'todas') return true;
    return s.estado === filtro;
  });

  // Cambiar estado de una solicitud
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/solicitudes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado, respuesta: '' })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }
      const updatedSolicitud = await response.json();
      setSolicitudes(prev =>
        prev.map(s => (s.id === updatedSolicitud.id ? updatedSolicitud : s))
      );
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  // Responder a una solicitud
  const handleResponder = async (id) => {
    if (!respuestaActual) return;

    try {
      const response = await fetch(`http://localhost:5000/api/solicitudes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'respondida', respuesta: respuestaActual })
      });
      if (!response.ok) {
        throw new Error('Error al responder solicitud');
      }
      const updatedSolicitud = await response.json();
      setSolicitudes(prev =>
        prev.map(s => (s.id === updatedSolicitud.id ? updatedSolicitud : s))
      );
      setRespuestaActual('');
      setSelectedSolicitud(null);
    } catch (error) {
      console.error('Error al responder:', error);
    }
  };

  // Formatear fecha
  const formatFecha = (fechaString) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  // Estado para controlar la vista activa en el menú
  const [activeView, setActiveView] = useState('solicitudes');

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img src={udemLogo} alt="Universidad de Medellín" className={styles.logo} />
          </div>
          <h1 className={styles.adminTitle}>Panel Administrativo</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.nombre || 'Administrador'}</span>
            <button
              onClick={logout}
              className={styles.logoutButton}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Menú superior */}
      <div className={themeStyles.navContainer}>
        <div className={themeStyles.navButtons}>
          <button
            onClick={() => setActiveView('solicitudes')}
            className={`${themeStyles.navButton} ${
              activeView === 'solicitudes' ? themeStyles.navButtonActive : themeStyles.navButtonInactive
            }`}
          >
            Solicitudes
          </button>
          <button
            onClick={() => setActiveView('usuarios')}
            className={`${themeStyles.navButton} ${
              activeView === 'usuarios' ? themeStyles.navButtonActive : themeStyles.navButtonInactive
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveView('reportes')}
            className={`${themeStyles.navButton} ${
              activeView === 'reportes' ? themeStyles.navButtonActive : themeStyles.navButtonInactive
            }`}
          >
            Reportes
          </button>
          <button
            onClick={() => setActiveView('configuracion')}
            className={`${themeStyles.navButton} ${
              activeView === 'configuracion' ? themeStyles.navButtonActive : themeStyles.navButtonInactive
            }`}
          >
            Configuración
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        {activeView === 'solicitudes' && (
          <>
            {/* Filtros de solicitudes */}
            <div className={themeStyles.navContainer} style={{ marginBottom: '1rem' }}>
              <div className={themeStyles.navButtons}>
                {['todas', 'pendiente', 'aprobada', 'rechazada'].map((opcion) => (
                  <button
                    key={opcion}
                    onClick={() => setFiltro(opcion)}
                    className={`${themeStyles.navButton} ${
                      filtro === opcion
                        ? themeStyles.navButtonActive
                        : themeStyles.navButtonInactive
                    }`}
                  >
                    {opcion === 'todas' ? 'Todas' :
                     opcion === 'pendiente' ? 'Pendientes' :
                     opcion === 'aprobada' ? 'Aprobadas' : 'Rechazadas'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Listado de solicitudes */}
            <div className={styles.requestList}>
              {isLoading ? (
                <div className={styles.loadingState}>
                  <p>Cargando solicitudes...</p>
                </div>
              ) : solicitudesFiltradas.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No hay solicitudes {filtro !== 'todas' ? `en estado ${filtro}` : ''}</p>
                </div>
          ) : (
            solicitudesFiltradas.map((solicitud) => (
              <div key={solicitud.id} className={styles.requestItem}>
                <h3 className={styles.requestTitle}>{solicitud.tipo || 'Solicitud'}</h3>
                <p className={styles.requestMeta}>{solicitud.usuario || 'Usuario'} · {solicitud.fecha && formatFecha(solicitud.fecha)}</p>
                <p className={styles.requestDescription}>{solicitud.descripcion || 'Sin descripción'}</p>
                
                {solicitud.estado === 'aprobada' ? (
                  <div className={styles.confirmadoContainer}>
                    <span className={styles.confirmadoTag}>Confirmado</span>
                  </div>
                ) : (
                  <div className={styles.actionContainer}>
                    <button className={styles.estadoButton}>Estado</button>
                    
                    <div className={styles.requestActions}>
                      <button
                        onClick={() => cambiarEstado(solicitud.id, 'aprobada')}
                        className={`${styles.actionButton} ${styles.approveButton}`}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => cambiarEstado(solicitud.id, 'rechazada')}
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={() => setSelectedSolicitud(selectedSolicitud === solicitud.id ? null : solicitud.id)}
                        className={`${styles.actionButton} ${styles.respondButton}`}
                      >
                        Responder
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedSolicitud === solicitud.id && (
                  <div className={themeStyles.formContainer}>
                    {/* Componente de respuestas automáticas */}
                    <RespuestasAutomaticas 
                      onSelectRespuesta={(respuesta) => setRespuestaActual(respuesta)}
                      solicitudTipo={solicitud.tipo || 'general'}
                    />
                    
                    <div className={themeStyles.formGroup}>
                      <label className={themeStyles.formLabel}>Tu respuesta</label>
                      <textarea
                        value={respuestaActual}
                        onChange={(e) => setRespuestaActual(e.target.value)}
                        placeholder="Escribe tu respuesta o selecciona una de las opciones anteriores..."
                        className={themeStyles.formTextarea}
                      />
                    </div>
                    
                    <div className={themeStyles.formActions}>
                      <button
                        onClick={() => setSelectedSolicitud(null)}
                        className={`${themeStyles.actionButton} ${themeStyles.neutralButton}`}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleResponder(solicitud.id)}
                        disabled={!respuestaActual}
                        className={`${themeStyles.actionButton} ${
                          respuestaActual ? themeStyles.approveButton : themeStyles.neutralButton
                        }`}
                      >
                        Enviar respuesta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
            </div>
          </>
        )}
        
        {activeView === 'usuarios' && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Gestión de Usuarios</h2>
            <p className={styles.sectionDescription}>Esta sección permitirá gestionar los usuarios del sistema.</p>
            <div className={styles.comingSoon}>
              <p>Funcionalidad en desarrollo</p>
            </div>
          </div>
        )}
        
        {activeView === 'reportes' && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Reportes y Estadísticas</h2>
            <p className={styles.sectionDescription}>Visualiza estadísticas y genera reportes sobre las solicitudes.</p>
            <div className={styles.comingSoon}>
              <p>Funcionalidad en desarrollo</p>
            </div>
          </div>
        )}
        
        {activeView === 'configuracion' && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Configuración del Sistema</h2>
            <p className={styles.sectionDescription}>Ajusta la configuración general del sistema.</p>
            <div className={styles.comingSoon}>
              <p>Funcionalidad en desarrollo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
