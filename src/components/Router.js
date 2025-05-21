import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';
import MainLayout from './MainLayout';
import AdminPanel from './AdminPanel'; // Importa desde la carpeta
import PublicLayout from './PublicLayout';
import SolicitudesHistorial from './SolicitudesHistorial';

const Router = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={user?.rol === 'admin' ? "/admin" : "/"} /> : <Login />} 
      />
      
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to={user?.rol === 'admin' ? "/admin" : "/"} /> : <Register />} 
      />

      {/* Ruta para usuarios normales */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? (user?.rol === 'admin' ? <Navigate to="/admin" /> : <MainLayout />)
            : <PublicLayout />
        } 
      />

      {/* Ruta para historial de solicitudes de usuario */}
      <Route 
        path="/solicitudes-historial" 
        element={
          isAuthenticated && user?.rol !== 'admin'
            ? <SolicitudesHistorial />
            : <Navigate to={isAuthenticated ? "/" : "/login"} />
        }
      />

      {/* Ruta para admin */}
      <Route 
        path="/admin" 
        element={
          isAuthenticated && user?.rol === 'admin' 
            ? <AdminPanel /> 
            : <Navigate to={isAuthenticated ? "/" : "/login"} />
        } 
      />

      {/* Redirección para rutas no encontradas */}
      <Route 
        path="*" 
        element={<Navigate to="/" />} 
      />
    </Routes>
  );
};

export default Router;
