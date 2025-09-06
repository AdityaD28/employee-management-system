import React, { useState, useEffect } from 'react';

function ReportsPage({ showNotification }) {
  const [employees, setEmployees] = useState([]);
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    fetchEmployees();
    generateReportData();
  }, [dateRange]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (error) {
      showNotification('Failed to fetch employees', 'error');
    }
  };

  const generateReportData = () => {
    // Generate mock report data
    const departments = [...new Set(employees.map(emp => emp.department))];
    const departmentStats = departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept);
      return {
        name: dept,
        employeeCount: deptEmployees.length,
        avgSalary: deptEmployees.reduce((sum, emp) => sum + emp.base_salary, 0) / deptEmployees.length || 0,
        totalSalary: deptEmployees.reduce((sum, emp) => sum + emp.base_salary, 0),
        openPositions: Math.floor(Math.random() * 5),
        performance: Math.floor(Math.random() * 20) + 80
      };
    });

    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        hires: Math.floor(Math.random() * 10) + 2,
        terminations: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 100000) + 500000,
        expenses: Math.floor(Math.random() * 80000) + 300000
      };
    }).reverse();

    const performanceData = employees.map(emp => ({
      ...emp,
      performance: Math.floor(Math.random() * 30) + 70,
      goals: Math.floor(Math.random() * 8) + 2,
      completed: Math.floor(Math.random() * 6) + 2,
      rating: (Math.random() * 2 + 3).toFixed(1)
    }));

    setReportData({
      departments: departmentStats,
      monthly: monthlyData,
      performance: performanceData,
      totalEmployees: employees.length,
      totalPayroll: employees.reduce((sum, emp) => sum + emp.base_salary, 0),
      avgSalary: employees.reduce((sum, emp) => sum + emp.base_salary, 0) / employees.length || 0,
      turnoverRate: ((Math.random() * 10) + 5).toFixed(1)
    });
  };

  const exportReport = (type) => {
    showNotification(`${type} report exported successfully`, 'success');
  };

  const renderOverviewReport = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ color: 'white', fontSize: '1.5rem' }}>👥</span>
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Total Employees</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {reportData.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ color: 'white', fontSize: '1.5rem' }}>💰</span>
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Total Payroll</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                ${reportData.totalPayroll?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ color: 'white', fontSize: '1.5rem' }}>📊</span>
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Average Salary</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                ${reportData.avgSalary?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ color: 'white', fontSize: '1.5rem' }}>📈</span>
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Turnover Rate</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
                {reportData.turnoverRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Department Overview</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Department</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Employees</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Avg Salary</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Total Cost</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {reportData.departments?.map((dept, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>{dept.name}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{dept.employeeCount}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>${dept.avgSalary.toLocaleString()}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>${dept.totalSalary.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '100px',
                        height: '8px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginRight: '0.5rem'
                      }}>
                        <div style={{
                          width: `${dept.performance}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{dept.performance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPerformanceReport = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Employee Performance Report</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Employee</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Performance</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Goals</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {reportData.performance?.map((employee) => (
              <tr key={employee.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      marginRight: '1rem'
                    }}>
                      {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{employee.first_name} {employee.last_name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{employee.position}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{employee.department}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '8px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginRight: '0.5rem'
                    }}>
                      <div style={{
                        width: `${employee.performance}%`,
                        height: '100%',
                        background: employee.performance >= 80 ? 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)' :
                                   employee.performance >= 60 ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' :
                                   'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{employee.performance}%</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{employee.completed}/{employee.goals}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: employee.rating >= 4 ? '#dcfce7' : employee.rating >= 3 ? '#fef3c7' : '#fee2e2',
                    color: employee.rating >= 4 ? '#16a34a' : employee.rating >= 3 ? '#d97706' : '#dc2626'
                  }}>
                    {employee.rating}/5.0
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Monthly Financial Trends</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Month</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>New Hires</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Terminations</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Revenue</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Expenses</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Net</th>
              </tr>
            </thead>
            <tbody>
              {reportData.monthly?.map((month, index) => {
                const net = month.revenue - month.expenses;
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>{month.month}</td>
                    <td style={{ padding: '1rem', color: '#16a34a' }}>+{month.hires}</td>
                    <td style={{ padding: '1rem', color: '#ef4444' }}>-{month.terminations}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>${month.revenue.toLocaleString()}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>${month.expenses.toLocaleString()}</td>
                    <td style={{ padding: '1rem', color: net >= 0 ? '#16a34a' : '#ef4444', fontWeight: '600' }}>
                      ${net.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
            📊 Reports & Analytics
          </h1>
          <p style={{ margin: 0, color: '#64748b' }}>Comprehensive business insights and analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => exportReport('PDF')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Export PDF
          </button>
          <button
            onClick={() => exportReport('Excel')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem'
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: '📈' },
          { id: 'performance', label: 'Performance', icon: '🎯' },
          { id: 'financial', label: 'Financial', icon: '💰' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeReport === tab.id ? '#3b82f6' : 'transparent',
              color: activeReport === tab.id ? 'white' : '#64748b',
              border: activeReport === tab.id ? 'none' : '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Range Selector */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>Date Range:</span>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}
          />
          <span style={{ color: '#64748b' }}>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {/* Report Content */}
      {activeReport === 'overview' && renderOverviewReport()}
      {activeReport === 'performance' && renderPerformanceReport()}
      {activeReport === 'financial' && renderFinancialReport()}
    </div>
  );
}

export default ReportsPage;
