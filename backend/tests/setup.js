/**
 * Test Setup - Step 11
 * Global test configuration and utilities
 */

require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
process.env.DATABASE_URL = 'postgres://postgres:password@localhost:5432/ems_test';
process.env.REDIS_URL = 'redis://localhost:6379/1'; // Use different Redis DB for tests

// Global test timeout
jest.setTimeout(10000);

// Global beforeAll hook
beforeAll(async () => {
  // Add any global setup here
});

// Global afterAll hook
afterAll(async () => {
  // Add any global cleanup here
});
