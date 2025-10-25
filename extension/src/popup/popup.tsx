import React, { useState, useEffect } from 'react';
import './popup.css';

interface ScanResult {
  isPhishing: boolean;
  confidence: number;
  threats: string[];
  timestamp: number;
}

const Popup: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
        // Auto-scan current page
        handleScan();
      }
    });
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'scanPage' });
        setScanResult(response);
      }
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = () => {
    if (!scanResult) return '#6b7280';
    return scanResult.isPhishing ? '#ef4444' : '#10b981';
  };

  const getStatusText = () => {
    if (!scanResult) return 'Unknown';
    return scanResult.isPhishing ? 'Phishing Detected' : 'Safe';
  };

  return (
    <div className="popup-container">
      <div className="header">
        <h1>SmartShield</h1>
        <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}>
          {getStatusText()}
        </div>
      </div>

      <div className="url-section">
        <div className="url-label">Current Page:</div>
        <div className="url-text">{currentUrl}</div>
      </div>

      <div className="scan-section">
        <button 
          className="scan-button" 
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? 'Scanning...' : 'Scan Page'}
        </button>
      </div>

      {scanResult && (
        <div className="results-section">
          <div className="confidence">
            Confidence: {Math.round(scanResult.confidence * 100)}%
          </div>
          
          {scanResult.threats.length > 0 && (
            <div className="threats">
              <h3>Detected Threats:</h3>
              <ul>
                {scanResult.threats.map((threat, index) => (
                  <li key={index}>{threat}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="footer">
        <button 
          className="settings-button"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default Popup;
