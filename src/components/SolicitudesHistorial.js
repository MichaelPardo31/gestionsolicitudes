import React, { useEffect, useState, useContext } from 'react';
import { fetchSolicitudes } from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';
import styles from './SolicitudesHistorial.module.css';

const SolicitudesHistorial = () => {
  const { user } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSolicitudes = async () => {
      try {
        const allSolicitudes = await fetchSolicitudes();
        // Filtrar solicitudes del usuario actual
        const userSolicitudes = allSolicitudes.filter(s => s.student_id === user.id);
        setSolicitudes(userSolicitudes);
      } catch (err) {
        setError('Error al cargar el historial de solicitudes');
      } finally {
        setLoading(false);
      }
    };
    loadSolicitudes();
  }, [user]);

  if (loading) return <p>Cargando historial de solicitudes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.historialContainer}>
      <h2>Historial de Solicitudes</h2>
      {solicitudes.length === 0 ? (
        <p>No tienes solicitudes registradas.</p>
      ) : (
        <ul className={styles.solicitudesList}>
          {solicitudes.map((solicitud) => (
            <li key={solicitud.id} className={styles.solicitudItem}>
              <p><strong>Tipo:</strong> {solicitud.tipo}</p>
              <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
              <p><strong>Estado:</strong> {solicitud.estado}</p>
              <p><strong>Fecha:</strong> {new Date(solicitud.fecha).toLocaleDateString()}</p>
              {solicitud.respuesta && (
                <p><strong>Respuesta:</strong> {solicitud.respuesta}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SolicitudesHistorial;
