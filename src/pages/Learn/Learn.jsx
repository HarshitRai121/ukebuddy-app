// src/pages/Learn/Learn.jsx
import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { marked } from 'marked';
import ChordDiagram from '../../components/ChordDiagram';
import { CheckCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext'; // Import useToast

/**
 * Learn component - where AI-generated lessons will be displayed.
 * Now includes a "Mark as Complete" button with toast notifications.
 */
function Learn() {
  const { db, loading: firebaseLoading, userProfile, markLessonComplete } = useFirebase();
  const { showToast } = useToast(); // Use the showToast hook
  const [lessonContent, setLessonContent] = useState('');
  const [lessonTitle, setLessonTitle] = useState('Ukulele Basics: Getting Started');
  const [lessonId, setLessonId] = useState('ukulele-basics-getting-started');
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Example Chord Data (will be moved to a dedicated Chord Library later)
  const exampleChords = [
    {
      name: 'C Major',
      frets: [0, 0, 0, 3], // G C E A
      fingers: [0, 0, 0, 3]
    },
    {
      name: 'G Major',
      frets: [0, 2, 3, 2], // G C E A
      fingers: [0, 1, 3, 2]
    },
    {
      name: 'Am (A Minor)',
      frets: [2, 0, 0, 0], // G C E A
      fingers: [2, 0, 0, 0]
    },
    {
      name: 'F Major',
      frets: [2, 0, 1, 0], // G C E A
      fingers: [2, 0, 1, 0]
    },
    {
      name: 'Bb (B Flat) Major',
      frets: [3, 2, 1, 1], // G C E A
      fingers: [3, 2, 1, 1], barre: { fret: 1, strings: [2, 3, 4] }
    },
    {
      name: 'E Major (Difficult)',
      frets: [4, 4, 4, 2], // G C E A
      fingers: [3, 2, 1, 0]
    },
    {
      name: 'D Major',
      frets: [2, 2, 2, 0], // G C E A
      fingers: [1, 2, 3, 0]
    },
    {
      name: 'C7 (C Seventh)',
      frets: [0, 0, 0, 1], // G C E A
      fingers: [0, 0, 0, 1]
    },
    {
      name: 'Muted String Example',
      frets: [-1, 0, 0, 0], // G muted, C E A open
      fingers: [0, 0, 0, 0]
    },
  ];


  // Function to call the Gemini API for content generation
  const generateContentWithAI = async (prompt) => {
    try {
      setLoadingContent(true);
      setError(null);

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        console.error("AI response structure unexpected:", result);
        throw new Error("Failed to generate content from AI. Unexpected response.");
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      throw new Error(`Failed to generate content: ${err.message}`);
    } finally {
      setLoadingContent(false);
    }
  };

  // Function to fetch or generate lesson content
  const fetchOrGenerateLesson = async () => {
    if (firebaseLoading || !db) {
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const lessonDocRef = doc(db, `artifacts/${appId}/public/data/lessons/${lessonId}`);

    try {
      setLoadingContent(true);
      setError(null);

      const docSnap = await getDoc(lessonDocRef);

      if (docSnap.exists()) {
        const cachedContent = docSnap.data().content;
        setLessonContent(cachedContent);
        console.log("Lesson content loaded from cache.");
      } else {
        console.log("Lesson content not in cache, generating with AI...");
        const prompt = `Generate a comprehensive, beginner-friendly lesson on "Ukulele Basics: Getting Started". Include sections on:
        1. What is a Ukulele? (briefly)
        2. Parts of the Ukulele (headstock, tuners, nut, neck, frets, fretboard, strings, body, bridge, soundhole)
        3. Holding the Ukulele (sitting and standing posture)
        4. Basic Strumming Introduction (downstroke, upstroke)
        5. Why is tuning important?
        Keep the language encouraging and simple. Use Markdown for headings, bullet points, and bold text. Aim for about 500-700 words.`;

        const generatedText = await generateContentWithAI(prompt);
        setLessonContent(generatedText);

        await setDoc(lessonDocRef, {
          title: lessonTitle,
          content: generatedText,
          generatedAt: new Date(),
          lessonId: lessonId,
          source: 'AI-Generated'
        });
        console.log("Lesson content generated and cached successfully.");
      }
    } catch (err) {
      console.error("Error fetching or generating lesson:", err);
      setError("Failed to load lesson content. Please try again.");
      setLessonContent("Failed to load lesson content. Please check your internet connection and try refreshing the page.");
      showToast("Failed to load lesson content.", "error"); // Show error toast
    } finally {
      setLoadingContent(false);
    }
  };

  // Effect to fetch lesson content and check completion status
  useEffect(() => {
    if (!firebaseLoading) {
      fetchOrGenerateLesson();
    }
  }, [firebaseLoading, db, lessonId]);

  // Effect to update completion status when userProfile or lessonId changes
  useEffect(() => {
    if (userProfile && userProfile.completedLessons) {
      setIsLessonCompleted(userProfile.completedLessons.includes(lessonId));
    }
  }, [userProfile, lessonId]);

  const handleMarkComplete = async () => {
    const success = await markLessonComplete(lessonId);
    if (success) {
      showToast("Lesson Completed! Great job!", "success"); // Show success toast
    } else {
      showToast("Lesson already completed or failed to mark.", "info"); // Show info toast if already done or failed
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 pt-24 min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border flex-grow">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-6 text-center animate-fade-in">
          {lessonTitle}
        </h2>

        {loadingContent ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-lime mb-4"></div>
            <p className="text-lg text-neon-lime">Generating lesson content with AI...</p>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center text-lg p-4 bg-red-900 bg-opacity-30 rounded-lg">
            <p>{error}</p>
            <button
              onClick={fetchOrGenerateLesson}
              className="mt-4 px-6 py-2 bg-neon-magenta text-dark-bg rounded-lg hover:bg-opacity-80 transition-colors duration-300 font-semibold"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div
                  className="prose prose-invert max-w-none text-text-light leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: lessonContent ? marked.parse(lessonContent) : '' }}
                />
              </div>
              <div className="lg:col-span-1 flex flex-col items-center space-y-6">
                <h3 className="text-2xl font-bold text-neon-yellow mb-4 text-center">Example Chords</h3>
                {exampleChords.slice(0, 4).map((chord, index) => (
                  <ChordDiagram key={index} chord={chord} width={180} height={220} />
                ))}
                <p className="text-text-muted text-center mt-4">
                  More chords available in the "Practice" section!
                </p>
              </div>
            </div>

            {/* Mark as Complete Button */}
            <div className="flex justify-center mt-10">
              {isLessonCompleted ? (
                <span className="px-8 py-3 text-lg font-bold rounded-full bg-green-700 text-white flex items-center shadow-lg">
                  <CheckCircle className="w-6 h-6 mr-2" /> Lesson Completed!
                </span>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  className="px-8 py-3 text-lg font-bold rounded-full bg-neon-lime text-dark-bg uppercase tracking-wide
                             shadow-lg hover:shadow-neon-lime transition-all duration-300 transform hover:scale-105 active:scale-95
                             focus:outline-none focus:ring-4 focus:ring-neon-lime focus:ring-opacity-75 animate-cta-pulse"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Learn;
