import React, { useState, useEffect } from 'react';
import SolicitudesManager from './SolicitudesManager';
import SolicitudesAdminPanel from './SolicitudesAdminPanel';
import SolicitudesHistorial from './SolicitudesHistorial';
import SolicitudesFinancierasE from './SolicitudesFinancierasE';
import SolicitudesAdministrativasE from './SolicitudesAdministrativasE';

const SolicitudesContainer = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [currentView, setCurrentView] = useState('solicitudes');

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

  // Escuchar el evento personalizado para navegar al historial
  useEffect(() => {
    const navegarAHistorial = () => {
      setCurrentView('historial');
    };
    
    window.addEventListener('navegarAHistorial', navegarAHistorial);
    
    return () => {
      window.removeEventListener('navegarAHistorial', navegarAHistorial);
    };
  }, []);

  const handleNuevaSolicitud = (solicitud) => {
    setSolicitudes((prev) => [...prev, solicitud]);
  };

  return (
    <div className="p-6 space-y-8">
      {currentView === 'solicitudes' && (
        <>
          <SolicitudesManager 
            onCreateSolicitud={handleNuevaSolicitud} 
            navigateToView={setCurrentView}
          />
          <SolicitudesAdminPanel solicitudes={solicitudes} />
        </>
      )}
      {currentView === 'historial' && (
        <div>
          <button 
            onClick={() => setCurrentView('solicitudes')}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a solicitudes
          </button>
          <SolicitudesHistorial solicitudes={solicitudes} />
        </div>
      )}
    </div>
  );
};

export default SolicitudesContainer;
