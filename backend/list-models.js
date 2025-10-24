// Test script to list available Gemini models
const axios = require('axios');

async function listGeminiModels() {
  console.log('Listing available Gemini models...');
  
  const apiKey = 'AIzaSyBjjnzk4yxaqISqrcsZz0EEQogr05mvrBw';
  
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Available models:');
    response.data.models.forEach(model => {
      console.log(`- ${model.name}: ${model.displayName || 'No display name'}`);
    });
    
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

listGeminiModels();
