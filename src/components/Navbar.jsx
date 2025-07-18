// src/components/Navbar.jsx
import React from 'react';
import { Home, BookOpen, Guitar, Settings, LogOut } from 'lucide-react'; // Import LogOut icon

/**
 * Navbar component for navigating between different sections of the UkeBuddy app.
 * Now includes a logout button for authenticated users.
 */
function Navbar({ activePage, setActivePage, logoutUser }) { // Receive logoutUser prop
  // Define navigation items with their display name, unique ID, and Lucide icon
  const navItems = [
    { name: 'Dashboard', id: 'dashboard', icon: Home },
    { name: 'Learn', id: 'learn', icon: BookOpen },
    { name: 'Practice', id: 'practice', icon: Guitar },
    { name: 'Tools', id: 'tools', icon: Settings },
  ];

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      // Firebase's onAuthStateChanged will handle redirecting to LandingPage
      console.log("User logged out successfully.");
    } else {
      console.error("Logout failed.");
    }
  };

  return (
    <nav className="w-full bg-gray-800 p-4 shadow-lg fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center"> {/* Changed to justify-between */}
        {/* App Title/Logo */}
        <div className="text-2xl font-extrabold text-neon-cyan">UkeBuddy</div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4"> {/* Adjusted spacing */}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-all duration-300
                ${activePage === item.id
                  ? 'bg-cyan-700 text-cyan-200 shadow-md scale-105'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded-lg bg-dark-bg text-text-light hover:bg-red-700 hover:text-white transition-colors duration-300 shadow-md"
          aria-label="Logout"
        >
          <LogOut className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium hidden md:inline">Logout</span> {/* Hidden on small screens */}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
