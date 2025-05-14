import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Página no encontrada</h1>
      <p className="text-lg text-gray-600 mb-6">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;