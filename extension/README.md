# SmartShield Chrome Extension

## Download and Installation

### Option 1: Chrome Web Store (Coming Soon)
The SmartShield extension will be available on the Chrome Web Store soon. Check back for updates!

### Option 2: Manual Installation (Development)

#### Prerequisites
- Google Chrome browser
- Developer mode enabled

#### Installation Steps

1. **Download Extension Files**
   - The extension files are located in: `/home/kali/MulhimHackathon/extension/dist/`
   - This folder contains all necessary files: `manifest.json`, `background.js`, `content.js`, `popup.html`

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner
   - This enables the "Load unpacked" option

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to `/home/kali/MulhimHackathon/extension/dist/`
   - Select the folder and click "Select Folder"

5. **Verify Installation**
   - The SmartShield extension should now appear in your extensions list
   - You should see the SmartShield icon in your Chrome toolbar
   - Click the icon to open the extension popup

#### Extension Features
- **Real-time Protection**: Automatically scans web pages for phishing threats
- **Warning System**: Shows alerts for suspicious websites
- **Popup Interface**: Quick access to website and dashboard
- **Background Analysis**: Runs analysis without affecting page performance

#### Troubleshooting
- **Extension not loading**: Make sure all files are in the `dist/` folder
- **Permission errors**: Ensure Chrome has permission to load unpacked extensions
- **Extension disabled**: Check if the extension is enabled in the extensions page

#### File Structure
```
extension/dist/
├── manifest.json      # Extension configuration
├── background.js      # Service worker
├── content.js         # Page analysis script
└── popup.html         # Extension popup interface
```

#### Support
For technical support or questions about the extension, please contact our team through the website contact form.

---
**SmartShield Team** - Advanced AI-Powered Phishing Detection
