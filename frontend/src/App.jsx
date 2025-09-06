import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import MainApplication from './components/MainApplication';
import Notification from './components/Notification';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchEmployees();
    } else {
      setLoading(false);
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching employees with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Employees data:', data);
        setEmployees(data.employees || []);
        if (data.employees?.length > 0) {
          showNotification(`Loaded ${data.employees.length} employees successfully`);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch employees:', errorData);
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setEmployees([]);
    setUser(null);
    setCurrentPage('dashboard');
    showNotification('Logged out successfully', 'info');
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok) {
        localStorage.setItem('token', data.accessToken);
        setUser(data.user);
        setIsLoggedIn(true);
        await fetchEmployees();
        showNotification('Welcome back! Login successful');
        return { success: true };
      } else {
        return { success: false, message: data.message || data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <MainApplication 
        employees={employees} 
        onLogout={handleLogout} 
        onRefresh={fetchEmployees}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showNotification={showNotification}
      />
      <Notification notification={notification} />
    </>
  );
}

export default App;
