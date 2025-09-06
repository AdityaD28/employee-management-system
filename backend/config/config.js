/**
 * Sequelize Database Configuration - Step 4
 * Configures database connection for different environments
 */

require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    },
    logging: console.log // Set to false to disable SQL logging
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For Heroku/cloud databases
      }
    },
    logging: false
  }
};
