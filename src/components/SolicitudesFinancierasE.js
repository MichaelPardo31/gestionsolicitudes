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
import becaImg from '../assets/beca.jpg';
import pagoImg from '../assets/pago.jpg';
import PagoextraImg from '../assets/pagoextra.jpg';
import reembolsoImg from '../assets/reembolso.jpg';
import convenioImg from '../assets/convenio.jpg';
import estadoImg from '../assets/estado.jpg';

const SolicitudesFinancierasE = () => {
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

  // Menú simplificado solo con Solicitudes > Financieras
  const menuStructure = {
    'Solicitudes': {
      icon: <FaFileAlt />,
      subItems: [
        { name: 'Financieras', path: '/financieras', icon: <FaMoneyBillWave /> }
      ]
    }
  };

  // Cards financieras
  const requestCards = [
    {
      title: 'Becas',
      description: 'Consulta o solicita becas',
      path: 'https://admisiones.udemedellin.edu.co/becas-descuentos-y-financiacion-de-pregrado/',
      image: becaImg,
      category: 'Financieras',
      isExternal: true
    },
    {
      title: 'Pago matricula',
      description: 'Consulta pagos de matricula',
      path: 'https://app.udem.edu.co/PagosEnLinea/',
      image: pagoImg,
      category: 'Financieras',
      isExternal: true
    },
    {
      title: 'Pago servicios extracurrículares',
      description: 'Consulta pagos de servicios extracurrículares',
      path: 'https://app.udem.edu.co/PagosEnLinea/',
      image: PagoextraImg,
      category: 'Financieras ',
      isExternal: true
    },
    {
      title: 'Reembolsos',
      description: 'Consulta y solicita reembolsos',
      path: 'https://app.udem.edu.co/PagosEnLinea/index.html',
      image: reembolsoImg,
      category: 'Financieras',
      isExternal: true
    },
    {
      title: 'Convenios Financieros ',
      description: 'Solicita convenios financieros',
      path: 'https://app.udem.edu.co/ConsultasServAcadem/',
      image: convenioImg,
      category: 'Financieras',
      isExternal: true
    },
    {
      title: 'Estado cuenta',
      description: 'Consulta estado de cuenta',
      path: 'https://app.udem.edu.co/ConsultasServAcadem/',
      image: estadoImg,
      category: 'Financieras',
      isExternal: true
    }
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
            <h2 className={styles.sectionTitle}>Financieras</h2>
            
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

export default SolicitudesFinancierasE;