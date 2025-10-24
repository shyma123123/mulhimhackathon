import React, { useState, useEffect } from 'react';
import './warning.css';

interface WarningProps {
  threatLevel: 'high' | 'medium' | 'low';
  threats: string[];
  url: string;
}

const Warning: React.FC<WarningProps> = ({ threatLevel, threats, url }) => {
  const [isVisible, setIsVisible] = useState(true);

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getThreatIcon = () => {
    switch (threatLevel) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '❓';
    }
  };

  const handleProceed = () => {
    setIsVisible(false);
    // Send message to content script to proceed
    window.parent.postMessage({ action: 'proceedToSite' }, '*');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (!isVisible) return null;

  return (
    <div className="warning-overlay">
      <div className="warning-container">
        <div className="warning-header">
          <div className="threat-icon">{getThreatIcon()}</div>
          <h1>Security Warning</h1>
          <div className="threat-level" style={{ backgroundColor: getThreatColor() }}>
            {threatLevel.toUpperCase()} RISK
          </div>
        </div>

        <div className="warning-content">
          <p className="warning-text">
            SmartShield has detected potential security threats on this website:
          </p>
          
          <div className="url-display">
            <strong>URL:</strong> {url}
          </div>

          <div className="threats-list">
            <h3>Detected Threats:</h3>
            <ul>
              {threats.map((threat, index) => (
                <li key={index}>{threat}</li>
              ))}
            </ul>
          </div>

          <div className="recommendations">
            <h3>Recommendations:</h3>
            <ul>
              <li>Do not enter personal information</li>
              <li>Do not download files from this site</li>
              <li>Verify the site's authenticity through other means</li>
              <li>Consider using a different website</li>
            </ul>
          </div>
        </div>

        <div className="warning-actions">
          <button className="back-button" onClick={handleGoBack}>
            Go Back
          </button>
          <button className="proceed-button" onClick={handleProceed}>
            Proceed Anyway (Not Recommended)
          </button>
        </div>

        <div className="warning-footer">
          <p>This warning is provided by SmartShield to protect your security.</p>
        </div>
      </div>
    </div>
  );
};

export default Warning;
