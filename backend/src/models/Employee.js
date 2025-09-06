/**
 * Employee Model - Step 4
 * Represents company employees with their personal and job information
 * 
 * Fields:
 * - id: UUID primary key
 * - first_name, last_name: Employee name
 * - email: Work email (unique)
 * - phone: Contact number
 * - department: Department name
 * - job_title: Job position
 * - base_salary: Annual salary in cents (to avoid floating point issues)
 * - date_of_joining: When employee started
 * - status: Employment status
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for the employee'
  },
  
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    comment: 'Employee first name'
  },
  
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    comment: 'Employee last name'
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'Work email address (must be unique)'
  },
  
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[\+]?[\d\s\-\(\)]+$/ // Basic phone number validation
    },
    comment: 'Contact phone number'
  },
  
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Department/division name'
  },
  
  job_title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Job title/position'
  },
  
  base_salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'Annual base salary in cents (divide by 100 for dollars)'
  },
  
  date_of_joining: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString() // Can't join in the future
    },
    comment: 'Date when employee joined the company'
  },
  
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'terminated', 'on_leave'),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Current employment status'
  },
  
  manager_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Employee ID of direct manager'
  },
  
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Employee address'
  }
}, {
  tableName: 'employees',
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['department']
    },
    {
      fields: ['status']
    },
    {
      fields: ['manager_id']
    }
  ]
});

// Virtual fields
Employee.prototype.getFullName = function() {
  return `${this.first_name} ${this.last_name}`;
};

Employee.prototype.getSalaryInDollars = function() {
  return (this.base_salary / 100).toFixed(2);
};

// Instance method to calculate years of service
Employee.prototype.getYearsOfService = function() {
  const today = new Date();
  const joinDate = new Date(this.date_of_joining);
  const years = today.getFullYear() - joinDate.getFullYear();
  const monthDiff = today.getMonth() - joinDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
    return Math.max(0, years - 1);
  }
  return years;
};

module.exports = Employee;
