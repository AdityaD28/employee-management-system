import React from 'react';

function StatCard({ title, value, icon, color, change }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: color,
        borderRadius: '50%',
        transform: 'translate(30px, -30px)',
        opacity: 0.1
      }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: color,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
        {change && (
          <span style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: change.startsWith('+') ? '#dcfce7' : '#fef2f2',
            color: change.startsWith('+') ? '#16a34a' : '#dc2626',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {change}
          </span>
        )}
      </div>
      
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
        {value}
      </p>
    </div>
  );
}

export default StatCard;
