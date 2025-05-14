import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import themeStyles from './UdemTheme.module.css';
import udemLogo from '../assets/udem-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <img src={udemLogo} alt="Universidad de Medellín" className={styles.loginLogo} />
          <h1 className={styles.loginTitle}>Bienvenido a la Universidad de Medellín</h1>
          <p className={styles.loginSubtitle}>Inicia sesión para continuar</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <span>Iniciando sesión...</span>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;