import React, { useContext, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';
import { FaBell, FaCheckDouble, FaTrash, FaCircle } from 'react-icons/fa';
import styles from './NotificationsPanel.module.css';

const NotificationsPanel = ({ onNavigate }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useContext(NotificationsContext);
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification) => {
    // Marcar como leída
    markAsRead(notification.id);
    
    // Si hay una acción asociada (como navegar a una página)
    if (notification.action && onNavigate) {
      onNavigate(notification.action.view, notification.action.params);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notifDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notifDate) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  };

  return (
    <div className={styles.notificationsContainer}>
      <button 
        className={styles.notificationButton}
        onClick={togglePanel}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.notificationsPanel}>
          <div className={styles.notificationsHeader}>
            <h3>Notificaciones</h3>
            {notifications.length > 0 && (
              <button 
                className={styles.markAllReadButton}
                onClick={markAllAsRead}
              >
                <FaCheckDouble /> Marcar todas como leídas
              </button>
            )}
          </div>

          <div className={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyNotifications}>
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.read && (
                    <FaCircle className={styles.unreadDot} />
                  )}
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>
                      {notification.title}
                    </div>
                    <div className={styles.notificationMessage}>
                      {notification.message}
                    </div>
                    <div className={styles.notificationTime}>
                      {formatTimeAgo(notification.timestamp)}
                    </div>
                  </div>
                  <button 
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
