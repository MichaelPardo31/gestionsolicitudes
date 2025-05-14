import React from 'react';
import { Link } from 'react-router-dom';
import PublicHome from './PublicHome';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con color rojo */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Universidad de Medellín</h1>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login"
              className="px-4 py-2 bg-white text-red-800 rounded-lg hover:bg-gray-100 transition"
            >
              Iniciar sesión
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 border border-white text-white rounded-lg hover:bg-red-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Barra de navegación con color rojo */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto flex space-x-4 p-2 overflow-x-auto">
          <button
            className="px-4 py-2 rounded-lg transition whitespace-nowrap bg-red-100 text-red-800 font-medium"
          >
            Inicio
          </button>
          <button
            className="px-4 py-2 rounded-lg transition whitespace-nowrap text-gray-700 hover:bg-gray-100"
            onClick={() => window.location.href = '/login'}
          >
            Asistente Virtual
          </button>
          <button
            className="px-4 py-2 rounded-lg transition whitespace-nowrap text-gray-700 hover:bg-gray-100"
            onClick={() => window.location.href = '/login'}
          >
            Solicitudes
          </button>
          <button
            className="px-4 py-2 rounded-lg transition whitespace-nowrap text-gray-700 hover:bg-gray-100"
            onClick={() => window.location.href = '/login'}
          >
            Foro
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container mx-auto p-4 md:p-8">
        <PublicHome />
      </main>
    </div>
  );
};

export default PublicLayout;
