import React from 'react';
import ReactDOM from 'react-dom/client';

const Chatbot: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>SmartShield Assistant</h1>
      <p>Chat with our AI assistant about this page.</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Chatbot />);

