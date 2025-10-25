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
    
    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful cybersecurity assistant. A user is asking about phishing protection and cybersecurity. Provide clear, helpful explanations about threats and security best practices. Keep responses concise but informative (2-3 sentences max).

User question: ${userMessage}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      
      // Handle rate limiting gracefully
      if (geminiResponse.status === 429) {
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
      
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));
    
    let aiResponse = 'I apologize, but I cannot process your request at the moment.';
    
    if (geminiData.candidates && geminiData.candidates[0]) {
      const candidate = geminiData.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        aiResponse = candidate.content.parts[0].text || aiResponse;
      } else if (candidate.finishReason === 'MAX_TOKENS') {
        aiResponse = 'I can help you with cybersecurity! Always verify suspicious emails, use strong passwords, and keep your software updated. What specific security concern do you have?';
      }
    }

    console.log('Gemini response:', aiResponse);

    res.json({
      success: true,
      message: 'Real AI response from Gemini',
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
  console.log(`🤖 AI Provider: Google Gemini 1.5 Flash`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Set' : 'Not set'}`);
});
