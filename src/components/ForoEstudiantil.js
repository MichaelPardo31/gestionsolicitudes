import React, { useState } from 'react';
import { MOCK_PUBLICACIONES } from '../mock/foro';

const ForoEstudiantil = () => {
  const [publicaciones, setPublicaciones] = useState(MOCK_PUBLICACIONES);
  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    titulo: '',
    contenido: ''
  });

  const handlePublicar = (e) => {
    e.preventDefault();
    const publicacion = {
      ...nuevaPublicacion,
      id: publicaciones.length + 1,
      autor: 'Usuario Actual',
      respuestas: []
    };
    setPublicaciones([...publicaciones, publicacion]);
    setNuevaPublicacion({ titulo: '', contenido: '' });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Foro Estudiantil</h2>
        
        <form onSubmit={handlePublicar} className="mb-8">
          <input
            type="text"
            value={nuevaPublicacion.titulo}
            onChange={(e) => setNuevaPublicacion({...nuevaPublicacion, titulo: e.target.value})}
            placeholder="Título de la publicación"
            className="w-full p-3 border rounded-lg mb-4"
          />
          
          <textarea
            value={nuevaPublicacion.contenido}
            onChange={(e) => setNuevaPublicacion({...nuevaPublicacion, contenido: e.target.value})}
            placeholder="Escribe tu publicación"
            className="w-full p-3 border rounded-lg mb-4 h-32"
          />
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Publicar
          </button>
        </form>

        {publicaciones.map(publicacion => (
          <div 
            key={publicacion.id} 
            className="bg-gray-50 p-4 rounded-lg mb-4 border"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{publicacion.titulo}</h3>
              <span className="text-sm text-gray-500">{publicacion.autor}</span>
            </div>
            <p className="text-gray-700 mb-4">{publicacion.contenido}</p>
            
            {publicacion.respuestas && publicacion.respuestas.map((respuesta, index) => (
              <div 
                key={index} 
                className="bg-white p-3 rounded-lg mb-2 border"
              >
                <span className="font-semibold text-sm">{respuesta.autor}: </span>
                {respuesta.contenido}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForoEstudiantil;