/**
 * Employee Routes - Step 6
 * CRUD operations for employee management
 * 
 * Endpoints:
 * - GET /api/employees - List employees (with pagination and filters)
 * - GET /api/employees/:id - Get single employee
 * - POST /api/employees - Create new employee (Admin/HR only)
 * - PUT /api/employees/:id - Update employee (Admin/HR/Manager only)
 * - DELETE /api/employees/:id - Soft delete employee (Admin only)
 * 
 * Request Examples:
 * 
 * GET /api/employees?page=1&limit=10&department=Engineering&search=john
 * 
 * POST /api/employees
 * {
 *   "first_name": "John",
 *   "last_name": "Doe", 
 *   "email": "john.doe@company.com",
 *   "phone": "+1-555-0123",
 *   "department": "Engineering",
 *   "job_title": "Software Engineer",
 *   "base_salary": 75000,
 *   "date_of_joining": "2024-01-15"
 * }
 */

const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const Employee = require('../models/Employee');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * GET /api/employees
 * List employees with pagination, filtering, and search
 * Accessible by: All authenticated users
 */
router.get('/', [
  authenticate,
  // Query parameter validation
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('department').optional().isLength({ min: 1 }).withMessage('Department cannot be empty'),
  query('status').optional().isIn(['active', 'inactive', 'terminated', 'on_leave']).withMessage('Invalid status'),
  query('search').optional().isLength({ min: 1 }).withMessage('Search term cannot be empty')
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

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { department, status, search } = req.query;

    // Build where conditions
    const whereConditions = {};

    if (department) {
      whereConditions.department = department;
    }

    if (status) {
      whereConditions.status = status;
    }

    // Search across name and email
    if (search) {
      whereConditions[Op.or] = [
        {
          first_name: {
            [Op.iLike]: `%${search}%`
          }
        },
        {
          last_name: {
            [Op.iLike]: `%${search}%`
          }
        },
        {
          email: {
            [Op.iLike]: `%${search}%`
          }
        }
      ];
    }

    // Query employees with pagination
    const { rows: employees, count: totalCount } = await Employee.findAndCountAll({
      where: whereConditions,
      order: [['last_name', 'ASC'], ['first_name', 'ASC']],
      limit: limit,
      offset: offset,
      attributes: {
        exclude: ['createdAt', 'updatedAt'] // Don't include timestamps in response
      }
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      employees,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        department,
        status,
        search
      }
    });

  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      error: 'Failed to fetch employees',
      message: error.message
    });
  }
});

/**
 * GET /api/employees/:id
 * Get single employee by ID
 * Accessible by: All authenticated users
 */
router.get('/:id', [
  authenticate
], async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        error: 'Employee not found'
      });
    }

    res.json({
      employee
    });

  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      error: 'Failed to fetch employee',
      message: error.message
    });
  }
});

/**
 * POST /api/employees
 * Create new employee
 * Accessible by: Admin and HR only
 */
router.post('/', [
  authenticate,
  authorize(['admin', 'hr']),
  // Input validation
  body('first_name').trim().isLength({ min: 1, max: 50 }).withMessage('First name is required (1-50 characters)'),
  body('last_name').trim().isLength({ min: 1, max: 50 }).withMessage('Last name is required (1-50 characters)'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[\+]?[\d\s\-\(\)]+$/).withMessage('Invalid phone number format'),
  body('department').trim().isLength({ min: 1, max: 100 }).withMessage('Department is required'),
  body('job_title').trim().isLength({ min: 1, max: 100 }).withMessage('Job title is required'),
  body('base_salary').isFloat({ min: 0 }).withMessage('Base salary must be a positive number'),
  body('date_of_joining').isDate().withMessage('Valid joining date is required'),
  body('status').optional().isIn(['active', 'inactive', 'terminated', 'on_leave']).withMessage('Invalid status')
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

    const employeeData = req.body;

    // Convert salary to cents
    if (employeeData.base_salary) {
      employeeData.base_salary = Math.round(employeeData.base_salary * 100);
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({
      where: { email: employeeData.email }
    });

    if (existingEmployee) {
      return res.status(400).json({
        error: 'Employee with this email already exists'
      });
    }

    // Create employee
    const employee = await Employee.create(employeeData);

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      error: 'Failed to create employee',
      message: error.message
    });
  }
});

/**
 * PUT /api/employees/:id
 * Update existing employee
 * Accessible by: Admin, HR, and Managers
 */
router.put('/:id', [
  authenticate,
  authorize(['admin', 'hr', 'manager']),
  // Input validation (all fields optional for updates)
  body('first_name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
  body('last_name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[\+]?[\d\s\-\(\)]+$/).withMessage('Invalid phone number format'),
  body('department').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Department cannot be empty'),
  body('job_title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Job title cannot be empty'),
  body('base_salary').optional().isFloat({ min: 0 }).withMessage('Base salary must be a positive number'),
  body('date_of_joining').optional().isDate().withMessage('Valid joining date is required'),
  body('status').optional().isIn(['active', 'inactive', 'terminated', 'on_leave']).withMessage('Invalid status')
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

    const { id } = req.params;
    const updateData = req.body;

    // Find employee
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        error: 'Employee not found'
      });
    }

    // Convert salary to cents if provided
    if (updateData.base_salary) {
      updateData.base_salary = Math.round(updateData.base_salary * 100);
    }

    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== employee.email) {
      const existingEmployee = await Employee.findOne({
        where: { 
          email: updateData.email,
          id: { [Op.ne]: id } // Exclude current employee
        }
      });

      if (existingEmployee) {
        return res.status(400).json({
          error: 'Employee with this email already exists'
        });
      }
    }

    // Update employee
    await employee.update(updateData);

    res.json({
      message: 'Employee updated successfully',
      employee
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      error: 'Failed to update employee',
      message: error.message
    });
  }
});

/**
 * DELETE /api/employees/:id
 * Soft delete employee (set status to terminated)
 * Accessible by: Admin only
 */
router.delete('/:id', [
  authenticate,
  authorize(['admin'])
], async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        error: 'Employee not found'
      });
    }

    // Soft delete (set status to terminated)
    await employee.update({
      status: 'terminated'
    });

    res.json({
      message: 'Employee deleted successfully (status set to terminated)',
      employee
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      error: 'Failed to delete employee',
      message: error.message
    });
  }
});

/**
 * GET /api/employees/stats/departments
 * Get employee statistics by department
 * Accessible by: Admin and HR only
 */
router.get('/stats/departments', [
  authenticate,
  authorize(['admin', 'hr'])
], async (req, res) => {
  try {
    // Get count by department
    const departmentStats = await Employee.findAll({
      attributes: [
        'department',
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'count']
      ],
      group: ['department'],
      order: [['department', 'ASC']]
    });

    res.json({
      departmentStats
    });

  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({
      error: 'Failed to fetch department statistics',
      message: error.message
    });
  }
});

module.exports = router;
