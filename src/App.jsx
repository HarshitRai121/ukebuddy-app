// src/App.jsx
import React, { useState } from 'react';
import './index.css';
import { useFirebase } from './hooks/useFirebase.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Learn from './pages/Learn/Learn.jsx';
import PracticePage from './pages/Practice/PracticePage.jsx';
import ToolsPage from './pages/Tools/ToolsPage.jsx';
import LandingPage from './pages/LandingPage.jsx'; // Import the new LandingPage

function App() {
  const { userId, loading: firebaseLoading, logoutUser } = useFirebase(); // Get logoutUser
  const [activePage, setActivePage] = useState('dashboard');

  if (firebaseLoading) {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light flex items-center justify-center">
        <p className="text-2xl text-neon-lime animate-pulse">Loading UkeBuddy...</p>
      </div>
    );
  }

  // If user is not authenticated, show the LandingPage
  if (!userId) {
    return (
      <ToastProvider> {/* Landing page also needs ToastProvider for auth modal */}
        <LandingPage /> {/* LandingPage handles its own layout, no Navbar here */}
      </ToastProvider>
    );
  }

  // If user is authenticated, render the main app
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'learn':
        return <Learn />;
      case 'practice':
        return <PracticePage />;
      case 'tools':
        return <ToolsPage />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-dark-bg text-text-light font-inter">
        {/* Pass logoutUser to Navbar */}
        <Navbar activePage={activePage} setActivePage={setActivePage} logoutUser={logoutUser} />

        <main className="pt-16 pb-8 flex-grow flex justify-center">
          {renderPage()}
        </main>

        <footer className="fixed bottom-0 left-0 w-full bg-dark-surface bg-opacity-70 text-center p-2 text-xs text-text-muted z-40">
          {userId ? (
            <span>User ID: <span className="font-mono text-text-light break-all">{userId}</span></span>
          ) : (
            <span className="text-red-400">Not authenticated</span>
          )}
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;
