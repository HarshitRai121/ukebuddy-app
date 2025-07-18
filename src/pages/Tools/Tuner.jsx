// src/pages/Tools/Tuner.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react'; // Icons for microphone state

/**
 * Tuner component: Provides real-time ukulele tuning using the Web Audio API.
 * It detects pitch and provides visual feedback for each string.
 */
function Tuner() {
  const [isTuning, setIsTuning] = useState(false); // State to control tuner active/inactive
  const [currentNote, setCurrentNote] = useState('—'); // Detected note (e.g., G, C, E, A)
  const [pitchDifference, setPitchDifference] = useState(0); // Difference from target pitch (cents)
  const [status, setStatus] = useState('Click "Start Tuner" to begin.'); // Tuner status message
  const [error, setError] = useState(null); // Error message for microphone access

  // Web Audio API related refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const isMounted = useRef(true); // To prevent state updates on unmounted component

  // Define target frequencies for standard GCEA ukulele tuning
  const targetNotes = [
    { note: 'G', frequency: 392.00 },
    { note: 'C', frequency: 261.63 },
    { note: 'E', frequency: 329.63 },
    { note: 'A', frequency: 440.00 },
  ];

  // Function to calculate note from frequency (simplified for ukulele range)
  const getNoteFromFrequency = (frequency) => {
    if (frequency === 0) return { note: '—', diff: 0 };

    let closestNote = null;
    let minDiff = Infinity;

    for (const target of targetNotes) {
      const diff = 1200 * Math.log2(frequency / target.frequency); // Difference in cents
      if (Math.abs(diff) < Math.abs(minDiff)) {
        minDiff = diff;
        closestNote = target.note;
      }
    }

    if (Math.abs(minDiff) < 70) {
      return { note: closestNote, diff: minDiff };
    }
    return { note: '—', diff: 0 };
  };

  // Pitch detection function (Autocorrelation algorithm - improved)
  const detectPitch = (buffer, sampleRate) => {
    const minFreq = 200;
    const maxFreq = 600;
    const minPeriod = sampleRate / maxFreq;
    const maxPeriod = sampleRate / minFreq;

    let sumOfSquares = 0;
    for (let i = 0; i < buffer.length; i++) {
        sumOfSquares += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sumOfSquares / buffer.length);

    // console.log('DetectPitch: RMS (Amplitude):', rms.toFixed(4)); // Keep for further fine-tuning if needed

    const minVolumeThreshold = 0.01;
    if (rms < minVolumeThreshold) {
        // console.log('DetectPitch: Signal too quiet (RMS <', minVolumeThreshold, ') -> Returning 0 pitch'); // Debug
        return 0;
    }

    let bestCorrelation = -1;
    let bestPeriod = -1;

    for (let period = Math.floor(minPeriod); period <= Math.ceil(maxPeriod); period++) {
      let correlation = 0;
      for (let i = 0; i < buffer.length - period; i++) {
        correlation += buffer[i] * buffer[i + period];
      }
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    if (bestPeriod === -1) {
        // console.log('DetectPitch: No strong correlation found -> Returning 0 pitch'); // Debug
        return 0;
    }

    const pitch = sampleRate / bestPeriod;
    // console.log('DetectPitch: Calculated Period:', bestPeriod, 'Detected Pitch (Hz):', pitch.toFixed(2)); // Debug
    return pitch;
  };

  // Main audio processing loop
  const processAudio = () => {
    // console.log('ProcessAudio: Starting audio frame processing...'); // Debug - now this should always be successful

    // These conditions are crucial. If any are false, we stop the loop.
    // isTuning should be true here due to the useEffect trigger.
    if (!analyserRef.current || !isTuning || !isMounted.current) {
        // This log should ideally not appear after the fix unless stopTuner is called.
        console.log('ProcessAudio: Conditions NOT MET for processing (analyser, isTuning, or isMounted is false). This should be rare now.');
        return;
    }

    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(dataArray);

    const pitch = detectPitch(dataArray, audioContextRef.current.sampleRate);
    const { note, diff } = getNoteFromFrequency(pitch);

    // isMounted.current check is important for preventing updates on unmounted components
    if (isMounted.current) {
      setCurrentNote(note);
      setPitchDifference(diff);
      if (note === '—') {
        setStatus('Pluck a string!');
      } else {
        if (Math.abs(diff) < 5) {
          setStatus('In Tune! ✅');
        } else if (diff > 0) {
          setStatus('Too Sharp! ⬆️');
        } else {
          setStatus('Too Flat! ⬇️');
        }
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(processAudio);
  };

  // Start the tuner
  const startTuner = async () => {
    console.log('StartTuner: Button clicked. Attempting to start tuner...');
    if (isTuning) {
      console.log('StartTuner: Tuner already active. Aborting.');
      return;
    }

    setError(null);
    setStatus('Requesting microphone access...');
    console.log('StartTuner: Status set to "Requesting microphone access..."');

    try {
      console.log('StartTuner: Calling navigator.mediaDevices.getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('StartTuner: Microphone stream obtained successfully.');

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      console.log('StartTuner: AudioContext created.');

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      console.log('StartTuner: Analyser created and fftSize set.');

      mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      mediaStreamSourceRef.current.connect(analyserRef.current);
      console.log('StartTuner: MediaStreamSource connected to Analyser.');

      // --- CRITICAL CHANGE: Set isTuning true, but DO NOT start requestAnimationFrame here. ---
      // The useEffect below will handle starting the animation frame once isTuning is truly true.
      setIsTuning(true);
      setStatus('Tuner active. Pluck a string!');
      console.log('StartTuner: Tuner state set to active. Waiting for useEffect to start loop...');

    } catch (err) {
      console.error("StartTuner: Error accessing microphone:", err);
      setError("Microphone access denied or not available. Please allow microphone access in your browser settings.");
      setStatus('Error: Microphone access needed.');
      setIsTuning(false);
    }
  };

  // Stop the tuner
  const stopTuner = () => {
    console.log('StopTuner: Stopping tuner...');
    setIsTuning(false); // This will cause the useEffect below to clean up
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null; // Important: Clear the ref
      console.log('StopTuner: Animation frame canceled.');
    }
    if (mediaStreamSourceRef.current && mediaStreamSourceRef.current.mediaStream) {
        mediaStreamSourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
        console.log('StopTuner: Microphone tracks stopped.');
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
      console.log('StopTuner: MediaStreamSource disconnected.');
    }
    if (audioContextRef.current) {
      // Ensure context is not null before closing
      if (audioContextRef.current.state !== 'closed') { // Check state to avoid error if already closed
          audioContextRef.current.close();
      }
      audioContextRef.current = null;
      console.log('StopTuner: AudioContext closed.');
    }
    setCurrentNote('—');
    setPitchDifference(0);
    setStatus('Tuner stopped.');
    setError(null);
    console.log('StopTuner: Tuner state reset.');
  };

  // --- NEW useEffect: Responsible for starting/stopping the audio processing loop ---
  useEffect(() => {
    // This effect runs whenever isTuning changes
    if (isTuning && analyserRef.current && audioContextRef.current && isMounted.current) {
      console.log('useEffect (isTuning): isTuning is true, analyser/context exist. Starting processAudio loop.');
      animationFrameIdRef.current = requestAnimationFrame(processAudio);
    } else if (!isTuning && animationFrameIdRef.current) {
      // Cleanup: if isTuning becomes false, cancel the current loop
      console.log('useEffect (isTuning): isTuning is false. Cancelling animation frame.');
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null; // Clear the ref
    }

    // Cleanup for when component unmounts or dependencies change (e.g., isTuning becomes false)
    return () => {
        // This specific cleanup ensures the animation frame stops when isTuning turns off
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
            console.log('useEffect (isTuning cleanup): Animation frame canceled during effect cleanup.');
        }
    };
  }, [isTuning]); // Dependency array: run this effect when isTuning changes

  // Original cleanup on component unmount
  useEffect(() => {
    console.log('useEffect (component mount): Tuner component mounted. Setting up unmount cleanup.');
    return () => {
      isMounted.current = false; // Mark component as unmounted
      console.log('useEffect (component unmount): Tuner component unmounting. Calling stopTuner.');
      stopTuner(); // Ensure tuner is stopped when component unmounts
    };
  }, []); // Empty dependency array: runs once on mount, cleanup on unmount

  // Determine indicator color and position based on pitch difference
  const indicatorPosition = Math.max(-100, Math.min(100, pitchDifference)); // Clamp between -100 and 100 cents
  const indicatorColor =
    Math.abs(pitchDifference) < 5 ? 'bg-neon-lime' : // Very close (green)
    Math.abs(pitchDifference) < 20 ? 'bg-neon-yellow' : // Slightly off (yellow)
    'bg-neon-magenta'; // Significantly off (magenta)

  return (
    <div className="container mx-auto p-4 md:p-8 pt-24 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border flex flex-col items-center max-w-xl w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-6 text-center animate-fade-in">
          Ukulele Tuner
        </h2>

        {error && (
          <div className="text-red-400 text-center text-lg p-4 bg-red-900 bg-opacity-30 rounded-lg mb-6 w-full">
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center justify-center mb-8">
          {isTuning ? (
            <Mic className="w-16 h-16 text-neon-lime animate-pulse-subtle" />
          ) : (
            <MicOff className="w-16 h-16 text-text-muted" />
          )}
        </div>

        <p className="text-xl text-text-light mb-4">{status}</p>

        {/* Note Display */}
        <div className="relative w-48 h-48 rounded-full bg-dark-bg flex items-center justify-center mb-8 border-4 border-dark-border shadow-inner">
          <span className="text-8xl font-extrabold text-neon-yellow drop-shadow-lg animate-fade-in">
            {currentNote}
          </span>
          {/* Subtle glow for the circle */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent animate-pulse-subtle" style={{ boxShadow: '0 0 20px var(--color-neon-yellow) inset' }}></div>
        </div>

        {/* Pitch Indicator (Meter) */}
        <div className="w-full max-w-md bg-dark-bg h-8 rounded-full overflow-hidden relative mb-8 border border-dark-border">
          {/* Center line */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-text-muted"></div>
          {/* Indicator */}
          <div
            className={`absolute h-full w-1/2 rounded-full transition-transform duration-100 ${indicatorColor}`}
            style={{ transform: `translateX(calc(${indicatorPosition}% - 50%))` }}
          ></div>
        </div>

        {/* Tuner Control Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={startTuner}
            disabled={isTuning}
            className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300
                        ${isTuning ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-neon-lime text-dark-bg shadow-lg hover:shadow-neon-lime animate-cta-pulse'}`}
          >
            Start Tuner
          </button>
          <button
            onClick={stopTuner}
            disabled={!isTuning}
            className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300
                        ${!isTuning ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-neon-magenta text-dark-bg shadow-lg hover:shadow-neon-magenta'}`}
          >
            Stop Tuner
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tuner;