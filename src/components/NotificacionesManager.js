import React, { useState } from 'react';
import { MOCK_NOTIFICACIONES } from '../mock/notificaciones';

const NotificacionesManager = () => {
  const [notificaciones, setNotificaciones] = useState(MOCK_NOTIFICACIONES);

  const marcarComoLeida = (id) => {
    setNotificaciones(notificaciones.map(notif => 
      notif.id === id ? { ...notif, leida: true } : notif
    ));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Notificaciones</h2>
        
        {notificaciones.map(notificacion => (
          <div 
            key={notificacion.id} 
            className={`p-4 rounded-lg mb-3 border flex justify-between items-center ${
              !notificacion.leida ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
            }`}
          >
            <div>
              <p className="font-semibold">{notificacion.mensaje}</p>
              <span className="text-sm text-gray-500">{notificacion.fecha}</span>
            </div>
            {!notificacion.leida && (
              <button 
                onClick={() => marcarComoLeida(notificacion.id)}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
              >
                Marcar como leída
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificacionesManager;