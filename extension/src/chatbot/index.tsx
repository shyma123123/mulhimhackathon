import React from 'react';
import ReactDOM from 'react-dom/client';
import Chatbot from './chatbot';

const root = ReactDOM.createRoot(
  document.getElementById('chatbot-root') as HTMLElement
);

root.render(<Chatbot />);
