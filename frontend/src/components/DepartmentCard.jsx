import React from 'react';

function DepartmentCard({ department, onClick, isSelected }) {
  const avgSalary = department.count > 0 ? Math.round(department.totalSalary / department.count) : 0;
  
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: isSelected ? '0 10px 25px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: isSelected ? '2px solid #667eea' : '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'translateY(-4px)' : 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginRight: '1rem'
        }}>
          🏢
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
            {department.name}
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
            {department.count} employees
          </p>
        </div>
        <div style={{
          padding: '0.5rem',
          backgroundColor: isSelected ? '#667eea' : '#f1f5f9',
          borderRadius: '8px',
          color: isSelected ? 'white' : '#64748b'
        }}>
          👁️
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
            Total Budget
          </p>
          <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
            ${department.totalSalary.toLocaleString()}
          </p>
        </div>
        <div>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
            Avg Salary
          </p>
          <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
            ${avgSalary.toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
          Positions ({department.positions.size})
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Array.from(department.positions).slice(0, 3).map((position) => (
            <span
              key={position}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}
            >
              {position}
            </span>
          ))}
          {department.positions.size > 3 && (
            <span style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#e2e8f0',
              color: '#64748b',
              borderRadius: '6px',
              fontSize: '0.75rem'
            }}>
              +{department.positions.size - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepartmentCard;
