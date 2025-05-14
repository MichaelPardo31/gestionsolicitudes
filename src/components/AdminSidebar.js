import React from 'react';
import styles from './UdemTheme.module.css';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { name: 'Solicitudes', icon: '📋' },
    { name: 'Notificaciones', icon: '🔔' },
    { name: 'Usuarios', icon: '👥' }
  ];

  return (
    <div className={styles.navContainer}>
      <nav className={styles.navButtons}>
        {sections.map((section) => (
          <button
            key={section.name}
            onClick={() => setActiveSection(section.name)}
            className={`${styles.navButton} ${
              activeSection === section.name 
                ? styles.navButtonActive 
                : styles.navButtonInactive
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;