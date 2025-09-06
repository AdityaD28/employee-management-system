import React, { useState } from 'react';
import DepartmentCard from '../components/DepartmentCard';

function DepartmentsPage({ employees, showNotification }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const departmentStats = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = {
        name: emp.department,
        count: 0,
        totalSalary: 0,
        positions: new Set(),
        employees: []
      };
    }
    acc[emp.department].count++;
    acc[emp.department].totalSalary += emp.base_salary;
    acc[emp.department].positions.add(emp.position);
    acc[emp.department].employees.push(emp);
    return acc;
  }, {});

  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept);
    showNotification(`Viewing ${dept.name} department details`, 'info');
  };

  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              Department Overview
            </h2>
            <p style={{ margin: 0, color: '#64748b' }}>
              Manage and monitor departmental statistics and performance
            </p>
          </div>
          <button
            onClick={() => showNotification('Department analytics refreshed!', 'success')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📊 Refresh Analytics
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {Object.values(departmentStats).map((dept) => (
          <DepartmentCard 
            key={dept.name} 
            department={dept} 
            onClick={() => handleDepartmentClick(dept)}
            isSelected={selectedDepartment?.name === dept.name}
          />
        ))}
      </div>

      {/* Department Details Modal */}
      {selectedDepartment && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
              {selectedDepartment.name} Department Details
            </h3>
            <button
              onClick={() => setSelectedDepartment(null)}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '500', color: '#374151' }}>Employee</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '500', color: '#374151' }}>Position</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '500', color: '#374151' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '500', color: '#374151' }}>Salary</th>
                </tr>
              </thead>
              <tbody>
                {selectedDepartment.employees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#667eea',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          marginRight: '0.75rem'
                        }}>
                          {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>
                          {emp.first_name} {emp.last_name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      {emp.position}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      {emp.email}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: '600', color: '#16a34a', borderBottom: '1px solid #f1f5f9' }}>
                      ${emp.base_salary.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;
