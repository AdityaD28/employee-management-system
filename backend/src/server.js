/**
 * Server Entry Point - Step 2
 * This file starts the Express server and connects to the database
 * Run with: npm run dev (development) or npm start (production)
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Employee Management System Backend running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // TODO: Add database connection here in Step 4
  // TODO: Add queue worker initialization here in Step 7
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
