require('dotenv').config();
const { Pool } = require('pg');

// Debug: Print all environment variables (except password)
console.log('\nEnvironment Variables:');
console.log('DB_USER:', process.env.DB_USER || 'not set');
console.log('DB_HOST:', process.env.DB_HOST || 'not set');
console.log('DB_NAME:', process.env.DB_NAME || 'not set');
console.log('DB_PORT:', process.env.DB_PORT || 'not set');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'is set' : 'not set');

// Create pool with explicit configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fix_flip_calculator',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Add error handler to pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
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
    
    // Test if we can access the users table
    try {
      const tableResult = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        );
      `);
      console.log('\nUsers table exists:', tableResult.rows[0].exists);
    } catch (tableError) {
      console.log('\nError checking users table:', tableError.message);
    }

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