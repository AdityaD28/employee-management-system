import React from 'react';

function TopBar({ currentPage, sidebarOpen, setSidebarOpen, user, showNotification }) {
  return (
    <header style={{
      backgroundColor: 'white',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: '0.5rem',
            border: 'none',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '1rem',
            fontSize: '1.25rem'
          }}
        >
          ☰
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1e293b',
          textTransform: 'capitalize'
        }}>
          {currentPage}
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => showNotification('Welcome to the Employee Management System!', 'info')}
          style={{
            padding: '0.5rem',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
          title="Notifications"
        >
          🔔
        </button>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#667eea',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
