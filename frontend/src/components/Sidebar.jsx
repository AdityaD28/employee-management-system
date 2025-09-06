import React from 'react';

function Sidebar({ currentPage, setCurrentPage, user, sidebarOpen, onLogout }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'employees', name: 'Employees', icon: '👥' },
    { id: 'departments', name: 'Departments', icon: '🏢' },
    { id: 'payroll', name: 'Payroll', icon: '💰' },
    { id: 'reports', name: 'Reports', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{
      width: sidebarOpen ? '280px' : '80px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      position: 'fixed',
      height: '100vh',
      zIndex: 1000,
      borderRight: '1px solid #e2e8f0'
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: sidebarOpen ? '1rem' : '0'
        }}>
          🏢
        </div>
        {sidebarOpen && (
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
              EMS
            </h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              Employee System
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ padding: '1rem 0' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: currentPage === item.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: currentPage === item.id ? 'white' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '0',
              fontSize: '0.9rem',
              fontWeight: currentPage === item.id ? '600' : '500'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== item.id) {
                e.target.style.backgroundColor = '#f1f5f9';
                e.target.style.color = '#334155';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== item.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#64748b';
              }
            }}
          >
            <span style={{ 
              fontSize: '1.25rem', 
              marginRight: sidebarOpen ? '0.75rem' : '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px'
            }}>
              {item.icon}
            </span>
            {sidebarOpen && item.name}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      {sidebarOpen && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              marginRight: '0.75rem'
            }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', truncate: true }}>
                {user?.email}
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
