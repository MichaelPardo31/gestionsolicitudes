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

  const register = (email, password, nombre, rol) => {
    // Mantener la función de registro como estaba o actualizar si es necesario
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Aquí se podría implementar llamada a API para registro real
        reject(new Error("Función de registro no implementada"));
      }, 500);
    });
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
