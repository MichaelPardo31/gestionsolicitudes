import React, { useState } from 'react';

const PerfilUsuario = ({ user }) => {
  const [perfil, setPerfil] = useState({
    nombre: user.name,
    email: user.email,
    rol: user.role
  });

  const [editable, setEditable] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfil({ ...perfil, [name]: value });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Perfil de Usuario</h2>
          <button 
            onClick={() => setEditable(!editable)}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
          >
            {editable ? 'Guardar' : 'Editar'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={perfil.nombre}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-lg ${
                editable 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-transparent bg-gray-100'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={perfil.email}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-lg ${
                editable 
                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-transparent bg-gray-100'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <input
              type="text"
              value={perfil.rol}
              disabled
              className="mt-1 block w-full rounded-lg border-transparent bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Historial de Actividad</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">Solicitud de cambio de carrera - Aprobada</li>
              <li className="text-sm text-gray-600">Inscripción a curso de Programación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;