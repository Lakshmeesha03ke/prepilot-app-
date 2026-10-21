import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Register Service Worker for Chrome Android Installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('PrePilot Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service worker registration:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
