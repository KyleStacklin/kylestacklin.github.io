import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { resolveInitialPath } from './RiskOfRain2/routing';
import { loadStoredRoute } from './RiskOfRain2/localStorage';

if (typeof window !== 'undefined') {
  const initialPath = resolveInitialPath(window.location.hash, loadStoredRoute())
  if (window.location.hash.replace(/^#/, '') !== initialPath) {
    window.location.replace(
      `${window.location.pathname}${window.location.search}#${initialPath}`
    )
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
