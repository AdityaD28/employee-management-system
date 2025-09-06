import React from 'react';

function Notification({ notification }) {
  if (!notification) return null;

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      padding: '1rem 1.5rem',
      backgroundColor: colors[notification.type],
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
      zIndex: 10000,
      fontWeight: '500',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      {notification.message}
    </div>
  );
}

export default Notification;
