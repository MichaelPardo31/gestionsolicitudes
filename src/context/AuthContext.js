import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('authUser', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
  };

  const register = async (email, password, nombre, rol) => {
    try {
      // Importar la función de registro desde apiClient
      const { registerUser } = await import('../api/apiClient');
      
      // Llamar a la API para registrar al usuario
      const userData = await registerUser({ email, password, nombre, rol });
      
      // Autenticar al usuario después del registro exitoso
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
