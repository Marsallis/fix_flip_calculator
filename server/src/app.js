const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');

app.use('/api/users', userRoutes);
app.use('/api/calculators', calculatorRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
