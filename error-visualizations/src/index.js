import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // This is optional but typically included for global styles
import ErrorDataVisualization from './ErrorDataVisualization';  // Adjust path as needed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorDataVisualization />
  </React.StrictMode>
);