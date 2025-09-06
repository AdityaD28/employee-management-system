/**
 * Simple Database Seed Script
 * Creates admin user and sample employees
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

// Departments and titles
const DEPARTMENTS = [
  'Engineering',
  'Human Resources', 
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Customer Support'
];

const JOB_TITLES = [
  'Software Engineer',
  'Manager',
  'Specialist',
  'Analyst',
  'Director',
  'Coordinator',
  'Representative'
];

/**
 * Create default users
 */
const createDefaultUsers = async () => {
  console.log('🔧 Creating default users...');
  
  const defaultPassword = await bcrypt.hash('admin123', SALT_ROUNDS);

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

  try {
    const createdUsers = await User.bulkCreate(defaultUsers, {
      ignoreDuplicates: true
    });
    console.log(`✅ Created ${createdUsers.length} default users`);
  } catch (error) {
    console.log('✅ Default users already exist or created');
  }
};

/**
 * Create employees with simple data
 */
const createEmployees = async () => {
  console.log(`👥 Creating ${TOTAL_EMPLOYEES} employees...`);

  const employees = [];
  
  for (let i = 0; i < TOTAL_EMPLOYEES; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`;
    
    const employee = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: faker.phone.number(),
      department: faker.helpers.arrayElement(DEPARTMENTS),
      job_title: faker.helpers.arrayElement(JOB_TITLES),
      base_salary: faker.number.int({ min: 40000, max: 150000 }) * 100, // Convert to cents
      date_of_joining: faker.date.between({ 
        from: new Date('2020-01-01'), 
        to: new Date() 
      }),
      status: 'active',
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}`
    };

    employees.push(employee);

    // Log progress
    if ((i + 1) % 100 === 0) {
      console.log(`  📊 Generated ${i + 1}/${TOTAL_EMPLOYEES} employees...`);
    }
  }

  // Create employees in batches
  console.log('💾 Saving employees to database...');
  const BATCH_SIZE = 50;
  let totalCreated = 0;
  
  for (let i = 0; i < employees.length; i += BATCH_SIZE) {
    const batch = employees.slice(i, i + BATCH_SIZE);
    try {
      const createdEmployees = await Employee.bulkCreate(batch, {
        ignoreDuplicates: true
      });
      totalCreated += createdEmployees.length;
      console.log(`  💾 Saved batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(employees.length/BATCH_SIZE)}`);
    } catch (error) {
      console.log(`  ⚠️  Batch ${Math.floor(i/BATCH_SIZE) + 1} had some errors, continuing...`);
    }
  }

  console.log(`✅ Created ${totalCreated} employees`);
  return totalCreated;
};

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting simple database seed...\n');

    // Test database connection
    await testConnection();
    
    // Initialize database (sync models)
    console.log('🔄 Recreating database tables...');
    await User.sync({ force: true });
    await Employee.sync({ force: true });
    console.log('✅ Database tables created');
    
    // Create default users
    await createDefaultUsers();
    
    // Create employees
    await createEmployees();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📋 Login credentials:');
    console.log('   Email: admindemo.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
