// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { FirebaseProvider } from './hooks/useFirebase.jsx'; // Import the FirebaseProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App component with FirebaseProvider */}
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </React.StrictMode>,
);
