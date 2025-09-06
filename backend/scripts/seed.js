/**
 * Database Seed Script - Step 5
 * Generates fake data for testing and development
 * 
 * This script creates:
 * - Default admin user
 * - 1000+ employees across various departments
 * - Sample users for different roles
 * 
 * Run with: npm run seed
 */

require('dotenv').config();
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { testConnection, initializeDatabase } = require('../src/models/sequelize');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');

// Configuration
const TOTAL_EMPLOYEES = 1000;
const SALT_ROUNDS = 12;

// Departments and their typical job titles
const DEPARTMENTS = {
  'Engineering': [
    'Software Engineer', 'Senior Software Engineer', 'Engineering Manager',
    'DevOps Engineer', 'QA Engineer', 'Technical Lead', 'Principal Engineer'
  ],
  'Human Resources': [
    'HR Specialist', 'HR Manager', 'Recruiter', 'HR Business Partner',
    'Compensation Analyst', 'HR Director'
  ],
  'Sales': [
    'Sales Representative', 'Account Manager', 'Sales Manager',
    'Business Development Manager', 'Sales Director', 'VP of Sales'
  ],
  'Marketing': [
    'Marketing Specialist', 'Digital Marketing Manager', 'Content Manager',
    'Marketing Director', 'Brand Manager', 'Growth Manager'
  ],
  'Finance': [
    'Financial Analyst', 'Accountant', 'Finance Manager',
    'Controller', 'CFO', 'Treasury Analyst'
  ],
  'Operations': [
    'Operations Specialist', 'Operations Manager', 'Supply Chain Manager',
    'Logistics Coordinator', 'Operations Director'
  ],
  'Customer Support': [
    'Support Specialist', 'Customer Success Manager', 'Support Manager',
    'Technical Support Engineer', 'Community Manager'
  ],
  'Legal': [
    'Legal Counsel', 'Compliance Officer', 'Legal Assistant',
    'General Counsel', 'Contract Manager'
  ]
};

/**
 * Generate a random salary based on department and job title
 */
const generateSalary = (department, jobTitle) => {
  const baseSalaries = {
    'Engineering': { min: 70000, max: 180000 },
    'Human Resources': { min: 50000, max: 120000 },
    'Sales': { min: 45000, max: 150000 },
    'Marketing': { min: 50000, max: 130000 },
    'Finance': { min: 55000, max: 140000 },
    'Operations': { min: 45000, max: 110000 },
    'Customer Support': { min: 35000, max: 80000 },
    'Legal': { min: 80000, max: 200000 }
  };

  const range = baseSalaries[department] || { min: 40000, max: 100000 };
  
  // Senior/Manager roles get higher salaries
  let multiplier = 1;
  if (jobTitle.toLowerCase().includes('senior')) multiplier = 1.2;
  if (jobTitle.toLowerCase().includes('manager')) multiplier = 1.3;
  if (jobTitle.toLowerCase().includes('director')) multiplier = 1.5;
  if (jobTitle.toLowerCase().includes('vp') || jobTitle.toLowerCase().includes('cfo')) multiplier = 1.8;

  const salary = faker.number.int({ 
    min: Math.floor(range.min * multiplier), 
    max: Math.floor(range.max * multiplier) 
  });

  // Return salary in cents to avoid floating point issues
  return salary * 100;
};

/**
 * Create default system users
 */
const createDefaultUsers = async () => {
  console.log('🔧 Creating default users...');

  const defaultPassword = await bcrypt.hash('password123', SALT_ROUNDS);

  const defaultUsers = [
    {
      email: 'admindemo.com',
      password_hash: defaultPassword,
      role: 'admin',
      is_active: true
    },
    {
      email: 'hr@company.com',
      password_hash: defaultPassword,
      role: 'hr',
      is_active: true
    },
    {
      email: 'manager@company.com',
      password_hash: defaultPassword,
      role: 'manager',
      is_active: true
    }
  ];

  const createdUsers = await User.bulkCreate(defaultUsers, {
    ignoreDuplicates: true
  });

  console.log(`✅ Created ${createdUsers.length} default users`);
  return createdUsers;
};

/**
 * Create employees with realistic data
 */
const createEmployees = async () => {
  console.log(`👥 Creating ${TOTAL_EMPLOYEES} employees...`);

  const employees = [];
  const usedEmails = new Set();
  const departments = Object.keys(DEPARTMENTS);

  for (let i = 0; i < TOTAL_EMPLOYEES; i++) {
    // Pick a random department and job title
    const department = faker.helpers.arrayElement(departments);
    const jobTitle = faker.helpers.arrayElement(DEPARTMENTS[department]);
    
    // Generate unique email
    let email;
    let attempts = 0;
    do {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      email = `${firstName}.${lastName}@company.com`;
      attempts++;
      
      // Fallback if we can't generate unique email
      if (attempts > 10) {
        email = `employee${i}.${faker.string.alphanumeric(4)}@company.com`;
        break;
      }
    } while (usedEmails.has(email));
    
    usedEmails.add(email);

    // Generate employee data
    const employee = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      phone: faker.phone.number(),
      department: department,
      job_title: jobTitle,
      base_salary: generateSalary(department, jobTitle),
      date_of_joining: faker.date.between({
        from: new Date('2015-01-01'),
        to: new Date()
      }),
      status: faker.helpers.weightedArrayElement([
        { weight: 85, value: 'active' },
        { weight: 10, value: 'on_leave' },
        { weight: 4, value: 'inactive' },
        { weight: 1, value: 'terminated' }
      ]),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`
    };

    employees.push(employee);

    // Log progress every 100 employees
    if ((i + 1) % 100 === 0) {
      console.log(`  📊 Generated ${i + 1}/${TOTAL_EMPLOYEES} employees...`);
    }
  }

  // Bulk create employees for better performance
  console.log('💾 Saving employees to database...');
  const BATCH_SIZE = 100;
  let totalCreated = 0;
  
  for (let i = 0; i < employees.length; i += BATCH_SIZE) {
    const batch = employees.slice(i, i + BATCH_SIZE);
    try {
      const createdEmployees = await Employee.bulkCreate(batch, {
        ignoreDuplicates: true,
        validate: true
      });
      totalCreated += createdEmployees.length;
      console.log(`  💾 Saved batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(employees.length/BATCH_SIZE)}`);
    } catch (error) {
      console.log(`  ⚠️  Batch ${Math.floor(i/BATCH_SIZE) + 1} had errors, continuing...`);
    }
  }

  console.log(`✅ Created ${totalCreated} employees`);
  return totalCreated;
  return createdEmployees;
};

/**
 * Create some employee users (users linked to employee records)
 */
const createEmployeeUsers = async (employees) => {
  console.log('👤 Creating employee user accounts...');

  // Create user accounts for some employees (about 10%)
  const employeesToCreateUsers = faker.helpers.arrayElements(
    employees, 
    Math.min(100, Math.floor(employees.length * 0.1))
  );

  const defaultPassword = await bcrypt.hash('password123', SALT_ROUNDS);
  
  const employeeUsers = employeesToCreateUsers.map(employee => ({
    email: employee.email,
    password_hash: defaultPassword,
    role: 'employee',
    employee_id: employee.id,
    is_active: true
  }));

  const createdUsers = await User.bulkCreate(employeeUsers, {
    ignoreDuplicates: true
  });

  console.log(`✅ Created ${createdUsers.length} employee user accounts`);
  return createdUsers;
};

/**
 * Generate department statistics
 */
const generateStats = async () => {
  console.log('\n📈 Generating statistics...');

  // Count employees by department
  const departments = Object.keys(DEPARTMENTS);
  for (const dept of departments) {
    const count = await Employee.count({ where: { department: dept } });
    console.log(`  📊 ${dept}: ${count} employees`);
  }

  // Count by status
  const statuses = ['active', 'inactive', 'terminated', 'on_leave'];
  console.log('\n👥 Employee Status:');
  for (const status of statuses) {
    const count = await Employee.count({ where: { status } });
    console.log(`  📊 ${status}: ${count} employees`);
  }

  // Total counts
  const totalEmployees = await Employee.count();
  const totalUsers = await User.count();
  
  console.log('\n📋 Summary:');
  console.log(`  👥 Total Employees: ${totalEmployees}`);
  console.log(`  👤 Total Users: ${totalUsers}`);
};

/**
 * Main seed function
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to database
    await testConnection();
    await initializeDatabase();

    // Clear existing data (optional - be careful!)
    if (process.argv.includes('--reset')) {
      console.log('🗑️  Clearing existing data...');
      await User.destroy({ where: {}, force: true });
      await Employee.destroy({ where: {}, force: true });
      console.log('✅ Existing data cleared\n');
    }

    // Create data
    await createDefaultUsers();
    const employees = await createEmployees();
    await createEmployeeUsers(employees);

    // Show statistics
    await generateStats();

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n💡 Default login credentials:');
    console.log('   Admin: admin@company.com / password123');
    console.log('   HR: hr@company.com / password123');
    console.log('   Manager: manager@company.com / password123');
    console.log('   Employee accounts use their email / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run the seed script
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  createDefaultUsers,
  createEmployees
};
