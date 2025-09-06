/**
 * Payroll Calculation Tests - Step 11
 * Unit tests for payroll calculation logic
 */

const { calculateEmployeePayroll } = require('../src/jobs/payrollWorker');

describe('Payroll Calculations', () => {
  const mockEmployee = {
    id: 'test-employee-id',
    first_name: 'John',
    last_name: 'Doe',
    base_salary: 7500000 // $75,000 in cents
  };

  const mockPayPeriod = {
    start_date: '2024-01-01',
    end_date: '2024-01-31'
  };

  beforeAll(() => {
    // Set test tax rate
    process.env.TAX_RATE = '0.10';
  });

  test('should calculate gross salary correctly', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    expect(result.gross_salary).toBe(7500000); // $75,000 in cents
    expect(result.employee_id).toBe('test-employee-id');
    expect(result.employee_name).toBe('John Doe');
  });

  test('should calculate tax deduction correctly', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    // Tax should be 10% of gross salary
    const expectedTax = Math.round(7500000 * 0.10);
    expect(result.deductions.tax).toBe(expectedTax);
  });

  test('should calculate health insurance deduction', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    // Health insurance should be 2% of gross salary
    const expectedHealthInsurance = Math.round(7500000 * 0.02);
    expect(result.deductions.health_insurance).toBe(expectedHealthInsurance);
  });

  test('should calculate 401k deduction', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    // 401k should be 5% of gross salary
    const expected401k = Math.round(7500000 * 0.05);
    expect(result.deductions.retirement_401k).toBe(expected401k);
  });

  test('should calculate total deductions correctly', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    const expectedTotalDeductions = 
      result.deductions.tax + 
      result.deductions.health_insurance + 
      result.deductions.retirement_401k;
    
    expect(result.deductions.total).toBe(expectedTotalDeductions);
  });

  test('should calculate net salary correctly', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    const expectedNetSalary = result.gross_salary - result.deductions.total;
    expect(result.net_salary).toBe(expectedNetSalary);
  });

  test('should handle different tax rates', () => {
    // Temporarily change tax rate
    const originalTaxRate = process.env.TAX_RATE;
    process.env.TAX_RATE = '0.15'; // 15%
    
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    const expectedTax = Math.round(7500000 * 0.15);
    expect(result.deductions.tax).toBe(expectedTax);
    
    // Restore original tax rate
    process.env.TAX_RATE = originalTaxRate;
  });

  test('should include pay period information', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    expect(result.pay_period.start).toBe('2024-01-01');
    expect(result.pay_period.end).toBe('2024-01-31');
  });

  test('should include currency information', () => {
    const result = calculateEmployeePayroll(mockEmployee, mockPayPeriod);
    
    expect(result.currency).toBe(process.env.PAYROLL_CURRENCY || 'USD');
  });

  test('should handle zero salary', () => {
    const zeroSalaryEmployee = {
      ...mockEmployee,
      base_salary: 0
    };
    
    const result = calculateEmployeePayroll(zeroSalaryEmployee, mockPayPeriod);
    
    expect(result.gross_salary).toBe(0);
    expect(result.deductions.tax).toBe(0);
    expect(result.deductions.health_insurance).toBe(0);
    expect(result.deductions.retirement_401k).toBe(0);
    expect(result.net_salary).toBe(0);
  });

  test('should handle high salary values', () => {
    const highSalaryEmployee = {
      ...mockEmployee,
      base_salary: 50000000 // $500,000 in cents
    };
    
    const result = calculateEmployeePayroll(highSalaryEmployee, mockPayPeriod);
    
    expect(result.gross_salary).toBe(50000000);
    expect(result.net_salary).toBeLessThan(result.gross_salary);
    expect(result.deductions.total).toBeGreaterThan(0);
  });
});
