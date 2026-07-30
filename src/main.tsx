import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/brain-training.css';
import './styles/brain-game-preview.css';
import './styles/brain-game-feedback.css';
import './styles/brain-dashboard.css';
import './styles/brain-library-redesign.css';
import './styles/research-hub.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
