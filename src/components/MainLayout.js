import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatbotAssistant from './ChatbotAssistant';
import SolicitudesManager from './SolicitudesManager';
import SolicitudesFinancierasE from './SolicitudesFinancierasE';
import Foro from './Foro';
import styles from './UdemTheme.module.css';
import udemLogo from '../assets/udem-logo.png';

// Componente para la sección de inicio
const HomeSection = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Datos de ejemplo para reservas
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

  // Funciones para el carrusel
  const scrollRight = () => {
    if (currentIndex < espacios.length - 3) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(espacios.length - 3);
    }
  };

  // Simulación de API de noticias
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
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
    titulo: "Noticias Campus Vivo del 12 al 16 de mayo",
    fecha: "2025-05-12",
    resumen: "Estudiantes en L’Oréal, El Teatro se renovará, docente en Congreso de Psicología, Frecuencia U celebra 13 años y dona tu jean en NCV 179"
  },
  {
    id: 3,
    titulo: "El Teatro Universidad de Medellín se renueva",
    fecha: "2025-05-17",
    resumen: "El próximo 17 de mayo será la última función en el Teatro de la Universidad de Medellín antes de iniciar una ambiciosa obra de renovación"
  },
  {
    id: 4,
    titulo: "Exposición ‘Vida cotidiana’ revive la memoria de Medellín",
    fecha: "2025-05-14",
    resumen: "Son cerca de 500 fotografías, rescatadas de la basura y de centros de reciclaje y muestran escenas cotidianas de los antioqueños del siglo XX"
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

  // Estado para el formulario de reserva
  const [formularioActivo, setFormularioActivo] = useState(null);
  const [reservaDatos, setReservaDatos] = useState({
    nombre: '',
    fecha: '',
    hora: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservaDatos({ ...reservaDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reserva realizada para: ${reservaDatos.nombre} - ${reservaDatos.fecha} a las ${reservaDatos.hora}`);
    setFormularioActivo(null);
    setReservaDatos({ nombre: '', fecha: '', hora: '' });
  };

  // Elementos visibles en el carrusel
  const visibleEspacios = espacios.slice(currentIndex, currentIndex + 3);
  if (visibleEspacios.length < 3) {
    visibleEspacios.push(...espacios.slice(0, 3 - visibleEspacios.length));
  }

  return (
    <div className="space-y-8">
      {/* Sección de Noticias */}
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

      {/* Sección de Reserva de Espacios */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-red-800 mb-6">Reserva de Espacios</h2>
        <div className="relative">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none"
            aria-label="Anterior"
          >
            {/* Icono flecha izquierda */}
          </button>
          
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
                  <button 
                    onClick={() => setFormularioActivo(espacio.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                  >
                    Reservar
                  </button>
                  
                  {formularioActivo === espacio.id && (
  <form onSubmit={handleSubmit} className="mt-4 space-y-2">
    <input 
      type="text" 
      name="nombre" 
      placeholder="Tu nombre" 
      value={reservaDatos.nombre} 
      onChange={handleChange} 
      className="w-full p-2 border rounded"
      required
    />
    <input 
      type="date" 
      name="fecha" 
      value={reservaDatos.fecha} 
      onChange={handleChange} 
      className="w-full p-2 border rounded"
      required
    />
    <input 
      type="time" 
      name="hora" 
      value={reservaDatos.hora} 
      onChange={handleChange} 
      className="w-full p-2 border rounded"
      required
    />
    <div className="flex justify-end gap-2">
      <button 
        type="submit" 
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Confirmar
      </button>
      <button 
        type="button" 
        onClick={() => setFormularioActivo(null)} 
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Cancelar
      </button>
    </div>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none"
            aria-label="Siguiente"
          >
            {/* Icono flecha derecha */}
          </button>
        </div>

        {/* Indicadores del carrusel */}
        <div className="flex justify-center mt-4 space-x-2">
          {espacios.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-red-600' : 'bg-gray-300'
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const MainLayout = ({ onCreateSolicitud }) => {
  const [currentView, setCurrentView] = useState('home');
  const { user, logout } = useContext(AuthContext);
  const userRole = user?.rol || 'estudiante';

  return (
    <div className={styles.udemContainer}>
      {/* Header */}
      <header className={styles.udemHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img src={udemLogo} alt="Universidad de Medellín" className={styles.logo} />
          </div>
          <h1 className={styles.pageTitle}>
            {userRole === 'admin' ? 'Panel Administrativo' : 
             userRole === 'profesor' ? 'Portal Docente' : 
             userRole === 'administrativo' ? 'Portal Administrativo' : 'Portal Estudiantil'}
          </h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.nombre || 'Usuario'}</span>
            <button onClick={logout} className={styles.logoutButton}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Barra de navegación */}
      <div className={styles.mainContent}>
        <nav className={styles.navContainer}>
          <div className={styles.navButtons}>
            <button
              onClick={() => setCurrentView('home')}
              className={`${styles.navButton} ${currentView === 'home' ? styles.navButtonActive : ''}`}
            >
              Inicio
            </button>
            <button
              onClick={() => setCurrentView('chatbot')}
              className={`${styles.navButton} ${currentView === 'chatbot' ? styles.navButtonActive : ''}`}
            >
              Asistente Virtual
            </button>
            <button
              onClick={() => setCurrentView('solicitudes')}
              className={`${styles.navButton} ${currentView === 'solicitudes' ? styles.navButtonActive : ''}`}
            >
              Solicitudes
            </button>
            <button
              onClick={() => setCurrentView('foro')}
              className={`${styles.navButton} ${currentView === 'foro' ? styles.navButtonActive : ''}`}
            >
              Foro
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`${styles.navButton} ${currentView === 'admin' ? styles.navButtonActive : ''}`}
              >
                Administración
              </button>
            )}
          </div>
        </nav>

        {/* Contenido principal */}
        <main>
          {currentView === 'home' && <HomeSection />}
          {currentView === 'chatbot' && <ChatbotAssistant />}
          {currentView === 'solicitudes' && (
            <SolicitudesManager 
              onCreateSolicitud={onCreateSolicitud}
              navigateToView={setCurrentView} // Pasamos la función de navegación
            />
          )}
          {currentView === 'financieras' && <SolicitudesFinancierasE />}
          {currentView === 'foro' && <Foro />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;