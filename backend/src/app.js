/**
 * Express Application Setup - Step 2
 * This file configures the Express app with middleware, routes, and error handling
 * Middleware order is important: CORS -> JSON parsing -> Auth -> Routes -> Error handling
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. CORS - Allow frontend to make requests (must be first)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// 2. Body parsing middleware - Parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Static files - Serve uploaded files and payslips
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/payslips', express.static(path.join(__dirname, '../payslips')));

// 4. Health check endpoint - Test if server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Employee Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// 5. API Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// TODO: Mount employee routes -> app.use('/api/employees', employeeRoutes);
// TODO: Mount payroll routes -> app.use('/api/payrolls', payrollRoutes);

// 6. 404 handler - Must come after all routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// 7. Global error handler - Must be last middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
