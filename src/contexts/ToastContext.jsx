// src/contexts/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react'; // Icons for different toast types

// Create ToastContext
const ToastContext = createContext();

// Custom hook to use the toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ToastProvider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastId = React.useRef(0); // For unique toast IDs

  /**
   * Function to show a new toast message.
   * @param {string} message - The message content.
   * @param {'success' | 'error' | 'info'} type - Type of toast (influences color/icon).
   * @param {number} [duration=3000] - How long the toast should be visible in ms.
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastId.current++;
    const newToast = { id, message, type };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 mr-2" />;
      case 'error': return <XCircle className="w-6 h-6 mr-2" />;
      case 'info': return <Info className="w-6 h-6 mr-2" />;
      default: return <Info className="w-6 h-6 mr-2" />;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'success': return 'bg-green-700 text-white'; // Tailwind green for success
      case 'error': return 'bg-red-700 text-white'; // Tailwind red for error
      case 'info': return 'bg-dark-border text-text-light'; // Our dark theme info
      default: return 'bg-dark-border text-text-light';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-end space-y-4 space-y-reverse">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-xl flex items-center transition-all duration-300 ease-out
                        transform translate-x-0 opacity-100
                        ${getColorClass(toast.type)}`}
            style={{ minWidth: '250px', maxWidth: '350px' }}
          >
            {getIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
