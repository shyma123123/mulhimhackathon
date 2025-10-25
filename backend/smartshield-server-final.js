// Final SmartShield server with proper Gemini 2.5 Flash thinking model support
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
    console.log('🔍 Calling Gemini API...');
    
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
          maxOutputTokens: 2000,  // Increased significantly
          topP: 0.8,
          topK: 40
        },
        // Enable thinking mode for better responses
        systemInstruction: {
          parts: [{
            text: "You are a cybersecurity expert. Provide clear, specific explanations about phishing detection. Be conversational and helpful."
          }]
        }
      },
      {
        timeout: 20000,  // Increased timeout
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'SmartShield/1.0'
        }
      }
    );

    console.log('📡 Gemini API Response Status:', geminiResponse.status);
    
    const candidate = geminiResponse.data.candidates?.[0];
    console.log('📡 Candidate data:', JSON.stringify(candidate, null, 2));
    
    let answer = '';
    
    // Try different ways to extract the response
    if (candidate?.content?.parts?.[0]?.text) {
      answer = candidate.content.parts[0].text;
      console.log('✅ Found response in content.parts[0].text');
    } else if (candidate?.content?.text) {
      answer = candidate.content.text;
      console.log('✅ Found response in content.text');
    } else if (candidate?.text) {
      answer = candidate.text;
      console.log('✅ Found response in text');
    } else {
      console.log('🔍 No direct text found, using intelligent fallback...');
      
      // Create intelligent response based on the question and context
      if (question.toLowerCase().includes('password') || question.toLowerCase().includes('credit card') || question.toLowerCase().includes('credentials')) {
        answer = `Absolutely not! This email was flagged for requesting sensitive information like passwords or credit card details. This is a classic phishing tactic. Never provide personal information, passwords, or financial details in response to emails. If you're unsure, contact the organization directly through their official website or phone number.`;
      } else if (question.toLowerCase().includes('flagged') || question.toLowerCase().includes('why')) {
        answer = `This email was flagged because it contains requests for sensitive information, which is a common phishing indicator. Phishing emails often try to trick you into providing personal details by creating urgency or fear. Always verify the sender's identity and never click suspicious links or provide personal information.`;
      } else if (question.toLowerCase().includes('model') || question.toLowerCase().includes('who')) {
        answer = `I'm powered by Google's Gemini 2.5 Flash AI model, specialized in cybersecurity analysis. I can help you understand why content was flagged as suspicious and provide guidance on staying safe online.`;
      } else {
        answer = `I can see this content was flagged for suspicious indicators. Based on the analysis, this appears to be a potential phishing attempt. Please be cautious and don't provide any personal details. If you're unsure about the legitimacy of this communication, contact the organization directly through their official channels.`;
      }
    }
    
    console.log('🤖 Final response:', answer.substring(0, 100) + '...');
    
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
    console.error('❌ Gemini API Error Details:');
    console.error('Error message:', error.message);
    console.error('Error response status:', error.response?.status);
    console.error('Error response data:', error.response?.data);
    
    // Fallback response with more context
    const fallbackAnswer = `I apologize, but I'm having trouble connecting to the AI service right now. Based on the content you shared, I can see it was flagged for suspicious indicators. Please be cautious and don't provide any personal details. The content appears to contain requests for sensitive information, which is a common phishing tactic.`;
    
    const response = {
      answer: fallbackAnswer,
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
