require('dotenv').config();
const { Pool } = require('pg');

// Log the environment variables (without password)
console.log('Database Configuration:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'is set' : 'not set');

// Create pool with explicit configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fix_flip_calculator',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testConnection() {
  let client;
  try {
    console.log('\nAttempting to connect to database...');
    client = await pool.connect();
    console.log('✅ Successfully connected to the database!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    
  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

testConnection(); 