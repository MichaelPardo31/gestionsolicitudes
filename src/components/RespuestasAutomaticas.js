import React, { useState, useEffect } from 'react';
import { obtenerRespuestasAutomaticas, obtenerTiposSolicitudes } from '../mock/respuestasAutomaticas';
import styles from './UdemTheme.module.css';

const RespuestasAutomaticas = ({ onSelectRespuesta, solicitudTipo }) => {
  const [respuestas, setRespuestas] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(solicitudTipo || '');
  const [tiposSolicitudes, setTiposSolicitudes] = useState([]);

  // Cargar tipos de solicitudes al montar el componente
  useEffect(() => {
    const tipos = obtenerTiposSolicitudes();
    setTiposSolicitudes(tipos);
    
    // Si ya tenemos un tipo de solicitud, cargamos sus respuestas
    if (solicitudTipo) {
      const respuestasDisponibles = obtenerRespuestasAutomaticas(solicitudTipo);
      setRespuestas(respuestasDisponibles);
      setTipoSeleccionado(solicitudTipo);
    }
  }, [solicitudTipo]);

  // Manejar cambio de tipo de solicitud
  const handleTipoChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipoSeleccionado(nuevoTipo);
    
    if (nuevoTipo) {
      const respuestasDisponibles = obtenerRespuestasAutomaticas(nuevoTipo);
      setRespuestas(respuestasDisponibles);
    } else {
      setRespuestas([]);
    }
  };

  // Manejar selección de respuesta
  const handleSelectRespuesta = (respuesta) => {
    if (onSelectRespuesta) {
      onSelectRespuesta(respuesta);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.cardTitle}>Respuestas Automáticas</h3>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Tipo de solicitud
        </label>
        <select
          value={tipoSeleccionado}
          onChange={handleTipoChange}
          className={styles.formInput}
        >
          <option value="">Seleccione un tipo</option>
          {tiposSolicitudes.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
          <option value="general">Respuesta general</option>
        </select>
      </div>

      {respuestas.length > 0 && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Respuestas disponibles
          </label>
          <div className={styles.responseOptions}>
            {respuestas.map((respuesta, index) => (
              <div 
                key={index}
                onClick={() => handleSelectRespuesta(respuesta)}
                className={styles.responseOption}
              >
                <p>{respuesta}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RespuestasAutomaticas;
