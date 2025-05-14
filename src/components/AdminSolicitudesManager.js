import React, { useState } from 'react';
import { MOCK_SOLICITUDES_ADMIN } from '../mock/solicitudesAdmin';
import styles from './AdminSolicitudesManager.module.css';

const AdminSolicitudesManager = () => {
  const [solicitudes, setSolicitudes] = useState(MOCK_SOLICITUDES_ADMIN);
  const [filtro, setFiltro] = useState({ estado: '', tipo: '' });
  const [busqueda, setBusqueda] = useState('');

  const filtrarSolicitudes = () => {
    return solicitudes.filter(solicitud => 
      (filtro.estado ? solicitud.estado === filtro.estado : true) &&
      (filtro.tipo ? solicitud.tipo === filtro.tipo : true) &&
      (busqueda ? solicitud.estudiante.toLowerCase().includes(busqueda.toLowerCase()) : true)
    );
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setSolicitudes(solicitudes.map(solicitud => 
      solicitud.id === id ? { ...solicitud, estado: nuevoEstado } : solicitud
    ));
  };

  const solicitudesFiltradas = filtrarSolicitudes();

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Gestión de Solicitudes</h2>
        </div>
        
        <div className={styles.filterContainer}>
          <div className={styles.filterRow}>
            <select 
              value={filtro.estado}
              onChange={(e) => setFiltro({...filtro, estado: e.target.value})}
              className={`${styles.filterInput} ${styles.filterSelect}`}
            >
              <option value="">Todos los Estados</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>

            <select 
              value={filtro.tipo}
              onChange={(e) => setFiltro({...filtro, tipo: e.target.value})}
              className={`${styles.filterInput} ${styles.filterSelect}`}
            >
              <option value="">Todos los Tipos</option>
              <option value="Cambio de Carrera">Cambio de Carrera</option>
              <option value="Inscripción de Curso">Inscripción de Curso</option>
            </select>
          </div>
          
          <input 
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante..."
            className={styles.filterInput}
          />
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
      </div>
    </div>
  );
};

export default AdminSolicitudesManager;