import React from 'react';

function EmployeeCard({ employee, onEdit, onView }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginRight: '1rem'
        }}>
          {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
            {employee.first_name} {employee.last_name}
          </h3>
          <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem' }}>
            {employee.position}
          </p>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem' }}>
            {employee.email}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Department
          </p>
          <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>
            {employee.department}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Salary
          </p>
          <p style={{ margin: 0, fontWeight: '600', color: '#16a34a', fontSize: '1.125rem' }}>
            ${employee.base_salary.toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={onEdit}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#64748b'
          }}
        >
          ✏️ Edit
        </button>
        <button 
          onClick={onView}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#64748b'
          }}
        >
          👁️ View
        </button>
      </div>
    </div>
  );
}

export default EmployeeCard;
