import React from 'react';

const DashboardHome = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Solicitudes Pendientes</h3>
          <div className="text-4xl font-bold text-blue-600">5</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Notificaciones</h3>
          <div className="text-4xl font-bold text-green-600">3</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Últimas Actividades</h3>
          <ul className="space-y-2">
            <li className="text-sm text-gray-600">Solicitud de cambio de carrera</li>
            <li className="text-sm text-gray-600">Inscripción a curso</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;