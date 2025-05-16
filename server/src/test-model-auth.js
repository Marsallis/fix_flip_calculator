const User = require('./models/User');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

async function testUserModel() {
  console.log('\n🧪 Testing User Model Methods...\n');

  try {
    // Test data
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'Test123!',
      name: 'Test User'
    };

    // 1. Test create method
    console.log('1. Testing create method...');
    const createdUser = await User.create(testUser);
    console.log('✅ Create successful:', {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name
    });

    // 2. Test findByEmail method
    console.log('\n2. Testing findByEmail method...');
    const foundByEmail = await User.findByEmail(testUser.email);
    console.log('✅ findByEmail successful:', {
      id: foundByEmail.id,
      email: foundByEmail.email,
      name: foundByEmail.name
    });

    // 3. Test findById method
    console.log('\n3. Testing findById method...');
    const foundById = await User.findById(createdUser.id);
    console.log('✅ findById successful:', {
      id: foundById.id,
      email: foundById.email,
      name: foundById.name
    });

    // 4. Test verifyPassword method with correct password
    console.log('\n4. Testing verifyPassword with correct password...');
    const isValidPassword = await User.verifyPassword(testUser.password, foundByEmail.password);
    if (isValidPassword) {
      console.log('✅ verifyPassword successful: Correct password was validated');
    } else {
      console.error('❌ verifyPassword failed: Correct password was rejected');
    }

    // 5. Test verifyPassword method with wrong password
    console.log('\n5. Testing verifyPassword with wrong password...');
    const isInvalidPassword = await User.verifyPassword('wrongpassword', foundByEmail.password);
    if (!isInvalidPassword) {
      console.log('✅ verifyPassword successful: Wrong password was correctly rejected');
    } else {
      console.error('❌ verifyPassword failed: Wrong password was incorrectly accepted');
    }

    // 6. Test JWT and auth middleware
    console.log('\n6. Testing JWT and auth middleware...');
    const token = jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create mock request and response objects
    const mockReq = {
      header: (name) => name === 'Authorization' ? `Bearer ${token}` : null
    };
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          console.log('Response status:', code);
          console.log('Response data:', data);
          return mockRes;
        }
      })
    };
    const mockNext = () => console.log('✅ Middleware next() called');

    // Test auth middleware
    await auth(mockReq, mockRes, mockNext);
    console.log('✅ Auth middleware successful');
    console.log('User set in request:', mockReq.user);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the tests
console.log('Starting User Model and Auth Middleware Tests...');
testUserModel(); 