import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const PublicHome = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Datos de ejemplo para reservas (reemplazar con API real)
  const espacios = [
    {
      id: 1,
      nombre: "Auditorio Principal",
      imagen: "https://media.gettyimages.com/id/521064316/es/foto/empty-theater-stage.jpg?s=612x612&w=0&k=20&c=_Rg2toxqulGgYNg_jGHayM_MKyNU2BL0YforZ5IaWeM=",
      capacidad: "200 personas"
    },
    {
      id: 2,
      nombre: "Sala de Conferencias",
      imagen: "https://images.unsplash.com/photo-1628062699790-7c45262b82b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbGElMjBkZSUyMHJldW5pb25lc3xlbnwwfHwwfHx8MA%3D%3D",
      capacidad: "50 personas"
    },
    {
      id: 3,
      nombre: "Laboratorio de Computación",
      imagen: "https://img.freepik.com/foto-gratis/cientifico-profesional-gafas-realidad-virtual-innovacion-medica-laboratorio-equipo-investigadores-que-trabajan-equipo-dispositivo-futuro-medicina-salud-profesional-vision-simulador_482257-12838.jpg?semt=ais_hybrid&w=740",
      capacidad: "30 personas"
    },
    {
      id: 4,
      nombre: "Coliseo",
      imagen: "https://images.unsplash.com/photo-1630420598913-44208d36f9af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnV0c2FsfGVufDB8fDB8fHww",
      capacidad: "1000 personas"
    },
    {
      id: 5,
      nombre: "Cancha de Fútbol 11 (Grama Sintética)",
      imagen: "https://images.unsplash.com/photo-1510051640316-cee39563ddab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FuY2hhJTIwZGUlMjBmdXRib2x8ZW58MHx8MHx8fDA%3D",
      capacidad: "22 jugadores"
    },
    {
      id: 6,
      nombre: "Canchas de Tenis de Campo",
      imagen: "https://media.istockphoto.com/id/2155734323/es/foto/clay-tennis-court.webp?a=1&b=1&s=612x612&w=0&k=20&c=9-OUi8A7r5l3G_o4vQV2fV0IuVpRGwj0vCdCEmNHOFw=",
      capacidad: "4 personas por cancha"
    },
    {
      id: 7,
      nombre: "Laboratorio de Electrónica",
      imagen: "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWxlY3Ryb25pY2F8ZW58MHx8MHx8fDA%3D",
      capacidad: "25 personas"
    }
  ];

  // Función para avanzar al siguiente conjunto de tarjetas
  const scrollRight = () => {
    if (currentIndex < espacios.length - 3) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Volver al principio si llegamos al final
    }
  };

  // Función para retroceder al conjunto anterior de tarjetas
  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(espacios.length - 3); // Ir al final si estamos en el principio
    }
  };

  // Simulación de API de noticias
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // En producción, reemplazar con:
        // const response = await fetch('https://api.udem.edu.co/noticias');
        // const data = await response.json();
        
        // Datos de ejemplo
        const data = [
          {
            id: 1,
            titulo: "Semana de la Innovación",
            fecha: "2025-05-15",
            resumen: "Charlas y talleres sobre innovación tecnológica"
          },
          {
            id: 2,
            titulo: "Nuevo laboratorio de IA",
            fecha: "2025-05-19",
            resumen: "Ya puedes inscribirte para usar el nuevo laboratorio de Inteligencia Artificial."
          }
        ];
        setNoticias(data);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // Obtener los elementos visibles actualmente en el carrusel
  const visibleEspacios = espacios.slice(currentIndex, currentIndex + 3);
  
  // Si no hay suficientes elementos para mostrar 3, completar con elementos del principio
  if (visibleEspacios.length < 3) {
    const remainingCount = 3 - visibleEspacios.length;
    const additionalItems = espacios.slice(0, remainingCount);
    visibleEspacios.push(...additionalItems);
  }

  return (
    <div className="space-y-8">
      {/* Sección de Noticias UDEM */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-red-800 mb-6">Noticias UDEM</h2>
        {loading ? (
          <p>Cargando noticias...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {noticias.map(noticia => (
              <div key={noticia.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-red-700">{noticia.titulo}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(noticia.fecha).toLocaleDateString('es-ES')}
                </p>
                <p className="text-gray-700">{noticia.resumen}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sección de Reserva de Espacios con Carrusel */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-red-800 mb-6">Espacios Disponibles</h2>
        
        <div className="relative">
          {/* Botón Anterior */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Contenedor del Carrusel */}
          <div 
            ref={scrollContainerRef}
            className="grid grid-cols-3 gap-6 px-10 transition-all duration-300 ease-in-out"
          >
            {visibleEspacios.map(espacio => (
              <div key={`visible-${espacio.id}`} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={espacio.imagen} 
                  alt={espacio.nombre} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-red-700">{espacio.nombre}</h3>
                  <p className="text-gray-600 mb-4">Capacidad: {espacio.capacidad}</p>
                  <div className="text-center p-2 bg-gray-100 rounded-lg">
                    <p className="text-gray-700 text-sm mb-2">Es necesario iniciar sesión para reservar</p>
                    <Link 
                      to="/login" 
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Ir a iniciar sesión →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón Siguiente */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none"
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Sección Informativa */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-red-800 mb-6">Sobre la Universidad</h2>
        <div className="prose max-w-none">
          <p>La Universidad de Medellín es una institución de educación superior comprometida con la excelencia académica y la formación integral de sus estudiantes.</p>
          <p className="mt-4">Ofrecemos una amplia variedad de programas académicos, instalaciones modernas y un ambiente propicio para el desarrollo personal y profesional.</p>
          <div className="mt-6">
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
              >
                Iniciar sesión
              </Link>
              <Link 
                to="/register" 
                className="inline-block bg-white border border-red-600 text-red-600 py-2 px-6 rounded-lg hover:bg-red-50 transition"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
