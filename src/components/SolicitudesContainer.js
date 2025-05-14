import React, { useState, useEffect } from 'react';
import SolicitudesManager from './SolicitudesManager';
import SolicitudesAdminPanel from './SolicitudesAdminPanel';
import SolicitudesFinancierasE from './SolicitudesFinancierasE';
import SolicitudesAdministrativasE from './SolicitudesAdministrativasE';

const SolicitudesContainer = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  // Cargar solicitudes desde localStorage al inicio
  useEffect(() => {
    const solicitudesGuardadas = localStorage.getItem('solicitudes');
    if (solicitudesGuardadas) {
      setSolicitudes(JSON.parse(solicitudesGuardadas));
    }
  }, []);

  // Guardar solicitudes en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
  }, [solicitudes]);

  const handleNuevaSolicitud = (solicitud) => {
    setSolicitudes((prev) => [...prev, solicitud]);
  };

  return (
    <div className="p-6 space-y-8">
      <SolicitudesManager onCreateSolicitud={handleNuevaSolicitud} />
      <SolicitudesAdminPanel solicitudes={solicitudes} />
    </div>
  );
};

export default SolicitudesContainer;
