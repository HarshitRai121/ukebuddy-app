// src/pages/Tools/ToolsPage.jsx
import React, { useState } from 'react';
import Tuner from './Tuner';
import Metronome from './Metronome';
import UkuleleAssistant from './UkuleleAssistant'; // Import UkuleleAssistant

/**
 * ToolsPage component: Acts as a container for various ukulele tools (Tuner, Metronome, Ukulele Assistant).
 * It manages a sub-navigation to switch between these tools.
 */
function ToolsPage() {
  const [activeTool, setActiveTool] = useState('tuner'); // State to manage active tool

  const renderTool = () => {
    switch (activeTool) {
      case 'tuner':
        return <Tuner />;
      case 'metronome':
        return <Metronome />;
      case 'assistant': // New case for Ukulele Assistant
        return <UkuleleAssistant />;
      default:
        return <Tuner />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 pt-24 min-h-[calc(100vh-8rem)] flex flex-col items-center">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border w-full max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-8 text-center animate-fade-in">
          Ukulele Tools
        </h2>

        {/* Sub-navigation for tools */}
        <div className="flex justify-center space-x-4 mb-8 flex-wrap"> {/* Added flex-wrap for responsiveness */}
          <button
            onClick={() => setActiveTool('tuner')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mb-2 md:mb-0
              ${activeTool === 'tuner'
                ? 'bg-neon-lime text-dark-bg shadow-md scale-105'
                : 'bg-dark-bg text-text-light hover:bg-dark-border'
              }`}
          >
            Tuner
          </button>
          <button
            onClick={() => setActiveTool('metronome')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mb-2 md:mb-0
              ${activeTool === 'metronome'
                ? 'bg-neon-lime text-dark-bg shadow-md scale-105'
                : 'bg-dark-bg text-text-light hover:bg-dark-border'
              }`}
          >
            Metronome
          </button>
          <button
            onClick={() => setActiveTool('assistant')} // New button for Assistant
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mb-2 md:mb-0
              ${activeTool === 'assistant'
                ? 'bg-neon-lime text-dark-bg shadow-md scale-105'
                : 'bg-dark-bg text-text-light hover:bg-dark-border'
              }`}
          >
            Assistant
          </button>
        </div>

        {/* Render the active tool component */}
        {renderTool()}
      </div>
    </div>
  );
}

export default ToolsPage;
