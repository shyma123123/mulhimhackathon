import React from 'react';
import ReactDOM from 'react-dom/client';

const Warning: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>⚠️ Phishing Warning</h1>
      <p>This page has been flagged as potentially malicious.</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Warning />);

