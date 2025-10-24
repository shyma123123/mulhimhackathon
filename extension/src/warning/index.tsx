import React from 'react';
import ReactDOM from 'react-dom/client';
import Warning from './warning';

// Get threat data from URL parameters or default values
const urlParams = new URLSearchParams(window.location.search);
const threatLevel = (urlParams.get('level') as 'high' | 'medium' | 'low') || 'high';
const threats = urlParams.get('threats')?.split(',') || ['Suspicious URL pattern', 'Potential phishing content'];
const url = urlParams.get('url') || window.location.href;

const root = ReactDOM.createRoot(
  document.getElementById('warning-root') as HTMLElement
);

root.render(<Warning threatLevel={threatLevel} threats={threats} url={url} />);
