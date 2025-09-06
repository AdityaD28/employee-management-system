/**
 * Payroll Routes - Step 7
 * Handles payroll operations and job management
 * 
 * Endpoints:
 * - POST /api/payrolls/run - Queue payroll processing job
 * - GET /api/payrolls/:id/status - Check payroll job status
 * - GET /api/payrolls - List payroll summaries
 * - GET /api/payrolls/:id - Get payroll details
 * 
 * Request Example:
 * POST /api/payrolls/run
 * {
 *   "payPeriod": {
 *     "start_date": "2024-01-01",
 *     "end_date": "2024-01-31"
 *   },
 *   "filters": {
 *     "department": "Engineering"
 *   },
 *   "options": {
 *     "sendEmails": false,
 *     "skipPayslips": false
 *   }
 * }
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');
const { payrollQueue } = require('../jobs/queues');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

const PAYROLLS_DIR = path.join(__dirname, '../../payrolls');

/**
 * POST /api/payrolls/run
 * Queue a new payroll processing job
 * Accessible by: Admin and Payroll roles only
 */
router.post('/run', [
  authenticate,
  authorize(['admin', 'hr']), // HR can run payroll too
  // Input validation
  body('payPeriod.start_date').isDate().withMessage('Valid start date is required'),
  body('payPeriod.end_date').isDate().withMessage('Valid end date is required'),
  body('filters.department').optional().isString().withMessage('Department must be a string'),
  body('filters.employee_ids').optional().isArray().withMessage('Employee IDs must be an array'),
  body('options.sendEmails').optional().isBoolean().withMessage('Send emails must be boolean'),
  body('options.skipPayslips').optional().isBoolean().withMessage('Skip payslips must be boolean')
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

    const { payPeriod, filters = {}, options = {} } = req.body;

    // Validate date range
    const startDate = new Date(payPeriod.start_date);
    const endDate = new Date(payPeriod.end_date);
    
    if (startDate >= endDate) {
      return res.status(400).json({
        error: 'Start date must be before end date'
      });
    }

    // Check for existing payroll jobs for the same period
    const existingJobs = await payrollQueue.getJobs(['waiting', 'active', 'delayed']);
    const duplicateJob = existingJobs.find(job => 
      job.data.payPeriod.start_date === payPeriod.start_date &&
      job.data.payPeriod.end_date === payPeriod.end_date
    );

    if (duplicateJob && !req.body.force) {
      return res.status(400).json({
        error: 'Payroll job already exists for this period',
        message: 'Use force=true to create anyway',
        existingJobId: duplicateJob.id
      });
    }

    // Queue the payroll job
    const job = await payrollQueue.add('process-payroll', {
      payPeriod,
      filters,
      options,
      requestedBy: {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role
      },
      requestedAt: new Date().toISOString()
    }, {
      // Job options
      attempts: 3,
      backoff: 'exponential',
      removeOnComplete: 10,
      removeOnFail: 50
    });

    console.log(`📊 Payroll job queued: ${job.id} for period ${payPeriod.start_date} to ${payPeriod.end_date}`);

    res.status(202).json({
      message: 'Payroll job queued successfully',
      job: {
        id: job.id,
        status: 'queued',
        payPeriod,
        filters,
        options,
        queuePosition: await job.getPosition()
      }
    });

  } catch (error) {
    console.error('Error queuing payroll job:', error);
    res.status(500).json({
      error: 'Failed to queue payroll job',
      message: error.message
    });
  }
});

/**
 * GET /api/payrolls/jobs/:id/status
 * Check the status of a specific payroll job
 * Accessible by: Admin and HR
 */
router.get('/jobs/:id/status', [
  authenticate,
  authorize(['admin', 'hr'])
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await payrollQueue.getJob(id);
    
    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    const progress = job.progress();
    const state = await job.getState();
    
    let result = null;
    if (state === 'completed') {
      result = job.returnvalue;
    }
    
    let failureReason = null;
    if (state === 'failed') {
      failureReason = job.failedReason;
    }

    res.json({
      job: {
        id: job.id,
        status: state,
        progress: progress,
        data: job.data,
        result: result,
        failureReason: failureReason,
        createdAt: new Date(job.timestamp).toISOString(),
        processedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
        finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null
      }
    });

  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({
      error: 'Failed to fetch job status',
      message: error.message
    });
  }
});

/**
 * GET /api/payrolls
 * List payroll summaries
 * Accessible by: Admin and HR
 */
router.get('/', [
  authenticate,
  authorize(['admin', 'hr'])
], async (req, res) => {
  try {
    // Read payroll summary files
    const files = await fs.readdir(PAYROLLS_DIR);
    const summaryFiles = files.filter(file => file.startsWith('payroll_summary_') && file.endsWith('.json'));
    
    const payrolls = [];
    
    for (const file of summaryFiles.slice(0, 50)) { // Limit to last 50 payrolls
      try {
        const filePath = path.join(PAYROLLS_DIR, file);
        const content = await fs.readFile(filePath, 'utf8');
        const summary = JSON.parse(content);
        
        // Return summary without detailed payroll items
        payrolls.push({
          id: summary.id,
          pay_period: summary.pay_period,
          processed_at: summary.processed_at,
          total_employees: summary.total_employees,
          total_gross: summary.total_gross,
          total_deductions: summary.total_deductions,
          total_net: summary.total_net,
          currency: summary.currency,
          filters: summary.filters,
          options: summary.options
        });
      } catch (fileError) {
        console.error(`Error reading payroll file ${file}:`, fileError.message);
      }
    }
    
    // Sort by processed date (newest first)
    payrolls.sort((a, b) => new Date(b.processed_at) - new Date(a.processed_at));

    res.json({
      payrolls,
      total: payrolls.length
    });

  } catch (error) {
    console.error('Error fetching payrolls:', error);
    res.status(500).json({
      error: 'Failed to fetch payrolls',
      message: error.message
    });
  }
});

/**
 * GET /api/payrolls/:id
 * Get detailed payroll information
 * Accessible by: Admin and HR
 */
router.get('/:id', [
  authenticate,
  authorize(['admin', 'hr'])
], async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the payroll summary file
    const files = await fs.readdir(PAYROLLS_DIR);
    const summaryFile = files.find(file => 
      file.startsWith('payroll_summary_') && 
      file.includes(id.replace('payroll_', ''))
    );
    
    if (!summaryFile) {
      return res.status(404).json({
        error: 'Payroll not found'
      });
    }
    
    const filePath = path.join(PAYROLLS_DIR, summaryFile);
    const content = await fs.readFile(filePath, 'utf8');
    const payroll = JSON.parse(content);

    res.json({
      payroll
    });

  } catch (error) {
    console.error('Error fetching payroll details:', error);
    res.status(500).json({
      error: 'Failed to fetch payroll details',
      message: error.message
    });
  }
});

/**
 * GET /api/payrolls/jobs
 * List recent payroll jobs (from queue)
 * Accessible by: Admin and HR
 */
router.get('/jobs', [
  authenticate,
  authorize(['admin', 'hr'])
], async (req, res) => {
  try {
    // Get recent jobs from all states
    const waiting = await payrollQueue.getJobs(['waiting'], 0, 10);
    const active = await payrollQueue.getJobs(['active'], 0, 10);
    const completed = await payrollQueue.getJobs(['completed'], 0, 20);
    const failed = await payrollQueue.getJobs(['failed'], 0, 20);
    
    const allJobs = [...waiting, ...active, ...completed, ...failed];
    
    // Sort by timestamp (newest first)
    allJobs.sort((a, b) => b.timestamp - a.timestamp);
    
    const jobsWithStatus = await Promise.all(
      allJobs.slice(0, 50).map(async (job) => {
        const state = await job.getState();
        return {
          id: job.id,
          status: state,
          progress: job.progress(),
          data: job.data,
          createdAt: new Date(job.timestamp).toISOString(),
          processedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
          finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null
        };
      })
    );

    res.json({
      jobs: jobsWithStatus,
      total: jobsWithStatus.length
    });

  } catch (error) {
    console.error('Error fetching payroll jobs:', error);
    res.status(500).json({
      error: 'Failed to fetch payroll jobs',
      message: error.message
    });
  }
});

module.exports = router;
