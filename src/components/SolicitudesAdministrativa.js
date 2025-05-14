import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SolicitudesManager.module.css';
import { 
  FaFileAlt,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronRight,
  FaExternalLinkAlt
} from 'react-icons/fa';

// Importa tus imágenes
import certificadoImg from '../assets/certificado.jpeg';
import cancelacionImg from '../assets/cancelacion.jpeg';
import datosImg from '../assets/datos.jpg';


const SolicitudesAdministrativa = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({
    'Solicitudes': true
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const menuStructure = {
    'Solicitudes': {
      icon: <FaFileAlt />,
      subItems: [
        { name: 'Administrativas', path: '/Administrativas', icon: <FaMoneyBillWave /> }
      ]
    }
  };

  // Cards financieras
  const requestCards = [
    {
      title: 'Certificados',
      description: 'Consulta o solicita certificados',
      path: 'https://app.udem.edu.co/ConsultasServAcadem/',
      image: certificadoImg,
      category: 'Administrativas',
      isExternal: true
    },
    {
      title: 'Cancelación materias',
      description: 'Solicita cancelar una materia',
      path: 'https://app.udem.edu.co/ServiciosEnLinea/login.html',
      image: cancelacionImg,
      category: 'Administrativas',
      isExternal: true
    },
    {
      title: 'Actualización datos',
      description: 'Solicita actualización de datos personales',
      path: 'https://app.udem.edu.co/ActualizacionDatos/login.html',
      image: datosImg,
      category: 'Administrativas ',
      isExternal: true
    },
  ];

  const handleNavigation = (path, isExternal = false) => {
    if (isExternal) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <div className={styles.portalContainer}>
      {/* Header simplificado sin perfil */}
      <header className={styles.mainTitle}>
        <h1>Portal Estudiantil</h1>
      </header>

      <div className={styles.contentWrapper}>
        {/* Menú lateral */}
        <aside className={styles.navigationSidebar}>
          <h2 className={styles.sectionTitle}>Solicitudes</h2>
          <nav className={styles.menuNav}>
            {Object.keys(menuStructure).map((category) => (
              <div key={category} className={styles.menuCategory}>
                <div 
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(category)}
                >
                  <div className={styles.categoryTitle}>
                    {menuStructure[category].icon}
                    <span>{category}</span>
                  </div>
                  {expandedCategories[category] ? 
                    <FaChevronDown className={styles.chevron} /> : 
                    <FaChevronRight className={styles.chevron} />
                  }
                </div>

                {expandedCategories[category] && (
                  <div className={styles.subItems}>
                    {menuStructure[category].subItems.map((item) => (
                      <div
                        key={item.name}
                        className={styles.subItem}
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.icon && <span className={styles.subItemIcon}>{item.icon}</span>}
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className={styles.mainContent}>
          <section className={styles.solicitudesSection}>
            <h2 className={styles.sectionTitle}>Administrativas</h2>
            
            <div className={styles.requestCards}>
              {requestCards.map((card) => (
                <div 
                  key={card.title} 
                  className={styles.requestCard}
                  onClick={() => handleNavigation(card.path, card.isExternal)}
                >
                  <div className={styles.cardImageContainer}>
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className={styles.cardImage}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3>
                      {card.title}
                      {card.isExternal && <FaExternalLinkAlt className={styles.externalLinkIcon} />}
                    </h3>
                    <p>{card.description}</p>
                    <div className={styles.clickHint}>Haz clic para solicitar</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SolicitudesAdministrativa;