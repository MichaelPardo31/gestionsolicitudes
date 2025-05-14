import React, { useEffect, useState } from 'react';

const SolicitudesList = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const storedSolicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    setSolicitudes(storedSolicitudes);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Solicitudes Recibidas</h2>
      {solicitudes.length === 0 ? (
        <p className="text-gray-500">No hay solicitudes registradas.</p>
      ) : (
        <ul className="space-y-4">
          {solicitudes.map((s, idx) => (
            <li key={idx} className="border-b pb-2">
              <p><strong>Usuario:</strong> {s.usuario}</p>
              <p><strong>Tipo:</strong> {s.tipo}</p>
              <p><strong>Categoría:</strong> {s.categoria}</p>
              <p><strong>Descripción:</strong> {s.descripcion}</p>
              <p className="text-sm text-gray-500">{new Date(s.fecha).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SolicitudesList;
