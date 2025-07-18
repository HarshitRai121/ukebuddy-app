// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import ProgressDisplay from '../../components/ProgressDisplay'; // Import ProgressDisplay
import { Zap, Target, TrendingUp, Award, Clock } from 'lucide-react'; // Icons for the dashboard stats

/**
 * Dashboard component - the main landing page for the user.
 * Now includes progress tracking and a call to action for practice minutes.
 */
function Dashboard({ setActivePage }) {
  const { userId, userProfile, addPracticeMinutes } = useFirebase(); // Get userProfile and addPracticeMinutes
  // Removed showFlicker state and useEffect for pattern interrupt
  const [practiceTimeAdded, setPracticeTimeAdded] = useState(false); // State for feedback

  const handleCtaClick = () => {
    setActivePage('learn'); // Directly navigate to the 'Learn' page
  };

  const handleAddPracticeMinutes = async () => {
    const minutesToAdd = 10; // Example: Add 10 minutes
    const success = await addPracticeMinutes(minutesToAdd);
    if (success) {
      setPracticeTimeAdded(true);
      setTimeout(() => setPracticeTimeAdded(false), 3000); // Hide feedback after 3 seconds
      console.log(`${minutesToAdd} minutes added!`);
    } else {
      console.log("Failed to add practice minutes.");
    }
  };

  // Mock Data for Dashboard Stats (replace with real data from userProfile if available)
  const dashboardStats = [
    { icon: <Zap size={24} className="text-gray-400 group-hover:text-sky-400 transition-colors duration-200" />, label: "Lessons", value: userProfile?.completedLessons || 0 },
    { icon: <Clock size={24} className="text-gray-400 group-hover:text-sky-400 transition-colors duration-200" />, label: "Minutes Practiced", value: userProfile?.practiceMinutes || 0 },
    { icon: <Award size={24} className="text-gray-400 group-hover:text-sky-400 transition-colors duration-200" />, label: "Achievements", value: userProfile?.achievements?.length || 0 },
    { icon: <Target size={24} className="text-gray-400 group-hover:text-sky-400 transition-colors duration-200" />, label: "Next Goal", value: "Level 2 Mastery" }, // Example static goal
  ];

  return (
    <div className="relative flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] p-4 md:p-8 text-text-light overflow-hidden">
      {/* Subtle Background Pattern - Keep it very muted */}
      <div className="absolute inset-0 bg-dark-bg z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-lines.png')] opacity-[0.02]"></div> {/* Very low opacity */}
      </div>
      
      {/* Main Content Card */}
      <div className="relative z-20 flex flex-col items-center p-6 md:p-10 bg-dark-surface rounded-3xl shadow-2xl max-w-6xl w-full border border-dark-border transform hover:scale-[1.005] transition-transform duration-300 backdrop-blur-sm">
        
        {/* Header Section */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-4 leading-tight animate-fade-in text-text-light"> {/* Removed gradient text */}
          Welcome, <span className="text-sky-400">Prodigy</span>.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 text-center max-w-3xl animate-fade-in-delay-1">
          Your journey to musical mastery is unfolding. Track your progress, unlock new insights, and activate your limitless potential.
        </p>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12 animate-fade-in-delay-2">
          {dashboardStats.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-dark-bg p-6 rounded-xl border border-gray-700 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:scale-105 hover:border-sky-500"
            >
              <div className="mb-3">
                {stat.icon}
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-text-light">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Core Value Proposition & CTA */}
        <div className="text-center mb-12 animate-fade-in-delay-3">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-6 leading-tight text-text-light"> {/* Removed gradient text */}
            Ready for your <span className="text-sky-400">next upgrade</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Ignite your passion and transcend previous limits. This isn't just practice; it's **exponential growth.**
          </p>

          <button
            onClick={handleCtaClick}
            className="relative px-12 py-5 text-xl md:text-2xl font-bold rounded-full bg-sky-500 text-white uppercase tracking-wide
                       shadow-lg hover:shadow-sky-400/50 transition-all duration-300
                       transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-75"
          >
            <Zap className="inline-block mr-3 w-7 h-7"/> {/* Removed pulse-fast animation */}
            <span className="relative z-10">CONTINUE YOUR ASCENSION</span>
          </button>
        </div>

        {/* Progress Display Section (if userProfile exists) */}
        {userProfile && (
          <div className="w-full mt-10 animate-fade-in-delay-4">
            <h3 className="text-2xl md:text-3xl font-bold text-text-light mb-6 text-center border-b border-gray-700 pb-4">
              Your Current Trajectory
            </h3>
            <ProgressDisplay
              completedLessons={userProfile.completedLessons}
              practiceMinutes={userProfile.practiceMinutes}
              achievements={userProfile.achievements}
            />
          </div>
        )}

        {/* Add Practice Minutes Button (for testing/demonstration) */}
        <div className="mt-10 flex flex-col items-center border-t border-gray-700 pt-8 w-full">
            <button
              onClick={handleAddPracticeMinutes}
              className="px-6 py-3 text-lg font-bold rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-300 shadow-md"
            >
              Add 10 Practice Minutes (Test)
            </button>
            {practiceTimeAdded && (
              <p className="text-sky-400 mt-3 animate-fade-in">Minutes logged. Progress updated!</p>
            )}
        </div>

        {/* User ID for identification (less prominent here) */}
        {userId && (
          <p className="text-xs text-gray-500 mt-8 font-mono bg-gray-900 p-2 rounded-md break-all opacity-70">
            User ID: <span className="text-gray-300">{userId}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;