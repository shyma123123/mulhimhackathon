// Simple working server for SmartShield
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

console.log('🚀 Starting SmartShield Backend Server...');

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'SmartShield Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint with Gemini integration
app.post('/api/chat', async (req, res) => {
  console.log('💬 Chat request received:', {
    question: req.body.question,
    contentLength: req.body.sanitized_text?.length || 0
  });
  
  const { sanitized_text, question, session_id } = req.body;
  
  try {
    // Call Gemini API
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBjjnzk4yxaqISqrcsZz0EEQogr05mvrBw',
      {
        contents: [{
          parts: [{ 
            text: `You are a helpful cybersecurity assistant. A user has flagged content as potentially suspicious and is asking for an explanation.

CONTEXT:
${sanitized_text}

USER QUESTION: ${question}

Please provide a clear, helpful, and conversational response. Be specific about what you found in the flagged content. If it appears to be phishing, explain the specific indicators and what the user should do. If it appears legitimate, explain why and provide reassurance. 

Keep your response natural and engaging (2-4 sentences). Avoid generic responses - be specific about the content being discussed.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      },
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const answer = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error processing your question.';
    
    console.log('🤖 Gemini response:', answer.substring(0, 100) + '...');
    
    const response = {
      answer: answer.trim(),
      sources: ['Gemini 2.5 Flash'],
      model: 'gemini-2.5-flash',
      provider: 'gemini',
      confidence: 0.9,
      session_id: session_id || 'test-session',
      response_time_ms: 1000
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    // Fallback response
    const response = {
      answer: `I apologize, but I'm having trouble connecting to the AI service right now. Based on the content you shared, I can see it was flagged for: ${sanitized_text.includes('Request for sensitive information') ? 'requesting sensitive information' : 'suspicious indicators'}. Please be cautious and don't provide any personal details.`,
      sources: ['Fallback Response'],
      model: 'fallback',
      provider: 'fallback',
      confidence: 0.5,
      session_id: session_id || 'test-session',
      response_time_ms: 100
    };
    
    res.json(response);
  }
});

app.listen(PORT, () => {
  console.log(`✅ SmartShield Backend Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`✅ Ready to receive requests!`);
});
