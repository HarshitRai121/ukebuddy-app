// src/pages/Practice/PracticeTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react'; // Icons for timer controls
import { useFirebase } from '../../hooks/useFirebase'; // To access addPracticeMinutes

/**
 * PracticeTimer component: Allows users to start, stop, and reset a timer
 * to track their practice sessions. Logs minutes to user profile on stop.
 * Designed to be simple, visually appealing, and mobile-responsive.
 */
function PracticeTimer() {
  const { addPracticeMinutes } = useFirebase(); // Get the function to log minutes
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const intervalRef = useRef(null); // Ref to hold the interval ID
  const [logMessage, setLogMessage] = useState(''); // State for logging feedback

  // Start the timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setLogMessage(''); // Clear any previous log messages
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000); // Update every second
    }
  };

  // Stop the timer and log minutes
  const stopTimer = async () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);

      const minutesLogged = Math.floor(elapsedTime / 60);
      if (minutesLogged > 0) {
        setLogMessage('Logging practice minutes...');
        const success = await addPracticeMinutes(minutesLogged);
        if (success) {
          setLogMessage(`Successfully logged ${minutesLogged} minutes! 🎉`);
        } else {
          setLogMessage("Failed to log minutes. Please try again. 😢");
        }
      } else {
        setLogMessage("Practice duration too short to log minutes. Keep going! 💪");
      }
    }
  };

  // Reset the timer
  const resetTimer = () => {
    stopTimer(); // Ensure timer is stopped first
    setElapsedTime(0);
    setLogMessage(''); // Clear message on reset
  };

  // Format elapsed time for display (HH:MM:SS)
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border w-full max-w-md flex flex-col items-center relative overflow-hidden">
        {/* Background gradient pulsate for active timer */}
        {isRunning && (
          <div className="absolute inset-0 z-0 opacity-20 animate-bg-pulse rounded-xl"
               style={{ background: 'linear-gradient(45deg, var(--neon-lime), var(--neon-cyan))' }}>
          </div>
        )}

        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-6 text-center animate-fade-in z-10">
          Practice Timer
        </h2>

        {/* Dynamic Clock Icon */}
        <Clock className={`w-20 h-20 mb-6 z-10 transition-colors duration-500
                           ${isRunning ? 'text-neon-lime animate-spin-slow' : 'text-neon-yellow'}`} />

        {/* Timer Display with Cool Hover Effect */}
        <div className="relative z-10 group"> {/* Added group for hover effect */}
          <div className={`text-7xl font-extrabold text-neon-lime mb-8 drop-shadow-lg
                           ${isRunning ? 'animate-pulse-subtle' : 'animate-fade-in'}
                           group-hover:scale-105 group-hover:text-neon-yellow transition-all duration-300`}> {/* Added hover effects */}
            {formatTime(elapsedTime)}
          </div>
          {/* Optional: Add a subtle glow on hover */}
          <div className="absolute inset-0 bg-neon-lime opacity-0 group-hover:opacity-20 blur-sm rounded-lg transition-opacity duration-300"></div>
        </div>


        {/* Control Buttons - Mobile Responsive Layout */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 z-10 w-full justify-center"> {/* MODIFIED for responsiveness */}
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="w-full sm:w-auto px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl font-bold rounded-full bg-gradient-to-r from-neon-lime to-neon-cyan text-dark-bg uppercase tracking-wide
                         shadow-lg hover:shadow-neon-lime/70 transition-all duration-300 transform hover:scale-105 active:scale-95
                         focus:outline-none focus:ring-4 focus:ring-neon-lime focus:ring-opacity-75 animate-cta-pulse"
            >
              <Play className="inline-block mr-2 w-7 h-7" /> Start
            </button>
          ) : (
            <>
              <button
                onClick={stopTimer}
                className="w-full sm:w-auto px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl font-bold rounded-full bg-gradient-to-r from-neon-magenta to-neon-purple text-dark-bg uppercase tracking-wide
                           shadow-lg hover:shadow-neon-magenta/70 transition-all duration-300 transform hover:scale-105 active:scale-95
                           focus:outline-none focus:ring-4 focus:ring-neon-magenta focus:ring-opacity-75"
              >
                <Pause className="inline-block mr-2 w-7 h-7" /> Stop
              </button>
              <button
                onClick={resetTimer}
                className="w-full sm:w-auto px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl font-bold rounded-full bg-dark-border text-text-light uppercase tracking-wide
                           shadow-lg hover:bg-dark-border/80 transition-all duration-300 transform hover:scale-105 active:scale-95
                           focus:outline-none focus:ring-4 focus:ring-text-muted focus:ring-opacity-75"
              >
                <Square className="inline-block mr-2 w-7 h-7" /> Reset
              </button>
            </>
          )}
        </div>

        {/* Log Message Feedback */}
        {logMessage && (
          <p className={`text-sm mt-6 text-center font-medium animate-fade-in z-10
                         ${logMessage.includes('Successfully') ? 'text-neon-lime' : 'text-neon-yellow'}`}
          >
            {logMessage}
          </p>
        )}

        {elapsedTime > 0 && !isRunning && !logMessage && ( // Only show if not running and no log message yet
          <p className="text-text-muted text-sm mt-6 text-center z-10">
            {Math.floor(elapsedTime / 60)} minutes will be logged to your progress.
          </p>
        )}
      </div>
    </div>
  );
}

export default PracticeTimer;
