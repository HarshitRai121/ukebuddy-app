// src/pages/Tools/Metronome.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Minus } from 'lucide-react'; // Icons for controls

/**
 * Metronome component: Provides a customizable metronome with
 * adjustable BPM, visual beat indicator, and audio click.
 */
function Metronome() {
  const [bpm, setBpm] = useState(100); // Beats per minute
  const [isPlaying, setIsPlaying] = useState(false); // Play/Pause state
  const [currentBeat, setCurrentBeat] = useState(0); // Current beat for visual indicator (0-3 for 4/4 time)
  const [error, setError] = useState(null); // Error state

  // Web Audio API refs for precise timing
  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const lookaheadRef = useRef(25.0); // How frequently to check for scheduled notes (ms)
  const scheduleAheadTimeRef = useRef(0.1); // How far ahead to schedule audio (seconds)
  const timerIdRef = useRef(null); // For setInterval

  // Audio buffer for the metronome click sound
  const clickBufferRef = useRef(null);

  // Function to load the click sound (simple sine wave for now)
  const loadClickSound = async () => {
    if (!audioContextRef.current) return;

    // Create a simple sine wave click sound
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime); // A5 note for click
    gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime); // Volume

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    // Create a buffer from the oscillator output
    const frameCount = audioContextRef.current.sampleRate * 0.1; // 0.1 seconds duration
    const myArrayBuffer = audioContextRef.current.createBuffer(1, frameCount, audioContextRef.current.sampleRate);
    const nowBuffering = myArrayBuffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      nowBuffering[i] = Math.sin(i / (audioContextRef.current.sampleRate / (880 * 2 * Math.PI)));
    }
    clickBufferRef.current = myArrayBuffer;
  };

  // Function to play a single click sound
  const playClick = (time) => {
    if (!clickBufferRef.current || !audioContextRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = clickBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(time); // Play at the scheduled time
  };

  // Scheduling function for metronome beats
  const scheduler = () => {
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTimeRef.current) {
      // Schedule the click sound
      playClick(nextNoteTimeRef.current);

      // Update visual beat
      const beat = (currentBeatRef.current % 4) + 1; // 1-based beat count for 4/4
      setCurrentBeat(beat);
      currentBeatRef.current = beat; // Update ref for next iteration

      // Calculate next note time
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += secondsPerBeat;
    }
    timerIdRef.current = setTimeout(scheduler, lookaheadRef.current);
  };

  // Ref to hold currentBeat for scheduler closure
  const currentBeatRef = useRef(currentBeat);
  useEffect(() => {
    currentBeatRef.current = currentBeat;
  }, [currentBeat]);

  // Start Metronome
  const startMetronome = async () => {
    if (isPlaying) return;

    setError(null);
    setIsPlaying(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      await loadClickSound(); // Load sound when context is created
    }

    // Start audio context if suspended (e.g., after user interaction)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    setCurrentBeat(0); // Reset beat counter
    scheduler(); // Start scheduling
  };

  // Stop Metronome
  const stopMetronome = () => {
    setIsPlaying(false);
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }
    setCurrentBeat(0); // Reset visual beat
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopMetronome();
      if (audioContextRef.current) {
        audioContextRef.current.close(); // Close audio context to release resources
        audioContextRef.current = null;
      }
    };
  }, []);

  // Handle BPM changes
  const handleBpmChange = (newBpm) => {
    const clampedBpm = Math.max(40, Math.min(240, newBpm)); // Clamp BPM between 40 and 240
    setBpm(clampedBpm);
    // If playing, restart scheduler to apply new BPM immediately
    if (isPlaying) {
      stopMetronome();
      // Small delay to ensure stop is processed before restart
      setTimeout(startMetronome, 50);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 pt-24 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border flex flex-col items-center max-w-xl w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-6 text-center animate-fade-in">
          Ukulele Metronome
        </h2>

        {error && (
          <div className="text-red-400 text-center text-lg p-4 bg-red-900 bg-opacity-30 rounded-lg mb-6 w-full">
            <p>{error}</p>
          </div>
        )}

        {/* BPM Display and Controls */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => handleBpmChange(bpm - 5)}
            className="p-3 rounded-full bg-dark-bg text-neon-lime hover:bg-dark-border transition-colors duration-200 shadow-md"
            aria-label="Decrease BPM"
          >
            <Minus className="w-6 h-6" />
          </button>
          <span className="text-6xl font-extrabold text-neon-yellow drop-shadow-lg animate-fade-in">
            {bpm}
          </span>
          <span className="text-xl text-text-muted">BPM</span>
          <button
            onClick={() => handleBpmChange(bpm + 5)}
            className="p-3 rounded-full bg-dark-bg text-neon-lime hover:bg-dark-border transition-colors duration-200 shadow-md"
            aria-label="Increase BPM"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Beat Indicator */}
        <div className="flex space-x-3 mb-8">
          {[1, 2, 3, 4].map((beatNum) => (
            <div
              key={beatNum}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                transition-all duration-100 ease-out
                ${currentBeat === beatNum
                  ? 'bg-neon-magenta text-dark-bg scale-125 shadow-lg glow-border-cyan' // Active beat
                  : 'bg-dark-bg text-text-muted border border-dark-border' // Inactive beat
                }`}
            >
              {beatNum}
            </div>
          ))}
        </div>

        {/* Play/Pause Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={isPlaying ? stopMetronome : startMetronome}
            className={`px-10 py-4 text-xl font-bold rounded-full transition-all duration-300 uppercase
                       ${isPlaying
                         ? 'bg-neon-magenta text-dark-bg shadow-lg hover:shadow-neon-magenta' // Pause button style
                         : 'bg-neon-lime text-dark-bg shadow-lg hover:shadow-neon-lime animate-cta-pulse' // Play button style
                       }`}
          >
            {isPlaying ? (
              <>
                <Pause className="inline-block mr-2 w-6 h-6" /> Pause
              </>
            ) : (
              <>
                <Play className="inline-block mr-2 w-6 h-6" /> Start
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Metronome;
