import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
const loadingScreen = document.getElementById('loading-screen');

if (rootElement) {
  // 移除 Loading 畫面
  if (loadingScreen) loadingScreen.remove();
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}