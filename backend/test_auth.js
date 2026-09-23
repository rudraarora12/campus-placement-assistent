const http = require('http');

const BASE_URL = 'http://localhost:5001';

function makeRequest(options, postData = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const headers = options.headers || {};
    if (cookie) {
      headers['Cookie'] = cookie;
    }
    if (postData) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(JSON.stringify(postData));
    }

    const req = http.request({ ...options, headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        const cookies = res.headers['set-cookie'];
        let cookieHeader = null;
        if (cookies && cookies.length > 0) {
          cookieHeader = cookies[0].split(';')[0];
        }
        let parsedData = null;
        try {
          parsedData = JSON.parse(body);
        } catch (e) {
          parsedData = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookie: cookieHeader,
          data: parsedData,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING COMPLETE AUTH & AI VERIFICATION TESTS ---');

  const testEmail = `test.student.${Date.now()}@university.edu`;
  const testPassword = 'Password123!';

  // Test 1: Health check
  console.log('\n[TEST 1] Backend Health Check:');
  const healthRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: '/api/health',
    method: 'GET',
  });
  console.log('Status:', healthRes.statusCode);
  console.log('Body:', healthRes.data);
  if (healthRes.statusCode !== 200 || healthRes.data.status !== 'ok') {
    throw new Error('Health check failed');
  }

  // Test 2: Signup with weak password
  console.log('\n[TEST 2] Signup with Weak Password:');
  const weakSignupRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/signup',
      method: 'POST',
    },
    {
      name: 'Test Student',
      email: testEmail,
      password: 'weak',
      course: 'B.Tech',
      branch: 'CSE',
      graduationYear: '2027',
    }
  );
  console.log('Status:', weakSignupRes.statusCode, '(Expected: 400)');
  console.log('Error message:', weakSignupRes.data.error);
  if (weakSignupRes.statusCode !== 400) {
    throw new Error('Expected 400 on weak password');
  }

  // Test 3: Signup with valid credentials
  console.log('\n[TEST 3] Signup with Valid Data:');
  const validSignupRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/signup',
      method: 'POST',
    },
    {
      name: 'Rudra Arora',
      email: testEmail,
      password: testPassword,
      course: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: '2026',
    }
  );
  console.log('Status:', validSignupRes.statusCode, '(Expected: 201)');
  console.log('User created:', validSignupRes.data.user);
  console.log('Set-Cookie received:', validSignupRes.cookie);
  if (validSignupRes.statusCode !== 201 || !validSignupRes.cookie) {
    throw new Error('Signup failed or cookie not set');
  }

  const sessionCookie = validSignupRes.cookie;

  // Test 4: Duplicate signup rejection
  console.log('\n[TEST 4] Duplicate Email Signup Rejection:');
  const dupSignupRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/signup',
      method: 'POST',
    },
    {
      name: 'Another User',
      email: testEmail,
      password: testPassword,
    }
  );
  console.log('Status:', dupSignupRes.statusCode, '(Expected: 400)');
  console.log('Error message:', dupSignupRes.data.error);
  if (dupSignupRes.statusCode !== 400) {
    throw new Error('Expected duplicate email rejection');
  }

  // Test 5: Verify current session (/api/auth/me) with cookie
  console.log('\n[TEST 5] GET /api/auth/me (Authenticated session check):');
  const meRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/me',
      method: 'GET',
    },
    null,
    sessionCookie
  );
  console.log('Status:', meRes.statusCode, '(Expected: 200)');
  console.log('Authenticated User:', meRes.data.user);
  if (meRes.statusCode !== 200 || meRes.data.user.email !== testEmail) {
    throw new Error('Session authentication failed');
  }

  // Test 6: Invalid login attempt
  console.log('\n[TEST 6] Login with Invalid Password:');
  const badLoginRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
    },
    {
      email: testEmail,
      password: 'WrongPassword999!',
    }
  );
  console.log('Status:', badLoginRes.statusCode, '(Expected: 401)');
  console.log('Error message:', badLoginRes.data.error);
  if (badLoginRes.statusCode !== 401) {
    throw new Error('Expected 401 on bad password');
  }

  // Test 7: Valid login
  console.log('\n[TEST 7] Login with Valid Credentials:');
  const loginRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
    },
    {
      email: testEmail,
      password: testPassword,
    }
  );
  console.log('Status:', loginRes.statusCode, '(Expected: 200)');
  console.log('Logged In User:', loginRes.data.user);
  console.log('New Cookie:', loginRes.cookie);
  if (loginRes.statusCode !== 200 || !loginRes.cookie) {
    throw new Error('Login failed');
  }

  // Test 8: Logout
  console.log('\n[TEST 8] Logout:');
  const logoutRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/logout',
      method: 'POST',
    },
    null,
    loginRes.cookie
  );
  console.log('Status:', logoutRes.statusCode, '(Expected: 200)');
  console.log('Logout Response:', logoutRes.data);

  // Test 9: Auth check without cookie (or expired cookie)
  console.log('\n[TEST 9] Auth check without session:');
  const unauthRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: '/api/auth/me',
    method: 'GET',
  });
  console.log('Status:', unauthRes.statusCode, '(Expected: 401)');
  if (unauthRes.statusCode !== 401) {
    throw new Error('Expected 401 when no session cookie present');
  }

  console.log('\n=========================================');
  console.log('ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY! ✅');
  console.log('=========================================');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
