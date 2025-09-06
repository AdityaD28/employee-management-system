/**
 * Queue Configuration - Step 7
 * Sets up Bull queues for background job processing
 * 
 * This file exports queue instances for:
 * - Payroll processing
 * - Email notifications
 * - Report generation (future)
 */

const Queue = require('bull');
const Redis = require('ioredis');

// Redis connection configuration
const redisConfig = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

// For development, we might be using a Redis URL
let redisConnection;
if (process.env.REDIS_URL) {
  redisConnection = new Redis(process.env.REDIS_URL);
} else {
  redisConnection = new Redis(redisConfig);
}

// Test Redis connection
redisConnection.on('connect', () => {
  console.log('✅ Connected to Redis for job queues');
});

redisConnection.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

/**
 * Payroll Queue
 * Handles payroll calculation and payslip generation
 */
const payrollQueue = new Queue('payroll processing', {
  redis: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 10, // Keep last 10 completed jobs
    removeOnFail: 50,     // Keep last 50 failed jobs for debugging
    attempts: 3,          // Retry failed jobs up to 3 times
    backoff: {
      type: 'exponential',
      delay: 2000         // Start with 2 second delay, exponentially increase
    }
  }
});

/**
 * Email Queue
 * Handles sending emails (payslips, notifications, etc.)
 */
const emailQueue = new Queue('email sending', {
  redis: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 20,
    removeOnFail: 100,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

// Queue event handlers for monitoring
payrollQueue.on('completed', (job, result) => {
  console.log(`✅ Payroll job ${job.id} completed:`, result.summary);
});

payrollQueue.on('failed', (job, err) => {
  console.error(`❌ Payroll job ${job.id} failed:`, err.message);
});

emailQueue.on('completed', (job, result) => {
  console.log(`📧 Email job ${job.id} completed:`, result.to);
});

emailQueue.on('failed', (job, err) => {
  console.error(`📧 Email job ${job.id} failed:`, err.message);
});

// Clean up old jobs periodically
setInterval(async () => {
  try {
    await payrollQueue.clean(24 * 60 * 60 * 1000, 'completed'); // Clean completed jobs older than 24h
    await payrollQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // Clean failed jobs older than 7 days
    await emailQueue.clean(24 * 60 * 60 * 1000, 'completed');
    await emailQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed');
  } catch (error) {
    console.error('Error cleaning up queues:', error.message);
  }
}, 60 * 60 * 1000); // Run every hour

module.exports = {
  payrollQueue,
  emailQueue,
  redisConnection
};
