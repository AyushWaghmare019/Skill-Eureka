// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // <-- Make sure this is here!
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import { NotificationProvider } from './context/NotificationContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <VideoProvider>
        <NotificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationProvider>
      </VideoProvider>
    </AuthProvider>
  </React.StrictMode>
);
