// Simple test server to verify setup
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartShield Backend is running!' });
});

// Test chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('Chat request received:', req.body);
  
  const { sanitized_text, question } = req.body;
  
  // Simple test response
  const response = {
    answer: `I received your question: "${question}". The content was: "${sanitized_text.substring(0, 100)}...". This is a test response from the backend!`,
    sources: ['Test Backend'],
    model: 'gemini-2.5-flash',
    provider: 'gemini',
    confidence: 0.9,
    session_id: 'test-session',
    response_time_ms: 100
  };
  
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Chat endpoint: http://localhost:${PORT}/api/chat`);
});
