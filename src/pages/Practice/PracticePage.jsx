// src/pages/Practice/PracticePage.jsx
import React, { useState } from 'react';
import ChordLibrary from './ChordLibrary';
import StrummingPatterns from './StrummingPatterns';
import SongLibrary from './SongLibrary';
import PracticeTimer from './PracticeTimer'; // Import PracticeTimer

/**
 * PracticePage component: Acts as a container for various ukulele practice modules
 * (Chord Library, Strumming Patterns, Song Library, Practice Timer).
 * It manages a sub-navigation to switch between these.
 */
function PracticePage() {
  const [activePracticeModule, setActivePracticeModule] = useState('chord-library'); // State to manage active practice module

  const renderPracticeModule = () => {
    switch (activePracticeModule) {
      case 'chord-library':
        return <ChordLibrary />;
      case 'strumming-patterns':
        return <StrummingPatterns />;
      case 'song-library':
        return <SongLibrary />;
      case 'practice-timer': // New case for Practice Timer
        return <PracticeTimer />;
      default:
        return <ChordLibrary />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 pt-24 min-h-[calc(100vh-8rem)] flex flex-col items-center">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border w-full max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-8 text-center animate-fade-in">
          Ukulele Practice
        </h2>

        {/* Sub-navigation for practice modules */}
        <div className="flex justify-center space-x-4 mb-8 flex-wrap">
          <button
            onClick={() => setActivePracticeModule('chord-library')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mb-2 md:mb-0
              ${activePracticeModule === 'chord-library'
                ? 'bg-neon-lime text-dark-bg shadow-md scale-105'
                : 'bg-dark-bg text-text-light hover:bg-dark-border'
              }`}
          >
            Chord Library
          </button>
          <button
            onClick={() => setActivePracticeModule('strumming-patterns')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mb-2 md:mb-0
              ${activePracticeModule === 'strumming-patterns'
                ? 'bg-neon-lime text-dark-bg shadow-md scale-105'
                : 'bg-dark-bg text-text-light hover:bg-dark-border'
              }`}
          >
            Strumming Patterns
          </button>
          <button
            onClick={() => setActivePracticeModule('song-library')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mb-2 md:mb-0
              ${activePracticeModule === 'song-library'
                ? 'bg-neon-lime text-dark-bg shadow-md scale-105'
                : 'bg-dark-bg text-text-light hover:bg-dark-border'
              }`}
          >
            Song Library
          </button>
          <button
            onClick={() => setActivePracticeModule('practice-timer')} 
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mb-2 md:mb-0
              ${activePracticeModule === 'practice-timer'
                ? 'bg-neon-lime text-dark-bg shadow-md scale-105'
                : 'bg-dark-bg text-text-light hover:bg-dark-border'
              }`}
          >
            Practice Timer
          </button>
        </div>

        {/* Render the active practice module component */}
        {renderPracticeModule()}
      </div>
    </div>
  );
}

export default PracticePage;
