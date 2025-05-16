const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    // Test data
    const testUser = {
      email: `test${Date.now()}@example.com`, // Unique email each time
      password: 'Test123!',
      name: 'Test User'
    };

    console.log('\n1. Testing Registration...');
    console.log('Attempting to register user:', testUser.email);
    
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Registration successful!');
    console.log('Response:', registerResponse.data);

    console.log('\n2. Testing Login...');
    console.log('Attempting to login with:', testUser.email);
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful!');
    console.log('Response:', loginResponse.data);

    // Store the token for future requests
    const token = loginResponse.data.token;

    console.log('\n3. Testing Protected Route...');
    console.log('Attempting to access protected route with token');
    
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Protected route access successful!');
    console.log('User data:', meResponse.data);

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
}

// Start the server before running tests
console.log('Make sure the server is running on port 5000 before running these tests!');
testAuth(); 