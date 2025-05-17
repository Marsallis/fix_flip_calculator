const { Pool } = require('pg');
require('dotenv').config();

console.log('Starting database initialization...');
console.log('Environment variables:', {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD: process.env.DB_PASSWORD ? '****' : undefined
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function initDatabase() {
  try {
    console.log('Attempting to create database if it doesn\'t exist...');
    // Create database if it doesn't exist
    await pool.query(`
      SELECT 'CREATE DATABASE dealscout'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dealscout')
    `);
    console.log('Database creation check completed');

    // Connect to the new database
    await pool.end();
    console.log('Disconnected from default database');
    
    console.log('Connecting to dealscout database...');
    const appPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'db',
      database: 'dealscout',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });

    // Create tables
    console.log('Creating users table...');
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE
      );
    `);
    console.log('Users table created successfully');

    // Verify table creation
    const result = await appPool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    console.log('Table verification result:', result.rows[0]);

    console.log('✅ Database initialized successfully');
    await appPool.end();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase(); 