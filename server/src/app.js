const express = require('express');
const cors = require('cors');
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
  const initSQL = fs.readFileSync('./src/db/init.sql', 'utf8');
  try {
    await db.query(initSQL);
    console.log('✅ DB initialized');
  } catch (err) {
    console.error('❌ DB init failed:', err);
  }
};

initDB(); // Run this before your server starts

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
