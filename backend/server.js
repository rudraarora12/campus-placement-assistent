require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const foundryAgent = require('./services/foundryAgent');
const authService = require('./services/authService');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration supporting credentials (cookies)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local dev
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// ========================================================
// AUTHENTICATION API ROUTES
// ========================================================

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, course, branch, graduationYear } = req.body;

  try {
    const { user, token } = await authService.signup({
      name,
      email,
      password,
      course,
      branch,
      graduationYear,
    });

    // Set secure HTTP-only cookie
    res.cookie(authService.COOKIE_NAME, token, authService.COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user,
    });
  } catch (err) {
    console.error(`[AUTH SIGNUP ERROR]`, err.message);
    const statusCode = err.code === 'DUPLICATE_EMAIL' ? 409 : 400;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Registration failed.',
    });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await authService.login({ email, password });

    // Set secure HTTP-only cookie
    res.cookie(authService.COOKIE_NAME, token, authService.COOKIE_OPTIONS);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user,
    });
  } catch (err) {
    console.error(`[AUTH LOGIN ERROR]`, err.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password.',
    });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(authService.COOKIE_NAME, {
    ...authService.COOKIE_OPTIONS,
    maxAge: 0,
  });

  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies[authService.COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated.',
    });
  }

  try {
    const user = await authService.getUserFromToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or user not found.',
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(`[AUTH ME ERROR]`, err.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid session token.',
    });
  }
});

// ========================================================
// CORE AI CHAT & HEALTH API ROUTES
// ========================================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Campus Placement Assistant Backend with Authentication',
    agent: process.env.FOUNDRY_AGENT_NAME || 'Campus-Placement-Assistant',
    version: process.env.FOUNDRY_AGENT_VERSION || '23',
    endpoint: process.env.FOUNDRY_PROJECT_ENDPOINT || 'configured',
  });
});

// Chat API Endpoint: POST /api/chat
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request: "message" is required and cannot be empty.',
    });
  }

  console.log(`[${new Date().toISOString()}] Received chat request: "${message.substring(0, 80)}${message.length > 80 ? '...' : ''}"`);

  try {
    const aiResponse = await foundryAgent.sendMessage(message);

    console.log(`[${new Date().toISOString()}] Successfully generated response from Foundry Agent.`);

    return res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing chat request:`, error);

    let errorMessage = 'Failed to communicate with Microsoft Foundry Agent.';
    let details = error?.message || 'Unknown error';

    if (error?.message && error.message.includes('credential')) {
      errorMessage = 'Azure Authentication Error: Please ensure you are logged in via Azure CLI (`az login`).';
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: details,
    });
  }
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Campus Placement Assistant Backend Server Running`);
  console.log(`Port: ${PORT}`);
  console.log(`Foundry Agent: ${process.env.FOUNDRY_AGENT_NAME || 'Campus-Placement-Assistant'}`);
  console.log(`Agent Version: ${process.env.FOUNDRY_AGENT_VERSION || '23'}`);
  console.log(`Authentication: Enabled (HTTP-only secure cookie)`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another running instance.`);
    console.error(`Please terminate the existing process or run: npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
