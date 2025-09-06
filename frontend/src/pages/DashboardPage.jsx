import React from 'react';
import StatCard from '../components/StatCard';

function DashboardPage({ employees, onRefresh, showNotification }) {
  const totalEmployees = employees.length;
  const departments = new Set(employees.map(emp => emp.department)).size;
  const averageSalary = employees.length 
    ? Math.round(employees.reduce((sum, emp) => sum + emp.base_salary, 0) / employees.length) 
    : 0;
  
  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const recentEmployees = employees.slice(0, 5);

  return (
    <div>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon="👥"
          color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          change="+12%"
        />
        <StatCard
          title="Departments"
          value={departments}
          icon="🏢"
          color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          change="+2"
        />
        <StatCard
          title="Average Salary"
          value={`$${averageSalary.toLocaleString()}`}
          icon="💰"
          color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          change="+5.2%"
        />
        <StatCard
          title="Active Projects"
          value="24"
          icon="📋"
          color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          change="+8"
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Department Distribution */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
            Department Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(departmentStats).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{dept}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / totalEmployees) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <span style={{ fontWeight: '600', color: '#1e293b', minWidth: '20px' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Employees */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
              Recent Employees
            </h3>
            <button
              onClick={onRefresh}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#64748b'
              }}
            >
              🔄 Refresh
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentEmployees.map((emp) => (
              <div key={emp.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
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
                  {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' }}>
                    {emp.first_name} {emp.last_name}
                  </p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                    {emp.position} • {emp.department}
                  </p>
                </div>
                <span style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: '600' }}>
                  ${emp.base_salary.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
