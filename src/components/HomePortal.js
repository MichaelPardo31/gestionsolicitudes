import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './HomePortal.module.css';
import { FaNewspaper, FaCalendarAlt, FaGraduationCap, FaBullhorn, FaBook } from 'react-icons/fa';

const HomePortal = () => {
  const [data, setData] = useState({ noticias: [], eventos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/noticias-eventos');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Error al cargar los datos: {error}</p>
        <button 
          className={styles.retryButton} 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.portalContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Portal UdeM</h1>
        <nav className={styles.nav}>
          <button
            onClick={() => handleNavigation('/inicio')}
            className={`${styles.navLink} ${isActive('/inicio') ? styles.active : ''}`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavigation('/noticias')}
            className={`${styles.navLink} ${isActive('/noticias') ? styles.active : ''}`}
          >
            Noticias
          </button>
          <button
            onClick={() => handleNavigation('/eventos')}
            className={`${styles.navLink} ${isActive('/eventos') ? styles.active : ''}`}
          >
            Eventos
          </button>
          <button
            onClick={() => handleNavigation('/calendario')}
            className={`${styles.navLink} ${isActive('/calendario') ? styles.active : ''}`}
          >
            Calendario
          </button>
          <button
            onClick={() => handleNavigation('/ayuda')}
            className={`${styles.navLink} ${isActive('/ayuda') ? styles.active : ''}`}
          >
            Ayuda
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><FaNewspaper className={styles.icon} /> Noticias recientes</h2>
          {data.noticias.length > 0 ? (
            <ul className={styles.list}>
              {data.noticias.map((n, i) => (
                <li key={i} className={styles.listItem}>
                  <div className={styles.newsItem}>
                    <h3 className={styles.newsTitle}>{n.titulo}</h3>
                    <p className={styles.newsContent}>{n.contenido}</p>
                    {n.fecha && <span className={styles.newsDate}>{n.fecha}</span>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>No hay noticias disponibles</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><FaCalendarAlt className={styles.icon} /> Eventos y fechas importantes</h2>
          {data.eventos.length > 0 ? (
            <ul className={styles.list}>
              {data.eventos.map((e, i) => (
                <li key={i} className={styles.listItem}>
                  <div className={styles.eventItem}>
                    <h3 className={styles.eventTitle}>{e.titulo}</h3>
                    <p className={styles.eventDescription}>{e.descripcion}</p>
                    <div className={styles.eventDetails}>
                      <span className={styles.eventDate}>{e.fecha}</span>
                      {e.lugar && <span className={styles.eventLocation}>{e.lugar}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>No hay eventos próximos</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><FaGraduationCap className={styles.icon} /> Accesos rápidos</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <a 
                href="https://udemedellin.edu.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                Página Principal UdeM
              </a>
            </li>
            <li className={styles.listItem}>
              <a 
                href="https://uvirtual.udemedellin.edu.co/login/index.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                Campus Virtual
              </a>
            </li>
            <li className={styles.listItem}>
              <a 
                href="https://biblioteca.udemedellin.edu.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                Biblioteca
              </a>
            </li>
            <li className={styles.listItem}>
              <button 
                onClick={() => handleNavigation('/solicitudes')}
                className={styles.internalLink}
              >
                Solicitudes
              </button>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><FaBullhorn className={styles.icon} /> Anuncios y alertas</h2>
          <p className={styles.sectionContent}>Comunicados oficiales, cierres, novedades del sistema, etc.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><FaBook className={styles.icon} /> Programas destacados</h2>
          <p className={styles.sectionContent}>Información sobre carreras, posgrados o diplomados nuevos.</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Universidad de Medellín. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePortal;