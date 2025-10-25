# SmartShield Issues Resolution Guide

## Issues Identified and Solutions

### 1. 🌐 Website Server Issues

**Problem**: Website not opening due to server startup issues.

**Solutions**:
```bash
# Option 1: Direct HTML access
# Open website/index.html directly in your browser
# File path: C:\Users\Atika\Desktop\MulhimHackathon\SmartSheild\website\index.html

# Option 2: Python HTTP Server (if Python is installed)
cd website
python -m http.server 8000
# Then open: http://localhost:8000

# Option 3: Node.js server (if Express is installed)
cd website
node server.js
# Then open: http://localhost:3000
```

### 2. 🤖 Chatbot Functionality

**Problem**: Chatbot not working properly.

**Root Cause**: Backend server not running or API endpoints not accessible.

**Solution**:
1. Start the backend server:
```bash
cd backend
npm run dev
# Server should start on http://localhost:4000
```

2. Verify API endpoints:
- Health check: `http://localhost:4000/health`
- Chat endpoint: `http://localhost:4000/api/chat`

### 3. 🧠 Gemini Model Configuration

**Problem**: System using local model instead of Gemini.

**Root Cause**: Missing or incorrect API key configuration.

**Solution**:
1. Get a Gemini API key from Google AI Studio:
   - Visit: https://aistudio.google.com/
   - Create a new API key
   - Copy the key

2. Update the configuration:
```bash
# Create or update backend/.env file
MODEL_PROVIDER=gemini
MODEL_NAME=gemini-1.5-flash
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

3. Restart the backend server after updating the .env file.

### 4. 🎨 Extension HTML/CSS Rendering Issues

**Problem**: Extension messes up search results and page rendering.

**Root Cause**: CSS conflicts and improper DOM manipulation.

**Solution**: The extension has been updated with:
- Better CSS isolation using `!important` declarations
- Proper z-index management
- Non-intrusive DOM manipulation
- Trusted domain whitelist to avoid interfering with legitimate sites

### 5. 🔧 Complete Setup Instructions

#### Step 1: Start Backend Server
```bash
cd backend
npm install
npm run dev
```

#### Step 2: Configure Gemini API Key
1. Get API key from https://aistudio.google.com/
2. Create `backend/.env` file:
```env
MODEL_PROVIDER=gemini
MODEL_NAME=gemini-1.5-flash
GEMINI_API_KEY=YOUR_API_KEY_HERE
JWT_SECRET=smartshield_jwt_secret_2024
DATABASE_URL=postgres://postgres:password@localhost:5432/phish_prod
REDIS_URL=redis://localhost:6379
PORT=4000
CORS_ORIGINS=http://localhost:3000,http://localhost:4000,chrome-extension://*
```

#### Step 3: Start Website Server
```bash
cd website
# Option A: Direct HTML (recommended for testing)
# Just open website/index.html in your browser

# Option B: Python server
python -m http.server 8000

# Option C: Node server
node server.js
```

#### Step 4: Load Extension
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `extension/dist` folder

#### Step 5: Test Everything
1. **Website**: Open `http://localhost:8000` or `website/index.html`
2. **Backend**: Visit `http://localhost:4000/health`
3. **Extension**: Visit a test phishing site or use the test page
4. **Chatbot**: Click the chatbot widget when it appears

### 6. 🧪 Testing URLs

**Safe URLs** (should not trigger warnings):
- https://google.com
- https://github.com
- https://stackoverflow.com

**Test Phishing URLs** (should trigger warnings):
- Use the test page: `extension/dist/test-phishing.html`
- Or visit known phishing test sites

### 7. 🐛 Troubleshooting

#### Backend not starting:
```bash
cd backend
npm install
npm run build
npm run dev
```

#### Extension not working:
1. Check console for errors: `F12` → Console
2. Reload extension in `chrome://extensions/`
3. Check manifest.json permissions

#### Website not loading:
1. Try opening `website/index.html` directly
2. Use Python server: `python -m http.server 8000`
3. Check if port 3000/8000 is available

#### Gemini API issues:
1. Verify API key is correct
2. Check API quotas in Google AI Studio
3. Test with a simple curl request:
```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY"
```

### 8. 📊 Expected Behavior

**When working correctly**:
- Website loads with professional landing page
- Backend responds to health checks
- Extension shows warnings on suspicious sites
- Chatbot appears and responds to queries
- Gemini API is used for AI analysis

**Performance metrics**:
- Website loads in < 2 seconds
- Backend responds in < 1 second
- Extension analysis completes in < 3 seconds
- Chatbot responds in < 5 seconds

### 9. 🔄 Quick Fix Commands

```bash
# Kill any running servers
taskkill /f /im node.exe
taskkill /f /im python.exe

# Start fresh
cd backend && npm run dev &
cd website && python -m http.server 8000 &

# Test endpoints
curl http://localhost:4000/health
curl http://localhost:8000
```

### 10. 📞 Support

If issues persist:
1. Check browser console for errors
2. Verify all services are running
3. Check network connectivity
4. Ensure all dependencies are installed
5. Verify API keys are valid

The system is designed to be robust with fallbacks, so even if some components fail, others should continue working.
