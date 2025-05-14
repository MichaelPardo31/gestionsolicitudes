import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const usersDB = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      nombre: 'Administrador',
      rol: 'admin'
    },
    {
      email: 'santiago@universidad.edu',
      password: 'estudiante',
      nombre: 'Santiago Rodriguez',
      rol: 'user'
    }
  ];

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

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = usersDB.find(u => 
          u.email === email && u.password === password
        );

        if (foundUser) {
          const userData = {
            email: foundUser.email,
            nombre: foundUser.nombre,
            rol: foundUser.rol
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('authUser', JSON.stringify(userData));
          resolve({ success: true, user: userData });
        } else {
          reject(new Error("Credenciales incorrectas"));
        }
      }, 500); 
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
  };

  const register = (email, password, nombre, rol) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verificar si el correo ya está registrado
        const userExists = usersDB.some(u => u.email === email);
        
        if (userExists) {
          reject(new Error("El correo electrónico ya está registrado"));
          return;
        }
        
        // Simulamos la creación de un nuevo usuario
        // En una aplicación real, esto se haría con una API
        
        // Mapeamos el rol seleccionado al sistema de roles de la aplicación
        // Solo 'admin' es tratado de forma especial, todos los demás son 'user'
        let sistemaRol = 'user';
        if (rol === 'administrativo') {
          sistemaRol = 'admin';
        }
        
        const newUser = {
          email,
          password,
          nombre,
          rol: sistemaRol,
          tipoUsuario: rol || 'estudiante' // Guardamos también el tipo específico de usuario
        };
        
        // En una aplicación real, aquí se enviaría la información a la API
        // y se guardaría en la base de datos
        
        // Para esta demo, simplemente iniciamos sesión con el nuevo usuario
        const userData = {
          email: newUser.email,
          nombre: newUser.nombre,
          rol: newUser.rol,
          tipoUsuario: newUser.tipoUsuario
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('authUser', JSON.stringify(userData));
        resolve({ success: true, user: userData });
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