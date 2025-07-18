// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Home, BookOpen, Guitar, Settings, LogOut, Menu, X } from 'lucide-react'; // Import Menu and X icons

/**
 * Navbar component for navigating between different sections of the UkeBuddy app.
 * Now includes a logout button for authenticated users and is mobile responsive.
 */
function Navbar({ activePage, setActivePage, logoutUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility

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
      console.log("User logged out successfully.");
      // Close mobile menu on logout
      setIsMobileMenuOpen(false);
    } else {
      console.error("Logout failed.");
    }
  };

  const handleNavLinkClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  return (
    <nav className="w-full bg-gray-800 p-4 shadow-lg fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Title/Logo */}
        <div className="text-2xl font-extrabold text-neon-cyan">UkeBuddy</div>

        {/* Desktop Navigation Buttons (hidden on small screens) */}
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavLinkClick(item.id)}
              className={`
                flex items-center p-2 rounded-lg transition-all duration-300
                ${activePage === item.id
                  ? 'bg-cyan-700 text-cyan-200 shadow-md scale-105'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon className="w-6 h-6 mr-2" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
          {/* Logout Button for Desktop */}
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-lg bg-dark-bg text-text-light hover:bg-red-700 hover:text-white transition-colors duration-300 shadow-md"
            aria-label="Logout"
          >
            <LogOut className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button (visible on small screens) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md p-2"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8" /> // 'X' icon when menu is open
            ) : (
              <Menu className="w-8 h-8" /> // Hamburger icon when menu is closed
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content (toggles visibility) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4 py-4 bg-gray-700 rounded-lg shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavLinkClick(item.id)}
              className={`
                w-full flex items-center justify-center p-3 rounded-lg transition-all duration-300
                ${activePage === item.id
                  ? 'bg-cyan-600 text-cyan-100 shadow-md'
                  : 'text-gray-200 hover:bg-gray-600 hover:text-white'
                }
              `}
            >
              <item.icon className="w-7 h-7 mr-3" />
              <span className="text-lg font-medium">{item.name}</span>
            </button>
          ))}
          {/* Logout Button for Mobile */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-dark-bg text-text-light hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-md mt-4"
            aria-label="Logout"
          >
            <LogOut className="w-7 h-7 mr-3" />
            <span className="text-lg font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
