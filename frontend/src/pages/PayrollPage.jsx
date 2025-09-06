import React, { useState, useEffect } from 'react';

function PayrollPage({ showNotification }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payrollData, setPayrollData] = useState({
    baseSalary: 0,
    overtime: 0,
    bonus: 0,
    deductions: 0,
    payPeriod: 'monthly'
  });
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchEmployees();
    loadPayrollHistory();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      loadPayrollHistory();
    }
  }, [employees]);

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

  const loadPayrollHistory = () => {
    // Load from localStorage first
    const savedPayroll = localStorage.getItem('payrollHistory');
    let existingPayroll = [];
    
    if (savedPayroll) {
      try {
        existingPayroll = JSON.parse(savedPayroll);
      } catch (error) {
        console.error('Error parsing saved payroll:', error);
      }
    }

    // Generate mock data only for employees without existing payroll records
    const updatedHistory = employees.map(emp => {
      const existing = existingPayroll.find(p => 
        p.employeeId === emp.id && 
        p.month === selectedMonth && 
        p.year === selectedYear
      );
      
      if (existing) {
        return existing;
      }
      
      // Only create mock data if no existing record
      return {
        id: `payroll_${emp.id}_${selectedMonth}_${selectedYear}`,
        employeeId: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        month: selectedMonth,
        year: selectedYear,
        baseSalary: emp.base_salary,
        overtime: 0,
        bonus: 0,
        deductions: 0,
        netPay: emp.base_salary,
        status: 'Pending'
      };
    });
    
    setPayrollHistory(updatedHistory);
  };

  const savePayrollHistory = (newHistory) => {
    // Save to localStorage
    localStorage.setItem('payrollHistory', JSON.stringify(newHistory));
    setPayrollHistory(newHistory);
  };

  const handleProcessPayroll = (employee) => {
    setSelectedEmployee(employee);
    setPayrollData({
      baseSalary: employee.base_salary,
      overtime: 0,
      bonus: 0,
      deductions: 0,
      payPeriod: 'monthly'
    });
    setShowPayrollModal(true);
  };

  const calculateNetPay = () => {
    return payrollData.baseSalary + payrollData.overtime + payrollData.bonus - payrollData.deductions;
  };

  const handleSubmitPayroll = () => {
    const newPayroll = {
      id: `payroll_${selectedEmployee.id}_${selectedMonth}_${selectedYear}`,
      employeeId: selectedEmployee.id,
      name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
      month: selectedMonth,
      year: selectedYear,
      ...payrollData,
      netPay: calculateNetPay(),
      status: 'Processed',
      processedDate: new Date().toISOString().split('T')[0]
    };

    // Get all existing payroll records
    const allPayrollRecords = JSON.parse(localStorage.getItem('payrollHistory') || '[]');
    
    // Remove any existing record for this employee/month/year
    const filteredRecords = allPayrollRecords.filter(p => 
      !(p.employeeId === selectedEmployee.id && p.month === selectedMonth && p.year === selectedYear)
    );
    
    // Add the new record
    const updatedRecords = [newPayroll, ...filteredRecords];
    
    // Save to localStorage and update state
    savePayrollHistory(updatedRecords);
    
    // Update current payroll history display
    const updatedCurrentHistory = payrollHistory.map(record => 
      record.employeeId === selectedEmployee.id ? newPayroll : record
    );
    setPayrollHistory(updatedCurrentHistory);
    
    setShowPayrollModal(false);
    showNotification(`Payroll processed for ${selectedEmployee.first_name} ${selectedEmployee.last_name}`, 'success');
  };

  const generatePayStub = (employee) => {
    showNotification(`Pay stub generated for ${employee.first_name} ${employee.last_name}`, 'success');
  };

  const getDepartmentPayrollSummary = () => {
    const summary = {};
    payrollHistory.forEach(record => {
      const emp = employees.find(e => e.id === record.id);
      const dept = emp?.department || 'Unknown';
      if (!summary[dept]) {
        summary[dept] = { employees: 0, totalPay: 0 };
      }
      summary[dept].employees++;
      summary[dept].totalPay += record.netPay;
    });
    return summary;
  };

  if (showPayrollModal) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: '#1e293b' }}>Process Payroll - {selectedEmployee?.first_name} {selectedEmployee?.last_name}</h2>
            <button
              onClick={() => setShowPayrollModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Base Salary
              </label>
              <input
                type="number"
                value={payrollData.baseSalary}
                onChange={(e) => setPayrollData(prev => ({ ...prev, baseSalary: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Overtime Pay
              </label>
              <input
                type="number"
                value={payrollData.overtime}
                onChange={(e) => setPayrollData(prev => ({ ...prev, overtime: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Bonus
              </label>
              <input
                type="number"
                value={payrollData.bonus}
                onChange={(e) => setPayrollData(prev => ({ ...prev, bonus: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Deductions
              </label>
              <input
                type="number"
                value={payrollData.deductions}
                onChange={(e) => setPayrollData(prev => ({ ...prev, deductions: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Payroll Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Base Salary:</span>
                <span>${payrollData.baseSalary.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Overtime:</span>
                <span>${payrollData.overtime.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bonus:</span>
                <span>${payrollData.bonus.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Deductions:</span>
                <span>-${payrollData.deductions.toLocaleString()}</span>
              </div>
            </div>
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '2px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              <span>Net Pay:</span>
              <span style={{ color: '#16a34a' }}>${calculateNetPay().toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={() => setShowPayrollModal(false)}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitPayroll}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Process Payroll
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
          💰 Payroll Management
        </h1>
        <p style={{ margin: 0, color: '#64748b' }}>Process employee payroll and manage compensation</p>
      </div>

      {/* Payroll Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {Object.entries(getDepartmentPayrollSummary()).map(([dept, data]) => (
          <div key={dept} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>{dept}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Employees:</span>
              <span style={{ fontWeight: '600' }}>{data.employees}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Total Pay:</span>
              <span style={{ fontWeight: '600', color: '#16a34a' }}>${data.totalPay.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Payroll Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'auto'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Employee Payroll</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Employee</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Base Salary</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const payrollRecord = payrollHistory.find(p => p.employeeId === employee.id);
              return (
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
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>
                    ${employee.base_salary.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: payrollRecord ? '#dcfce7' : '#fef3c7',
                      color: payrollRecord ? '#16a34a' : '#d97706'
                    }}>
                      {payrollRecord ? payrollRecord.status : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleProcessPayroll(employee)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}
                      >
                        Process
                      </button>
                      <button
                        onClick={() => generatePayStub(employee)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}
                      >
                        Pay Stub
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PayrollPage;
