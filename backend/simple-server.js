const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'development',
    services: {
      database: 'supabase',
      redis: 'mock',
      model: 'openai'
    }
  });
});

// Chat endpoint with real OpenAI API
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.question || 'Hello';
    const sessionId = req.body.sessionId || 'session-' + Date.now();
    
    console.log('Chat request:', { userMessage, sessionId });
    
    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful cybersecurity assistant. A user is asking about phishing protection and cybersecurity. Provide clear, helpful explanations about threats and security best practices. Keep responses concise but informative (2-3 sentences max).'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      
      // Handle rate limiting gracefully
      if (openaiResponse.status === 429) {
        res.json({
          success: true,
          message: 'Rate limited - using fallback response',
          data: {
            sessionId: sessionId,
            messages: [
              {
                role: 'user',
                content: userMessage
              },
              {
                role: 'assistant',
                content: 'I apologize, but I\'m currently experiencing high demand. Please try again in a few moments. In the meantime, remember to always verify suspicious emails and never click on links from unknown senders.'
              }
            ]
          }
        });
        return;
      }
      
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content || 'I apologize, but I cannot process your request at the moment.';

    console.log('OpenAI response:', aiResponse);

    res.json({
      success: true,
      message: 'Real AI response from OpenAI',
      data: {
        sessionId: sessionId,
        messages: [
          {
            role: 'user',
            content: userMessage
          },
          {
            role: 'assistant',
            content: aiResponse
          }
        ]
      }
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
      message: error.message || 'Unknown error'
    });
  }
});

// Mock scan endpoint
app.post('/api/scan', (req, res) => {
  res.json({
    success: true,
    message: 'Mock scan endpoint',
    data: {
      url: req.body.url || 'example.com',
      score: Math.random(),
      label: Math.random() > 0.5 ? 'phishing' : 'safe',
      reasons: ['Mock response - no actual analysis performed']
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartShield API server running on port ${PORT}`);
  console.log(`📊 Environment: development`);
  console.log(`🤖 AI Provider: OpenAI GPT-3.5-turbo`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Set' : 'Not set'}`);
});
