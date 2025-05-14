import React, { useState } from 'react';
import { MOCK_USERS } from '../mock/users';
import styles from './AuthLogin.module.css';

const AuthLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className={styles.loginContainer}>  
      {/* Sección del formulario */}
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Bienvenido a la Universidad de Medellín</h1>
          <p className={styles.loginSubtitle}>Inicia sesión para continuar</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          
          {error && <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>}
          
          <button type="submit" className={styles.loginButton}>
            Iniciar Sesión
          </button>
        </form>
      </div>

      {/* Sección de información */}
      <div className={styles.loginInfo}>
        <div className={styles.weatherInfo}>
          <div className={styles.weatherTemp}>23°C</div>
          <div className={styles.weatherDesc}>Mayormente nublado</div>
        </div>
        
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Búsqueda" 
            className={styles.searchInput}
          />
          
          <div className={styles.languageSelector}>
            <span className={styles.languageOption}>ESP</span>
            <span className={`${styles.languageOption} ${styles.active}`}>ENG</span>
          </div>
        </div>
        
        <div className={styles.timeInfo}>
          <div className={styles.currentTime}>11:32 a.m.</div>
          <div className={styles.currentDate}>27/04/2025</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;