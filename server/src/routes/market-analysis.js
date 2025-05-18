require('dotenv').config(); // Load .env vars
const express = require('express');
const router = express.Router();
const axios = require('axios');

const MOVE_FLOW_API_URL = 'https://api.moveflow.ai';

// Add route logging
router.use((req, res, next) => {
  console.log(`Market Analysis Route: ${req.method} ${req.url}`);
  next();
});

router.post('/neighborhood-insights', async (req, res) => {
  console.log('Received neighborhood insights request with body:', req.body);
  
  try {
    const { latitude, longitude, radius_miles } = req.body;

    // Validate inputs
    if (!latitude || !longitude || !radius_miles) {
      console.log('Missing parameters:', { latitude, longitude, radius_miles });
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    console.log('Making request to MoveFlow API with params:', {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius_miles: parseFloat(radius_miles)
    });

    const response = await axios.post(
      `${MOVE_FLOW_API_URL}/neighborhood/insights`,
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius_miles: parseFloat(radius_miles)
      },
      {
        headers: {
          'X-API-Key': process.env.MOVEFLOW_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('MoveFlow API Response:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error('MoveFlow API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error fetching neighborhood insights'
    });
  }
});

module.exports = router; 