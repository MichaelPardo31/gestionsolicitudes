import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MainLayout from './MainLayout';

const Dashboard = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const handleCreateSolicitud = (nuevaSolicitud) => {
    console.log('Solicitud creada:', nuevaSolicitud);
    // Aquí podrías hacer una llamada a una API o actualizar el estado
  };

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Bienvenido, {user?.email}</h1>
          <button
            onClick={onLogout}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      
      <MainLayout />
    </div>
  );
};

export default Dashboard;

// DONE

