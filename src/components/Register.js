import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css'; // Reutilizamos los estilos del login
import themeStyles from './UdemTheme.module.css';
import udemLogo from '../assets/udem-logo.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('estudiante'); // Valor predeterminado: estudiante
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, nombre, rol);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.loginContainer} ${themeStyles.udemContainer}`}>
      <div className={`${styles.loginCard} ${themeStyles.formContainer}`}>
        <div className={styles.loginHeader}>
          <img src={udemLogo} alt="Universidad de Medellín" className={styles.loginLogo} />
          <h1 className={`${styles.loginTitle} ${themeStyles.sectionTitle}`}>Registro de Usuario</h1>
          <p className={styles.loginSubtitle}>Crea una cuenta para acceder a todos los servicios</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={`${styles.inputGroup} ${themeStyles.formGroup}`}>
            <label className={`${styles.inputLabel} ${themeStyles.formLabel}`}>Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`${styles.inputField} ${themeStyles.formInput}`}
              required
            />
          </div>

          <div className={`${styles.inputGroup} ${themeStyles.formGroup}`}>
            <label className={`${styles.inputLabel} ${themeStyles.formLabel}`}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.inputField} ${themeStyles.formInput}`}
              required
            />
          </div>
          
          <div className={`${styles.inputGroup} ${themeStyles.formGroup}`}>
            <label className={`${styles.inputLabel} ${themeStyles.formLabel}`}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.inputField} ${themeStyles.formInput}`}
              required
            />
          </div>

          <div className={`${styles.inputGroup} ${themeStyles.formGroup}`}>
            <label className={`${styles.inputLabel} ${themeStyles.formLabel}`}>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.inputField} ${themeStyles.formInput}`}
              required
            />
          </div>

          <div className={`${styles.inputGroup} ${themeStyles.formGroup}`}>
            <label className={`${styles.inputLabel} ${themeStyles.formLabel}`}>Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className={`${styles.inputField} ${themeStyles.formSelect}`}
              required
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="administrativo">Administrativo</option>
            </select>
          </div>

          <div className={themeStyles.formActions}>
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.submitButton} ${themeStyles.actionButton} ${themeStyles.approveButton}`}
            >
            {isLoading ? (
              <span>Registrando...</span>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>
          </div>

          <div className={themeStyles.formFooter}>
            <p className={themeStyles.formFooterText}>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className={themeStyles.formLink}>
                Iniciar sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
