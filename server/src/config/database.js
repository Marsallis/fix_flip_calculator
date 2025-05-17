const { Pool } = require('pg');
require('dotenv').config();

// Debug: Log all environment variables
console.log('All Environment Variables:', {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD: process.env.DB_PASSWORD ? '****' : undefined,
  NODE_ENV: process.env.NODE_ENV
});

// Ensure password is properly formatted
const password = process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD).trim() : '';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db', // Changed from localhost to db
  database: process.env.DB_NAME || 'dealscout',
  password: password,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Add error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection test failed:', err);
  } else {
    console.log('✅ Database connection test successful:', res.rows[0]);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 