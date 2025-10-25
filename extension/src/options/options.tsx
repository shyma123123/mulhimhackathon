import React from 'react';
import ReactDOM from 'react-dom/client';

const Options: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>SmartShield Settings</h1>
      <p>Extension configuration options will be available here.</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Options />);

