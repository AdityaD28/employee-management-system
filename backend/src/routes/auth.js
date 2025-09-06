/**
 * Authentication Routes - Step 3
 * Handles user registration, login, logout, and token refresh
 * 
 * Request Examples:
 * POST /api/auth/register
 * {
 *   "email": "admin@company.com",
 *   "password": "password123",
 *   "role": "admin"
 * }
 * 
 * POST /api/auth/login
 * {
 *   "email": "admin@company.com", 
 *   "password": "password123"
 * }
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

/**
 * Helper function to generate JWT tokens
 * @param {Object} user - User object
 * @returns {Object} - Access and refresh tokens
 */
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'changeme',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  // TODO: Implement refresh token storage in database
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET || 'changeme_refresh',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', [
  // Input validation
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'hr', 'manager', 'employee']).withMessage('Invalid role')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email'
      });
    }

    // Hash password (salt rounds = 12 for good security)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      role
    });

    // Generate tokens
    const tokens = generateTokens(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.toJSON(), // Uses model's toJSON to exclude password_hash
      ...tokens
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user in database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate tokens
    const tokens = generateTokens(user);

    res.json({
      message: 'Login successful',
      user: user.toJSON(), // Uses model's toJSON to exclude password_hash
      ...tokens
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * TODO: Implement refresh token validation and rotation
 */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({
      error: 'Refresh token is required'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'changeme_refresh');
    
    // TODO: Check if refresh token exists in database and is valid
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      accessToken: newAccessToken
    });

  } catch (error) {
    res.status(401).json({
      error: 'Invalid refresh token'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (invalidate tokens)
 * TODO: Add refresh token to blacklist in database
 */
router.post('/logout', (req, res) => {
  // For now, just return success
  // TODO: Invalidate refresh token in database
  res.json({
    message: 'Logged out successfully'
  });
});

module.exports = router;
