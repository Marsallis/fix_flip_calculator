require('dotenv').config(); // Load .env vars
const express = require('express');
const router = express.Router();
const axios = require('axios');

const MOVE_FLOW_API_URL = 'https://api.moveflow.ai';
const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

// Add route logging
router.use((req, res, next) => {
  console.log(`Market Analysis Route: ${req.method} ${req.url}`);
  next();
});

// New endpoint for Google Maps geocoding (no auth required)
router.post('/google-geocode', async (req, res) => {
  console.log('Received Google geocoding request with body:', req.body);
  
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    const response = await axios.get(GOOGLE_MAPS_API_URL, {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      res.json({
        latitude: location.lat,
        longitude: location.lng
      });
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error('Google Geocoding Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error geocoding address' });
  }
});

// Geocoding endpoint
router.post('/geocode', async (req, res) => {
  console.log('Received geocoding request with body:', req.body);
  
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    const response = await axios.post(
      `${MOVE_FLOW_API_URL}/geocode`,
      { address },
      {
        headers: {
          'X-API-Key': process.env.MOVEFLOW_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Geocoding Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error geocoding address'
    });
  }
});

// Neighborhood insights endpoint (no auth required)
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