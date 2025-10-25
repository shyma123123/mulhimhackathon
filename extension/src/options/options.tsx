import React, { useState, useEffect } from 'react';
import './options.css';

interface Settings {
  apiEndpoint: string;
  autoScan: boolean;
  notifications: boolean;
  strictMode: boolean;
}

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    apiEndpoint: 'http://localhost:3001',
    autoScan: true,
    notifications: true,
    strictMode: false
  });

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings({ ...settings, ...result.settings });
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ settings }, () => {
      alert('Settings saved successfully!');
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      apiEndpoint: 'http://localhost:3001',
      autoScan: true,
      notifications: true,
      strictMode: false
    };
    setSettings(defaultSettings);
    chrome.storage.sync.set({ settings: defaultSettings });
  };

  return (
    <div className="options-container">
      <header className="header">
        <h1>SmartShield Settings</h1>
        <p>Configure your phishing protection preferences</p>
      </header>

      <div className="settings-section">
        <div className="setting-group">
          <label htmlFor="apiEndpoint">API Endpoint</label>
          <input
            id="apiEndpoint"
            type="text"
            value={settings.apiEndpoint}
            onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
            placeholder="http://localhost:3001"
          />
          <small>Backend API URL for phishing detection</small>
        </div>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.autoScan}
              onChange={(e) => setSettings({ ...settings, autoScan: e.target.checked })}
            />
            <span>Auto-scan pages</span>
          </label>
          <small>Automatically scan pages when you visit them</small>
        </div>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            />
            <span>Show notifications</span>
          </label>
          <small>Display browser notifications for threats</small>
        </div>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.strictMode}
              onChange={(e) => setSettings({ ...settings, strictMode: e.target.checked })}
            />
            <span>Strict mode</span>
          </label>
          <small>Use stricter detection criteria (may increase false positives)</small>
        </div>
      </div>

      <div className="actions">
        <button className="save-button" onClick={handleSave}>
          Save Settings
        </button>
        <button className="reset-button" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>

      <div className="info-section">
        <h3>About SmartShield</h3>
        <p>SmartShield uses advanced machine learning algorithms to detect phishing attempts and malicious content.</p>
        <p>Version: 1.0.0</p>
      </div>
    </div>
  );
};

export default Options;
