/**
 * Authentication Middleware - Step 3
 * Provides middleware functions for protecting routes and checking user roles
 * 
 * Usage:
 * - authenticate: Verifies JWT token and adds user to req.user
 * - authorize(['admin', 'hr']): Checks if user has required role
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 * Adds user information to req.user if token is valid
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No valid authorization token provided'
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next(); // Continue to next middleware/route handler

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please login again'
      });
    } else {
      return res.status(500).json({
        error: 'Authentication failed',
        message: error.message
      });
    }
  }
};

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticate middleware
 * 
 * @param {Array} allowedRoles - Array of roles that can access the route
 * @returns {Function} - Express middleware function
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated to access this resource'
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: `This action requires one of these roles: ${allowedRoles.join(', ')}`,
        userRole: req.user.role
      });
    }

    next(); // User is authorized, continue
  };
};

/**
 * Middleware to optionally authenticate
 * Adds user to req.user if token is present and valid, but doesn't fail if not
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // No token, continue without authentication
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    // Invalid token, but continue anyway (optional auth)
    console.log('Optional auth failed:', error.message);
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
