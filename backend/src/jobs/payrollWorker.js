/**
 * Payroll Worker - Step 7
 * Processes payroll calculation jobs and generates payslips
 * 
 * This worker handles:
 * - Calculating payroll for specified periods and employees
 * - Generating payslip files (PDF)
 * - Storing payroll records
 * - Sending email notifications (optional)
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { payrollQueue, emailQueue } = require('./queues');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

// Ensure payroll directories exist
const PAYSLIPS_DIR = path.join(__dirname, '../../payslips');
const PAYROLLS_DIR = path.join(__dirname, '../../payrolls');

/**
 * Initialize directories for payroll files
 */
const initializeDirectories = async () => {
  try {
    await fs.mkdir(PAYSLIPS_DIR, { recursive: true });
    await fs.mkdir(PAYROLLS_DIR, { recursive: true });
    console.log('📁 Payroll directories initialized');
  } catch (error) {
    console.error('Error creating payroll directories:', error.message);
  }
};

/**
 * Calculate payroll for an employee
 * Simple calculation for demonstration - expand for production use
 */
const calculateEmployeePayroll = (employee, payPeriod) => {
  const { start_date, end_date } = payPeriod;
  
  // Basic calculation (monthly salary)
  const grossSalary = employee.base_salary; // Already in cents
  
  // Tax calculation (configurable via environment)
  const taxRate = parseFloat(process.env.TAX_RATE) || 0.10;
  const tax = Math.round(grossSalary * taxRate);
  
  // Other deductions (placeholder for future expansion)
  const healthInsurance = Math.round(grossSalary * 0.02); // 2%
  const retirement401k = Math.round(grossSalary * 0.05); // 5%
  
  const totalDeductions = tax + healthInsurance + retirement401k;
  const netSalary = grossSalary - totalDeductions;
  
  return {
    employee_id: employee.id,
    employee_name: `${employee.first_name} ${employee.last_name}`,
    pay_period: {
      start: start_date,
      end: end_date
    },
    gross_salary: grossSalary,
    deductions: {
      tax: tax,
      health_insurance: healthInsurance,
      retirement_401k: retirement401k,
      total: totalDeductions
    },
    net_salary: netSalary,
    currency: process.env.PAYROLL_CURRENCY || 'USD'
  };
};

/**
 * Format currency for display
 */
const formatCurrency = (amountInCents, currency = 'USD') => {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Generate PDF payslip
 */
const generatePayslipPDF = async (payrollData) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `payslip_${payrollData.employee_id}_${payrollData.pay_period.start}_${payrollData.pay_period.end}.pdf`;
      const filePath = path.join(PAYSLIPS_DIR, fileName);
      
      const doc = new PDFDocument();
      const stream = fsSync.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Header
      doc.fontSize(20).text('PAYSLIP', 50, 50);
      doc.fontSize(12).text(`Pay Period: ${payrollData.pay_period.start} to ${payrollData.pay_period.end}`, 50, 80);
      
      // Employee Info
      doc.fontSize(14).text('Employee Information', 50, 120);
      doc.fontSize(11)
         .text(`Name: ${payrollData.employee_name}`, 50, 145)
         .text(`Employee ID: ${payrollData.employee_id}`, 50, 160);
      
      // Earnings
      doc.fontSize(14).text('Earnings', 50, 200);
      doc.fontSize(11)
         .text(`Gross Salary: ${formatCurrency(payrollData.gross_salary, payrollData.currency)}`, 50, 225);
      
      // Deductions
      doc.fontSize(14).text('Deductions', 50, 260);
      doc.fontSize(11)
         .text(`Tax: ${formatCurrency(payrollData.deductions.tax, payrollData.currency)}`, 50, 285)
         .text(`Health Insurance: ${formatCurrency(payrollData.deductions.health_insurance, payrollData.currency)}`, 50, 300)
         .text(`401(k): ${formatCurrency(payrollData.deductions.retirement_401k, payrollData.currency)}`, 50, 315)
         .text(`Total Deductions: ${formatCurrency(payrollData.deductions.total, payrollData.currency)}`, 50, 330);
      
      // Net Pay
      doc.fontSize(16).text(`NET PAY: ${formatCurrency(payrollData.net_salary, payrollData.currency)}`, 50, 370);
      
      // Footer
      doc.fontSize(10).text('This is a computer-generated payslip.', 50, 450);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 50, 465);
      
      doc.end();
      
      stream.on('finish', () => {
        resolve({
          fileName,
          filePath,
          relativePath: `payslips/${fileName}`
        });
      });
      
      stream.on('error', reject);
      
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Main payroll processing function
 */
const processPayroll = async (job) => {
  const { payPeriod, filters = {}, options = {} } = job.data;
  
  try {
    console.log(`🧮 Starting payroll processing for period ${payPeriod.start_date} to ${payPeriod.end_date}`);
    
    // Build query conditions
    const whereConditions = {
      status: 'active' // Only process active employees
    };
    
    // Apply filters
    if (filters.department) {
      whereConditions.department = filters.department;
    }
    
    if (filters.employee_ids && filters.employee_ids.length > 0) {
      whereConditions.id = {
        [Op.in]: filters.employee_ids
      };
    }
    
    // Fetch eligible employees
    const employees = await Employee.findAll({
      where: whereConditions,
      order: [['last_name', 'ASC'], ['first_name', 'ASC']]
    });
    
    if (employees.length === 0) {
      throw new Error('No eligible employees found for payroll processing');
    }
    
    console.log(`👥 Processing payroll for ${employees.length} employees`);
    
    const payrollResults = [];
    const payslipFiles = [];
    
    // Process each employee
    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      
      // Update job progress
      const progress = Math.round(((i + 1) / employees.length) * 100);
      await job.progress(progress);
      
      try {
        // Calculate payroll
        const payrollData = calculateEmployeePayroll(employee, payPeriod);
        payrollResults.push(payrollData);
        
        // Generate payslip PDF
        if (!options.skipPayslips) {
          const payslipFile = await generatePayslipPDF(payrollData);
          payslipFiles.push(payslipFile);
          
          // Optional: Queue email job to send payslip
          if (options.sendEmails && employee.email) {
            await emailQueue.add('send-payslip', {
              to: employee.email,
              employeeName: payrollData.employee_name,
              payslipPath: payslipFile.filePath,
              payPeriod: payPeriod
            });
          }
        }
        
        console.log(`✅ Processed payroll for ${employee.first_name} ${employee.last_name}`);
        
      } catch (employeeError) {
        console.error(`❌ Error processing payroll for employee ${employee.id}:`, employeeError.message);
        // Continue with other employees
      }
    }
    
    // Save payroll summary
    const payrollSummary = {
      id: `payroll_${Date.now()}`,
      pay_period: payPeriod,
      processed_at: new Date().toISOString(),
      total_employees: payrollResults.length,
      total_gross: payrollResults.reduce((sum, p) => sum + p.gross_salary, 0),
      total_deductions: payrollResults.reduce((sum, p) => sum + p.deductions.total, 0),
      total_net: payrollResults.reduce((sum, p) => sum + p.net_salary, 0),
      currency: process.env.PAYROLL_CURRENCY || 'USD',
      filters: filters,
      options: options,
      payroll_items: payrollResults,
      payslip_files: payslipFiles.map(f => f.relativePath)
    };
    
    // Save summary to JSON file
    const summaryFileName = `payroll_summary_${payPeriod.start_date}_${payPeriod.end_date}_${Date.now()}.json`;
    const summaryPath = path.join(PAYROLLS_DIR, summaryFileName);
    await fs.writeFile(summaryPath, JSON.stringify(payrollSummary, null, 2));
    
    console.log(`✅ Payroll processing completed. Summary saved to ${summaryFileName}`);
    
    return {
      success: true,
      summary: {
        payroll_id: payrollSummary.id,
        employees_processed: payrollResults.length,
        total_gross: formatCurrency(payrollSummary.total_gross),
        total_net: formatCurrency(payrollSummary.total_net),
        payslips_generated: payslipFiles.length,
        summary_file: summaryFileName
      }
    };
    
  } catch (error) {
    console.error('❌ Payroll processing failed:', error.message);
    throw error;
  }
};

/**
 * Set up queue processors
 */
const initializeWorkers = async () => {
  await initializeDirectories();
  
  // Process payroll jobs
  payrollQueue.process('process-payroll', 1, processPayroll); // Process one at a time
  
  // TODO: Add email worker in future
  // emailQueue.process('send-payslip', sendPayslipEmail);
  
  console.log('👷 Payroll workers initialized');
};

module.exports = {
  initializeWorkers,
  processPayroll,
  calculateEmployeePayroll,
  generatePayslipPDF
};
