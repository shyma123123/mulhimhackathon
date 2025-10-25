// Test script to verify Gemini API connection
const axios = require('axios');

async function testGeminiConnection() {
  console.log('Testing Gemini API connection...');
  
  const apiKey = 'AIzaSyBjjnzk4yxaqISqrcsZz0EEQogr05mvrBw';
  const modelName = 'gemini-pro';
  
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: 'Hello, are you working? Please respond with "Yes, I am working!"' }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 100
        }
      },
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('✅ Gemini API Response:', content);
    console.log('✅ Gemini API is working correctly!');
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testGeminiConnection();
