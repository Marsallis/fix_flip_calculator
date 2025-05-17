const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const authRoutes = require('./routes/authRoutes');

// Apply authentication middleware to protected routes
const auth = require('./middleware/auth');

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', auth, userRoutes);
app.use('/api/calculators', auth, calculatorRoutes);

// Initialize the database
const fs = require('fs');
const db = require('./config/database');

const initDB = async () => {
  try {
    console.log('Starting database initialization...');
    
    // Read the initialization SQL file
    const initSQLPath = path.join(__dirname, 'db', 'init.sql');
    console.log('Reading SQL file from:', initSQLPath);
    
    const initSQL = fs.readFileSync(initSQLPath, 'utf8');
    console.log('SQL file read successfully');

    // Execute the initialization SQL
    await db.query(initSQL);
    console.log('✅ Database tables created successfully');

    // Verify the users table exists
    const result = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    console.log('Users table verification:', result.rows[0]);

  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }
};

// Run database initialization
initDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
