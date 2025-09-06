/**
 * Sequelize Database Instance - Step 4
 * Creates and exports the main Sequelize instance for database operations
 * 
 * For beginners: We use sequelize.sync() instead of migrations for simplicity
 * In production, you should use proper migrations for schema changes
 */

const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Connection pool settings for better performance
  pool: {
    max: 10,     // Maximum number of connections
    min: 0,      // Minimum number of connections
    acquire: 30000, // Maximum time to get connection (ms)
    idle: 10000     // Maximum time connection can be idle (ms)
  },

  // Retry configuration
  retry: {
    match: [
      /ConnectionError/,
      /ConnectionRefusedError/,
      /TimeoutError/,
    ],
    max: 3
  }
});

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    console.error('💡 Make sure PostgreSQL is running and DATABASE_URL is correct');
    process.exit(1);
  }
};

/**
 * Initialize database (sync models)
 * For beginners: This creates tables automatically
 * For production: Use migrations instead
 */
const initializeDatabase = async () => {
  try {
    // Import models here to avoid circular dependencies
    require('./User');
    require('./Employee');
    
    // Sync all models (creates tables if they don't exist)
    // { alter: true } updates existing tables to match models
    await sequelize.sync({ 
      alter: process.env.NODE_ENV === 'development',
      force: false // Never drop tables in this setup
    });
    
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Failed to sync database models:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase
};
