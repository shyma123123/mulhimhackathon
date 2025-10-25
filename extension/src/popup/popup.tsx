import React from 'react';
import ReactDOM from 'react-dom/client';

const Popup: React.FC = () => {
  return (
    <div style={{ width: '300px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>SmartShield</h2>
      <p>Phishing Protection Active</p>
      <button onClick={() => chrome.tabs.create({ url: 'http://localhost:8000' })}>
        Open Website
      </button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Popup />);

