import React, { useState } from 'react';

const UserProfile = ({ user, onUpdateProfile, onBack }) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: user.nombre || '',
    email: user.email || '',
    telefono: user.telefono || '',
    carrera: user.carrera || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdateProfile(profileData);
    setEditMode(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mi Perfil</h2>
          <button 
            onClick={onBack}
            className="px-3 py-1 bg-white text-indigo-800 rounded-lg hover:bg-gray-100 transition"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="p-6">
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={profileData.nombre}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={profileData.telefono}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
              <input
                type="text"
                name="carrera"
                value={profileData.carrera}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-2xl font-bold">
                {user.nombre?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.nombre || 'Usuario'}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="text-gray-800">{user.telefono || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Carrera</p>
                <p className="text-gray-800">{user.carrera || 'No especificada'}</p>
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Editar perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

// DONE

