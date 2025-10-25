/**
 * Build script for Simple SmartShield Extension
 */

const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Background script content
const backgroundScript = `
// SmartShield Background Script
chrome.runtime.onInstalled.addListener(() => {
  console.log('SmartShield Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    // Simple mock analysis
    const mockResult = {
      score: Math.random(),
      label: Math.random() > 0.5 ? 'phishing' : 'safe',
      reasons: ['Mock analysis - extension in development mode']
    };
    sendResponse(mockResult);
  }
});
`;

// Content script content
const contentScript = `
// SmartShield Content Script
(function() {
  console.log('SmartShield content script loaded');
  
  function analyzePage() {
    const url = window.location.href;
    const title = document.title;
    const text = document.body.innerText;
    
    chrome.runtime.sendMessage({
      action: 'analyzePage',
      data: { url, title, text }
    }, (response) => {
      if (response) {
        showWarning(response);
      }
    });
  }
  
  function showWarning(result) {
    if (result.score > 0.7) {
      const warning = document.createElement('div');
      warning.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      \`;
      warning.innerHTML = \`
        <h3>⚠️ SmartShield Alert</h3>
        <p>This page may be suspicious (\${Math.round(result.score * 100)}% risk)</p>
        <button onclick="this.parentElement.remove()" style="background: white; color: #ff4444; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Dismiss</button>
      \`;
      document.body.appendChild(warning);
      
      setTimeout(() => {
        if (warning.parentElement) {
          warning.remove();
        }
      }, 10000);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', analyzePage);
  } else {
    analyzePage();
  }
})();
`;

// Manifest content
const manifest = {
  "manifest_version": 3,
  "name": "SmartShield - Phishing Protection",
  "version": "1.0.0",
  "description": "Simple phishing detection extension",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }],
  "action": {
    "default_popup": "popup.html",
    "default_title": "SmartShield"
  }
};

// Popup HTML content
const popupHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { width: 300px; padding: 20px; font-family: Arial, sans-serif; }
    button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
    button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <h2>🛡️ SmartShield</h2>
  <p>Phishing Protection Active</p>
  <button onclick="window.open('http://localhost:8000', '_blank')">Open Website</button>
  <button onclick="window.open('http://localhost:3000', '_blank')">Open Dashboard</button>
</body>
</html>`;

// Write all files
fs.writeFileSync(path.join(distDir, 'background.js'), backgroundScript);
fs.writeFileSync(path.join(distDir, 'content.js'), contentScript);
fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(distDir, 'popup.html'), popupHTML);

console.log('✅ Simple SmartShield extension built successfully!');
console.log('📁 Files created in dist/ directory');
console.log('🔧 To install:');
console.log('   1. Open Chrome and go to chrome://extensions/');
console.log('   2. Enable "Developer mode"');
console.log('   3. Click "Load unpacked"');
console.log('   4. Select the dist/ folder');
console.log('');
console.log('📂 Extension files:');
console.log('   - background.js (service worker)');
console.log('   - content.js (page analysis)');
console.log('   - manifest.json (extension config)');
console.log('   - popup.html (extension popup)');