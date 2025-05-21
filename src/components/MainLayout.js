import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatbotAssistant from './ChatbotAssistant';
import SolicitudesManager from './SolicitudesManager';
import SolicitudesFinancierasE from './SolicitudesFinancierasE';
import Foro from './Foro';
import styles from './UdemTheme.module.css';
import udemLogo from '../assets/udem-logo.png';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Componente para la sección de inicio
const HomeSection = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentNoticiaIndex, setCurrentNoticiaIndex] = useState(0);
  const [currentEspacioIndex, setCurrentEspacioIndex] = useState(0);
  const noticiasIntervalRef = useRef(null);

  // Datos de ejemplo para noticias con imágenes
  const noticiasEjemplo = [
    {
      id: 1,
      titulo: "Semana de la Innovación",
      fecha: "2025-05-15",
      resumen: "Charlas y talleres sobre innovación tecnológica",
      imagen: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
    },
    {
      id: 2,
      titulo: "Noticias Campus Vivo",
      fecha: "2025-05-12",
      resumen: "Estudiantes en L'Oréal, El Teatro se renovará, docente en Congreso de Psicología",
      imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      titulo: "Teatro Universidad de Medellín se renueva",
      fecha: "2025-05-17",
      resumen: "Última función antes de iniciar obra de renovación",
      imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      titulo: "Exposición 'Vida cotidiana'",
      fecha: "2025-05-14",
      resumen: "500 fotografías que muestran escenas cotidianas de los antioqueños del siglo XX",
      imagen: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80"
    }
  ];

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
    }
  ];

  // Efecto para el carrusel automático de noticias
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setNoticias(noticiasEjemplo);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
        setLoading(false);
      }
    };
    
    fetchNoticias();

    // Configurar intervalo para el carrusel automático
    noticiasIntervalRef.current = setInterval(() => {
      setCurrentNoticiaIndex(prev => (prev + 1) % noticiasEjemplo.length);
    }, 5000);

    return () => clearInterval(noticiasIntervalRef.current);
  }, []);

  // Funciones para el carrusel de noticias
  const nextNoticia = () => {
    setCurrentNoticiaIndex(prev => (prev + 1) % noticias.length);
    resetNoticiasInterval();
  };

  const prevNoticia = () => {
    setCurrentNoticiaIndex(prev => (prev - 1 + noticias.length) % noticias.length);
    resetNoticiasInterval();
  };

  const resetNoticiasInterval = () => {
    clearInterval(noticiasIntervalRef.current);
    noticiasIntervalRef.current = setInterval(() => {
      setCurrentNoticiaIndex(prev => (prev + 1) % noticias.length);
    }, 5000);
  };

  // Funciones para el carrusel de espacios
  const nextEspacio = () => {
    setCurrentEspacioIndex(prev => (prev + 1) % espacios.length);
  };

  const prevEspacio = () => {
    setCurrentEspacioIndex(prev => (prev - 1 + espacios.length) % espacios.length);
  };

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

  return (
    <div className="space-y-8">
      {/* Sección de Noticias con Carrusel */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-bold text-red-800 p-6 pb-2">Noticias UDEM</h2>
        {loading ? (
          <div className="p-6">Cargando noticias...</div>
        ) : (
          <div className="relative">
            <div className="flex transition-transform duration-300 ease-in-out">
              {noticias.map((noticia, index) => (
                <div 
                  key={noticia.id}
                  className={`w-full flex-shrink-0 px-6 pb-6 ${index === currentNoticiaIndex ? 'block' : 'hidden'}`}
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={noticia.imagen} 
                        alt={noticia.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-red-700">{noticia.titulo}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(noticia.fecha).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-gray-700">{noticia.resumen}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Controles del carrusel de noticias */}
            <button 
              onClick={prevNoticia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-red-800 rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              aria-label="Noticia anterior"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={nextNoticia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-red-800 rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              aria-label="Siguiente noticia"
            >
              <FaChevronRight />
            </button>
            
            {/* Indicadores del carrusel */}
            <div className="flex justify-center pb-4 space-x-2">
              {noticias.map((_, index) => (
                <button
                  key={`noticia-indicator-${index}`}
                  onClick={() => {
                    setCurrentNoticiaIndex(index);
                    resetNoticiasInterval();
                  }}
                  className={`h-2 w-2 rounded-full ${
                    index === currentNoticiaIndex ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Ir a noticia ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>


<section className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-red-800 mb-6">Reserva de Espacios</h2>
  
  <div className="relative">
    {/* Controles de navegación */}
    <button 
      onClick={prevEspacio}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none"
      aria-label="Espacio anterior"
    >
      <FaChevronLeft />
    </button>
    
    {/* Tarjeta con layout horizontal - imagen a la izquierda y contenido a la derecha */}
    <div className="border border-gray-200 rounded-lg overflow-hidden mx-10 hover:shadow-md transition-shadow flex flex-row">
      {/* Imagen a la izquierda (más pequeña) */}
      <div className="w-1/3 overflow-hidden">
        <img 
          src={espacios[currentEspacioIndex % espacios.length].imagen} 
          alt={espacios[currentEspacioIndex % espacios.length].nombre}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Contenido a la derecha */}
      <div className="w-2/3 p-4">
        <h3 className="font-semibold text-lg text-red-700">
          {espacios[currentEspacioIndex % espacios.length].nombre}
        </h3>
        <p className="text-gray-600 mb-4">
          Capacidad: {espacios[currentEspacioIndex % espacios.length].capacidad}
        </p>
        
        <button 
          onClick={() => setFormularioActivo(espacios[currentEspacioIndex % espacios.length].id)}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
        >
          Reservar
        </button>
        
        {formularioActivo === espacios[currentEspacioIndex % espacios.length].id && (
          <div className="mt-4">
            <div className="border-t border-gray-200 my-3"></div>
            <form onSubmit={handleSubmit} className="space-y-2">
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
          </div>
        )}
      </div>
    </div>
    
    <button 
      onClick={nextEspacio}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none"
      aria-label="Siguiente espacio"
    >
      <FaChevronRight />
    </button>
  </div>

  {/* Indicadores del carrusel */}
  <div className="flex justify-center mt-4 space-x-2">
    {espacios.map((_, index) => (
      <button
        key={`espacio-indicator-${index}`}
        onClick={() => setCurrentEspacioIndex(index)}
        className={`h-2 w-2 rounded-full ${
          index === currentEspacioIndex % espacios.length ? 'bg-red-600' : 'bg-gray-300'
        }`}
        aria-label={`Ir a espacio ${index + 1}`}
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
             userRole === 'administrativo' ? 'Portal Administrativo' : 'Centro de Ayuda'}
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
              navigateToView={setCurrentView}
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
