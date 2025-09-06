/**
 * Server Entry Point - Step 2
 * This file starts the Express server and connects to the database
 * Run with: npm run dev (development) or npm start (production)
 */

require('dotenv').config();
const app = require('./app');
const { testConnection, initializeDatabase } = require('./models/sequelize');
const { initializeWorkers } = require('./jobs/payrollWorker');

const PORT = process.env.PORT || 4000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database models
    await initializeDatabase();
    
    // Initialize queue workers
    await initializeWorkers();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Employee Management System Backend running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: Connected to PostgreSQL`);
      console.log(`🔄 Queue workers: Initialized and ready`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
