# SmartShield Testing Guide

This guide provides comprehensive instructions for building, testing, and running both the Chrome extension and the website components of SmartShield.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Chrome Extension](#chrome-extension)
   - [Building](#building)
   - [Testing](#testing)
   - [Installation](#installation)
   - [Development](#development)
3. [Website](#website)
   - [Running](#running)
   - [Testing](#testing-1)
   - [Games Testing](#games-testing)
4. [Backend API](#backend-api)
   - [Setup](#setup)
   - [Testing](#testing-2)
5. [Troubleshooting](#troubleshooting)
6. [Production Deployment](#production-deployment)

## Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Chrome Browser** (for extension testing)
- **Git** (for version control)

### Required Accounts
- **Chrome Web Store Developer Account** (for extension publishing)
- **Domain/Hosting** (for website deployment)

## Chrome Extension

### Building

#### 1. Navigate to Extension Directory
```bash
cd extension/
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Build Extension
```bash
# Development build
npm run build

# Production build
npm run build:prod
```

#### 4. Build Output
The built extension will be available in:
```
extension/dist/
```

### Testing

#### 1. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `extension/dist/` folder
5. The extension should appear in your extensions list

#### 2. Test Extension Features

##### Background Script Testing
- Check browser console for background script logs
- Verify phishing detection service is running
- Test API communication

##### Content Script Testing
- Visit a test phishing site
- Verify content script injection
- Test phishing detection alerts

##### Popup Testing
- Click extension icon in toolbar
- Test popup functionality
- Verify settings and options

##### Manifest Testing
- Check manifest.json for proper permissions
- Verify content security policy
- Test extension updates

#### 3. Test Phishing Detection
```bash
# Test with sample phishing URLs
# Add these to your test sites:
- http://fake-bank-security.com
- http://urgent-verification.net
- http://suspicious-link.org
```

### Installation

#### Development Installation
1. Build the extension (`npm run build`)
2. Load unpacked extension in Chrome
3. Pin extension to toolbar for easy access

#### Production Installation
1. Package extension for Chrome Web Store
2. Submit for review
3. Publish after approval

### Development

#### File Structure
```
extension/
├── src/
│   ├── background/
│   │   └── background.ts
│   ├── content/
│   │   └── content.ts
│   ├── services/
│   │   ├── contentExtractor.ts
│   │   └── phishingDetector.ts
│   ├── types/
│   │   └── content.ts
│   └── utils/
│       ├── logger.ts
│       └── sanitization.ts
├── public/
│   └── manifest.json
├── dist/ (built files)
├── package.json
├── tsconfig.json
└── webpack.config.js
```

#### Development Commands
```bash
# Watch mode for development
npm run dev

# Build for production
npm run build:prod

# Lint code
npm run lint

# Type check
npm run type-check
```

## Website

### Running

#### 1. Navigate to Website Directory
```bash
cd website/
```

#### 2. Install Dependencies (if needed)
```bash
npm install
```

#### 3. Start Development Server
```bash
# Using Python (if available)
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using Live Server (VS Code extension)
# Right-click index.html -> "Open with Live Server"
```

#### 4. Access Website
Open browser and navigate to:
```
http://localhost:8000
```

### Testing

#### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Dark/Light mode toggle functions
- [ ] Responsive design works on mobile
- [ ] All links are functional

#### 2. Theme Testing
- [ ] Dark mode displays correctly
- [ ] Light mode displays correctly
- [ ] Theme persists across page reloads
- [ ] Terminal header shows/hides on scroll

#### 3. Responsive Testing
Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large screens (2560x1440)

### Games Testing

#### 1. Phish or Safe Game
**Location**: `phish-safe.html`

**Test Steps**:
1. Navigate to the game page
2. Click "Start Training"
3. Test email scenarios:
   - [ ] Phishing emails are correctly identified
   - [ ] Safe emails are correctly identified
   - [ ] Timer counts down properly
   - [ ] Score updates correctly
   - [ ] Game ends after 5 questions
   - [ ] Results modal displays correctly
   - [ ] "Play Again" button works
   - [ ] "Back to Games" button works

**Test Cases**:
- Suspicious sender domains
- Urgent language in subjects
- Suspicious links
- Unexpected attachments
- Threatening language

#### 2. Spot the Red Flag Game
**Location**: `hotspot.html`

**Test Steps**:
1. Navigate to the game page
2. Click on suspicious elements in the email
3. Verify:
   - [ ] Hotspots are clickable
   - [ ] Feedback appears when clicking hotspots
   - [ ] Found hotspots turn green
   - [ ] All hotspots can be found
   - [ ] Game ends when all hotspots found
   - [ ] Results modal shows correct information

**Test Elements**:
- Sender domain (bank-oman.com)
- Subject line urgency
- Suspicious link
- Attachment mention
- Threatening language

#### 3. Phishroom Escape Game
**Location**: `phishroom.html`

**Test Steps**:
1. Navigate to the game page
2. Progress through 3 rooms:
   - [ ] Office room loads correctly
   - [ ] Phone call room loads correctly
   - [ ] Suspicious website room loads correctly
3. Test actions in each room:
   - [ ] Safe actions increase safe action count
   - [ ] Dangerous actions increase risk level
   - [ ] Clues are collected properly
   - [ ] Feedback appears for each action
   - [ ] Room progression works
   - [ ] Final results display correctly

**Room Tests**:
- **Office**: Email verification, bank calls, link clicking
- **Phone**: Caller verification, software installation
- **Website**: URL checking, security scans

#### 4. Language Toggle Testing
Test Arabic/English toggle in all games:
- [ ] Toggle button works
- [ ] Text changes language
- [ ] Game content updates
- [ ] Results display in correct language

## Backend API

### Setup

#### 1. Navigate to Backend Directory
```bash
cd backend/
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Environment
```bash
# Copy example environment file
cp example.env .env

# Edit .env with your configuration
# Add database credentials, API keys, etc.
```

#### 4. Setup Database
```bash
# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed
```

#### 5. Start Development Server
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

### Testing

#### 1. API Endpoints Testing
Test all API endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Phishing detection
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"http://suspicious-site.com"}'

# Analytics
curl http://localhost:3000/api/analytics/stats
```

#### 2. Database Testing
- [ ] Database connection works
- [ ] Tables are created correctly
- [ ] Sample data is inserted
- [ ] Queries return expected results

#### 3. Integration Testing
- [ ] Extension communicates with API
- [ ] Website fetches data from API
- [ ] Authentication flow works
- [ ] Phishing detection service responds

## Troubleshooting

### Common Issues

#### Extension Issues
**Problem**: Extension not loading
**Solution**: 
- Check manifest.json syntax
- Verify all required files exist
- Check browser console for errors

**Problem**: Content script not injecting
**Solution**:
- Verify content script permissions
- Check URL patterns in manifest
- Test on different websites

**Problem**: Background script not running
**Solution**:
- Check background script registration
- Verify service worker compatibility
- Check for JavaScript errors

#### Website Issues
**Problem**: Games not working
**Solution**:
- Check browser console for JavaScript errors
- Verify all game files are loaded
- Test in different browsers

**Problem**: Styling issues
**Solution**:
- Check CSS file loading
- Verify responsive breakpoints
- Test theme switching

**Problem**: Navigation not working
**Solution**:
- Check JavaScript event listeners
- Verify scroll detection
- Test on different devices

#### Backend Issues
**Problem**: API not responding
**Solution**:
- Check server logs
- Verify port availability
- Check environment variables

**Problem**: Database connection failed
**Solution**:
- Verify database credentials
- Check database server status
- Test connection string

### Debug Tools

#### Browser Developer Tools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls
- **Elements**: Inspect DOM structure
- **Application**: Check local storage

#### Extension Developer Tools
- **chrome://extensions/**: Manage extensions
- **Background page**: Debug background scripts
- **Inspect popup**: Debug popup functionality

#### Backend Debugging
- **Server logs**: Check application logs
- **Database logs**: Monitor database queries
- **API testing**: Use Postman or curl

## Production Deployment

### Extension Deployment

#### 1. Prepare for Chrome Web Store
```bash
# Build production version
npm run build:prod

# Create ZIP package
cd dist/
zip -r smartshield-extension.zip .
```

#### 2. Chrome Web Store Submission
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Upload ZIP package
3. Fill out store listing information
4. Submit for review
5. Wait for approval (usually 1-3 days)

### Website Deployment

#### 1. Build Static Files
```bash
# No build step needed - static HTML/CSS/JS
# Just upload files to web server
```

#### 2. Deploy to Web Server
- Upload all files to web server
- Configure web server (Apache/Nginx)
- Set up SSL certificate
- Configure domain DNS

#### 3. CDN Setup (Optional)
- Use CloudFlare or similar CDN
- Enable caching for static assets
- Configure compression

### Backend Deployment

#### 1. Server Setup
- Set up production server (AWS, DigitalOcean, etc.)
- Install Node.js and npm
- Configure reverse proxy (Nginx)
- Set up SSL certificate

#### 2. Database Setup
- Set up PostgreSQL database
- Configure database security
- Set up database backups

#### 3. Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-secret-key
API_KEY=your-api-key
```

#### 4. Process Management
```bash
# Use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Testing Checklist

### Pre-Deployment Checklist
- [ ] All games work correctly
- [ ] Extension loads and functions
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Responsive design tested
- [ ] Cross-browser compatibility verified
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Error handling implemented
- [ ] Logging configured

### Post-Deployment Checklist
- [ ] Website loads correctly
- [ ] Extension available in Chrome Web Store
- [ ] API accessible from production
- [ ] Database queries perform well
- [ ] Monitoring and alerts set up
- [ ] Backup procedures tested
- [ ] Security scanning completed
- [ ] Performance monitoring active

## Support and Maintenance

### Regular Maintenance Tasks
- Monitor server performance
- Check extension reviews and ratings
- Update dependencies regularly
- Monitor security vulnerabilities
- Backup database regularly
- Review and update documentation

### User Support
- Monitor user feedback
- Respond to Chrome Web Store reviews
- Handle bug reports
- Provide user documentation
- Maintain FAQ section

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: SmartShield Development Team
