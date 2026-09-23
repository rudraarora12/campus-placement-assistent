require('dotenv').config();
const express = require('express');
const cors = require('cors');
const foundryAgent = require('./services/foundryAgent');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Campus Placement Assistant Backend',
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

    // Provide clear error diagnostics
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
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Campus Placement Assistant Backend Server Running`);
  console.log(`Port: ${PORT}`);
  console.log(`Foundry Agent: ${process.env.FOUNDRY_AGENT_NAME || 'Campus-Placement-Assistant'}`);
  console.log(`Agent Version: ${process.env.FOUNDRY_AGENT_VERSION || '23'}`);
  console.log(`Project Endpoint: ${process.env.FOUNDRY_PROJECT_ENDPOINT || 'default'}`);
  console.log(`====================================================`);
});
