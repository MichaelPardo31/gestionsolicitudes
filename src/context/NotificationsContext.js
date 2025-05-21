import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones del localStorage al iniciar y configurar escucha de eventos
  useEffect(() => {
    if (user && user.email) {
      loadNotifications();
      
      // Configurar escucha de eventos de notificaciones
      const handleNotificacionesUpdated = (event) => {
        console.log('Evento de notificaciones recibido:', event.detail);
        
        // Si la notificación es para este usuario, actualizar
        if (event.detail.action === 'create' && 
            event.detail.notificacion && 
            event.detail.notificacion.usuario === user.email) {
          
          // Agregar la nueva notificación
          const newNotification = {
            id: event.detail.notificacion.id || Date.now(),
            timestamp: event.detail.notificacion.fecha || new Date().toISOString(),
            read: false,
            title: event.detail.notificacion.titulo,
            message: event.detail.notificacion.mensaje,
            action: event.detail.notificacion.action || {
              view: 'historial',
              params: { solicitudId: event.detail.notificacion.solicitudId }
            }
          };
          
          // Actualizar el estado
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Guardar en localStorage
          try {
            const updatedNotifications = [newNotification, ...notifications];
            localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
          } catch (error) {
            console.error('Error al guardar notificaciones:', error);
          }
        } else if (event.detail.action === 'clear') {
          // Recargar todas las notificaciones
          loadNotifications();
        }
      };
      
      // Agregar escucha de eventos
      window.addEventListener('notificacionesUpdated', handleNotificacionesUpdated);
      
      // Limpiar escucha de eventos al desmontar
      return () => {
        window.removeEventListener('notificacionesUpdated', handleNotificacionesUpdated);
      };
    }
  }, [user, notifications]);

  // Cargar notificaciones del usuario desde localStorage
  const loadNotifications = () => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${user.email}`) || '[]');
      setNotifications(storedNotifications);
      
      // Contar notificaciones no leídas
      const unread = storedNotifications.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  // Agregar una nueva notificación
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount + 1);

    // Guardar en localStorage
    try {
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }

    return newNotification.id;
  };

  // Marcar una notificación como leída
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif => {
      if (notif.id === notificationId && !notif.read) {
        return { ...notif, read: true };
      }
      return notif;
    });

    setNotifications(updatedNotifications);
    
    // Actualizar contador de no leídas
    const unread = updatedNotifications.filter(notif => !notif.read).length;
    setUnreadCount(unread);

    // Guardar en localStorage
    try {
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true
    }));

    setNotifications(updatedNotifications);
    setUnreadCount(0);

    // Guardar en localStorage
    try {
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  };

  // Eliminar una notificación
  const removeNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    
    setNotifications(updatedNotifications);
    
    // Actualizar contador de no leídas
    const unread = updatedNotifications.filter(notif => !notif.read).length;
    setUnreadCount(unread);

    // Guardar en localStorage
    try {
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        loadNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
