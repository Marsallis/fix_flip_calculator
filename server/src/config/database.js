const { Pool } = require('pg');
require('dotenv').config();

// Debug: Log configuration (without password)
console.log('Database Config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  hasPassword: !!process.env.DB_PASSWORD
});

// Ensure password is properly formatted
const password = process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD).trim() : '';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fix_flip_calculator',
  password: password,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Add error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 