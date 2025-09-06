import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DashboardPage from '../pages/DashboardPage';
import EmployeesPage from '../pages/EmployeesPage';
import DepartmentsPage from '../pages/DepartmentsPage';
import PayrollPage from '../pages/PayrollPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

function MainApplication({ 
  employees, 
  onLogout, 
  onRefresh, 
  currentPage, 
  setCurrentPage, 
  user, 
  sidebarOpen, 
  setSidebarOpen, 
  showNotification 
}) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex'
    }}>
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        sidebarOpen={sidebarOpen}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '280px' : '80px',
        flex: 1,
        transition: 'all 0.3s ease'
      }}>
        <TopBar 
          currentPage={currentPage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          showNotification={showNotification}
        />

        {/* Page Content */}
        <main style={{ padding: '2rem' }}>
          {currentPage === 'dashboard' && (
            <DashboardPage 
              employees={employees} 
              onRefresh={onRefresh} 
              showNotification={showNotification} 
            />
          )}
          {currentPage === 'employees' && (
            <EmployeesPage 
              employees={employees} 
              onRefresh={onRefresh} 
              showNotification={showNotification} 
            />
          )}
          {currentPage === 'departments' && (
            <DepartmentsPage 
              employees={employees} 
              showNotification={showNotification} 
            />
          )}
          {currentPage === 'payroll' && (
            <PayrollPage 
              showNotification={showNotification} 
            />
          )}
          {currentPage === 'reports' && (
            <ReportsPage 
              showNotification={showNotification} 
            />
          )}
          {currentPage === 'settings' && (
            <SettingsPage 
              user={user} 
              showNotification={showNotification} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default MainApplication;
