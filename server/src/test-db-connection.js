require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  // Log the exact configuration being used
  const config = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fix_flip_calculator',
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD).trim() : '',
    port: parseInt(process.env.DB_PORT || '5432'),
  };

  console.log('Attempting connection with config:', {
    ...config,
    password: config.password ? '******' : 'not set'
  });

  const pool = new Pool(config);

  try {
    console.log('\nConnecting to database...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database!');

    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);

    // Test if we can access the users table
    const tableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log('\nUsers table exists:', tableResult.rows[0].exists);

    client.release();
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await pool.end();
  }
}

testConnection(); 