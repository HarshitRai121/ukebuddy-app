// src/components/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react'; // Icons for close and loading
import { useFirebase } from '../hooks/useFirebase'; // Import useFirebase hook
import { useToast } from '../contexts/ToastContext'; // Import useToast hook

/**
 * AuthModal component: Provides a modal interface for user login and signup.
 * It uses Firebase authentication functions and displays real-time feedback.
 *
 * Props:
 * - isOpen: Boolean to control modal visibility.
 * - onClose: Function to call when the modal needs to be closed.
 */
function AuthModal({ isOpen, onClose }) {
  const { signupUser, loginUser, authError, loading: firebaseLoading } = useFirebase();
  const { showToast } = useToast();

  const [isLoginMode, setIsLoginMode] = useState(true); // true for login, false for signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null); // Local error state for form validation

  // Clear local error and form fields when modal opens/closes or mode changes
  useEffect(() => {
    setLocalError(null);
    setEmail('');
    setPassword('');
  }, [isOpen, isLoginMode]);

  // Watch for Firebase auth errors and display them as toasts
  useEffect(() => {
    if (authError) {
      showToast(authError, 'error');
      setLocalError(authError); // Also set local error for display in modal
    }
  }, [authError, showToast]);

  if (!isOpen) return null; // Don't render anything if modal is not open

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null); // Clear previous local errors

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      showToast("Email and password are required.", "error");
      return;
    }

    let success = false;
    if (isLoginMode) {
      success = await loginUser(email, password);
      if (success) {
        showToast("Logged in successfully!", "success");
        onClose(); // Close modal on successful login
      } else {
        // Error already handled by authError useEffect and toast
      }
    } else {
      success = await signupUser(email, password);
      if (success) {
        showToast("Account created successfully! You are now logged in.", "success");
        onClose(); // Close modal on successful signup
      } else {
        // Error already handled by authError useEffect and toast
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-bg bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border max-w-md w-full relative transform scale-100 transition-transform duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-dark-bg text-text-light hover:text-neon-magenta transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-neon-cyan mb-6 text-center">
          {isLoginMode ? 'Login to UkeBuddy' : 'Sign Up for UkeBuddy'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-dark-bg border border-dark-border text-text-light
                         focus:outline-none focus:ring-2 focus:ring-neon-lime focus:border-transparent"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={firebaseLoading}
            />
          </div>
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-dark-bg border border-dark-border text-text-light
                         focus:outline-none focus:ring-2 focus:ring-neon-lime focus:border-transparent"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={firebaseLoading}
            />
          </div>

          {localError && (
            <p className="text-red-400 text-sm text-center bg-red-900 bg-opacity-30 p-2 rounded-md">
              {localError}
            </p>
          )}

          <button
            type="submit"
            className="px-8 py-3 text-lg font-bold rounded-full bg-neon-lime text-dark-bg uppercase tracking-wide
                       shadow-lg hover:shadow-neon-lime transition-all duration-300 transform hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-4 focus:ring-neon-lime focus:ring-opacity-75 animate-cta-pulse
                       flex items-center justify-center"
            disabled={firebaseLoading}
          >
            {firebaseLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              isLoginMode ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-neon-cyan hover:underline font-semibold transition-colors duration-200"
            disabled={firebaseLoading}
          >
            {isLoginMode ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
