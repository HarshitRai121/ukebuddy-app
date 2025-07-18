// src/pages/Practice/StrummingPatterns.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Icons for strumming directions
import { useFirebase } from '../../hooks/useFirebase'; // To use Firestore for caching AI content
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * StrummingPatterns component: Displays various ukulele strumming patterns
 * with visual indicators and AI-generated descriptions/tips.
 */
function StrummingPatterns() {
  const { db, loading: firebaseLoading } = useFirebase();
  const [patternsWithDescriptions, setPatternsWithDescriptions] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState(null);

  // Define common strumming patterns.
  // 'pattern' uses 'D' for downstroke, 'U' for upstroke, 'x' for mute.
  // The patterns are defined such that split(' ') will yield the desired units (e.g., "DU", "UDU").
  const strummingPatterns = [
    { id: 'basic-down', name: 'Basic Down Strum', pattern: 'D D D D' },
    { id: 'down-up', name: 'Down-Up Strum', pattern: 'D U D U' },
    { id: 'island-strum', name: 'Island Strum', pattern: 'D DU UDU' }, // DU and UDU are single units
    { id: 'calypso-strum', name: 'Calypso Strum', pattern: 'DD UDUDU' }, // DD and UDUDU are single units
    { id: 'waltz-strum', name: 'Waltz Strum', pattern: 'D DU DU' }, // DU is a single unit
    { id: 'syncopated-strum', name: 'Syncopated Strum', pattern: 'D DDU UD' }, // DDU and UD are single units
    { id: 'chunky-strum', name: 'Chunky Strum (Muted)', pattern: 'DxU DxU DxU DxU' }, // DxU is a single unit
    { id: 'reggae-strum', name: 'Reggae Strum', pattern: 'D UU D UU' }, // UU is a single unit
  ];

  // Function to call the Gemini API for content generation
  const generateDescriptionWithAI = async (patternName, patternSequence) => {
    try {
      let chatHistory = [];
      const prompt = `Generate a concise, encouraging, and beginner-friendly description and tip for the ukulele strumming pattern "${patternName}" which has the sequence "${patternSequence}". Explain its feel or common use. Keep it to 2-3 sentences. Do NOT include any markdown formatting.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Check for HTTP errors (like 429, 400, 500) before parsing JSON
      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error response for more details
        console.error(
          "AI API HTTP Error for pattern:",
          patternName,
          `Status: ${response.status}`,
          `Status Text: ${response.statusText}`,
          "Error Data:", errorData
        );
        return null; // Return null on HTTP error
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        // This handles cases where response.ok is true but content structure is unexpected
        console.error("AI response structure unexpected for pattern:", patternName, result);
        return null; // Return null if structure is unexpected
      }
    } catch (err) {
      console.error("Error calling Gemini API for pattern:", patternName, err);
      return null; // Return null on network or other errors
    }
  };

  // Function to fetch or generate descriptions for all patterns
  const fetchOrGeneratePatternDescriptions = async () => {
    if (firebaseLoading || !db) {
      return;
    }

    setLoadingContent(true);
    setError(null);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    const patternsDocRef = doc(db, `artifacts/${appId}/public/data/strumming_patterns_cache`, 'strummingPatterns');

    try {
      const docSnap = await getDoc(patternsDocRef);
      let cachedPatterns = {};
      if (docSnap.exists()) {
        cachedPatterns = docSnap.data().patterns || {};
        console.log("Strumming pattern descriptions loaded from cache.");
      } else {
        console.log("Strumming pattern descriptions not in cache. Generating with AI...");
      }

      const updatedPatterns = await Promise.all(
        strummingPatterns.map(async (pattern) => {
          if (cachedPatterns[pattern.id] && cachedPatterns[pattern.id].description) {
            return { ...pattern, description: cachedPatterns[pattern.id].description };
          } else {
            const description = await generateDescriptionWithAI(pattern.name, pattern.pattern);

            // Only cache if description is not null (meaning AI generation was successful)
            if (description !== null) {
                cachedPatterns[pattern.id] = { description, generatedAt: new Date() };
                return { ...pattern, description };
            } else {
                // If generation failed, return the pattern with a default "Failed to generate" message
                // This will be displayed to the user but NOT cached, allowing re-attempt on next load
                return { ...pattern, description: "Failed to generate description. Please retry later." };
            }
          }
        })
      );

      // Only save to Firestore if there are valid patterns that were generated or updated.
      if (Object.keys(cachedPatterns).length > 0) {
        await setDoc(patternsDocRef, { patterns: cachedPatterns }, { merge: true });
        console.log("Strumming pattern descriptions updated in cache and state.");
      } else {
        console.log("No valid strumming pattern descriptions generated or found to cache.");
      }

      setPatternsWithDescriptions(updatedPatterns); // Always set state, even with failures, to display current status

    } catch (err) {
      console.error("Error fetching or generating strumming patterns:", err);
      setError("Failed to load strumming patterns. Please try again.");
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    if (!firebaseLoading) {
      fetchOrGeneratePatternDescriptions();
    }
  }, [firebaseLoading, db]); // Re-run when firebaseLoading or db changes

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-12rem)] flex flex-col">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border flex-grow">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-8 text-center animate-fade-in">
          Ukulele Strumming Patterns
        </h2>

        {loadingContent ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-lime mb-4"></div>
            <p className="text-lg text-neon-lime">Generating pattern insights with AI...</p>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center text-lg p-4 bg-red-900 bg-opacity-30 rounded-lg">
            <p>{error}</p>
            <button
              onClick={fetchOrGeneratePatternDescriptions}
              className="mt-4 px-6 py-2 bg-neon-magenta text-dark-bg rounded-lg hover:bg-opacity-80 transition-colors duration-300 font-semibold"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* **** THE KEY CHANGE IS HERE **** */}
            {/* Ensure patternsWithDescriptions is an array before mapping over it */}
            {Array.isArray(patternsWithDescriptions) && patternsWithDescriptions.map((pattern) => (
              <div
                key={pattern.id}
                className="bg-dark-bg p-6 rounded-xl border border-dark-border shadow-lg
                           flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-neon-yellow mb-3">{pattern.name}</h3>
                <div className="flex space-x-2 mb-4">
                  {/* Filter out empty strings after splitting */}
                  {pattern.pattern.split(' ').filter(stroke => stroke.trim() !== '').map((stroke, index) => {
                    let content;
                    let bgColorClass;

                    // Determine content and background based on stroke
                    if (stroke === 'D') {
                      content = <ChevronDown className="w-6 h-6" />;
                      bgColorClass = 'bg-neon-cyan';
                    } else if (stroke === 'U') {
                      content = <ChevronUp className="w-6 h-6" />;
                      bgColorClass = 'bg-neon-magenta';
                    } else if (stroke === 'x') {
                      content = <span className="text-dark-bg text-xl">X</span>; // Keep 'X' large for mute
                      bgColorClass = 'bg-text-muted';
                    }
                    // Handle combined strokes by rendering individual arrows/chars inside
                    else {
                      bgColorClass = 'bg-neon-lime'; // A different color for combined strums
                      content = (
                        // Use a flex container to hold multiple smaller arrows/chars
                        <div className="flex items-center justify-center h-full w-full">
                          {stroke.split('').map((char, charIndex) => {
                            if (char === 'D') {
                              return <ChevronDown key={charIndex} className="w-4 h-4 mx-[1px] text-dark-bg" />; // Smaller icons, slight margin
                            } else if (char === 'U') {
                              return <ChevronUp key={charIndex} className="w-4 h-4 mx-[1px] text-dark-bg" />; // Smaller icons, slight margin
                            } else if (char === 'x') {
                              return <span key={charIndex} className="text-dark-bg text-xs font-semibold mx-[1px]">X</span>; // Smaller 'X'
                            }
                            return null;
                          })}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold
                                   ${bgColorClass}
                                   ${(stroke === 'D' || stroke === 'U') ? 'glow-border-cyan' : ''}`}
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
                {pattern.description && (
                  <p className="text-text-light text-sm mt-2 leading-relaxed">
                    {pattern.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StrummingPatterns;