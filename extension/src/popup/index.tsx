import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup';

const root = ReactDOM.createRoot(
  document.getElementById('popup-root') as HTMLElement
);

root.render(<Popup />);
