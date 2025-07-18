// src/hooks/useFirebase.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  createUserWithEmailAndPassword, // New import
  signInWithEmailAndPassword,     // New import
  signOut                       // New import
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// Create a context for Firebase services
const FirebaseContext = createContext(null);

// Custom hook to use Firebase services
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Firebase Provider component
export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for auth initialization
  const [authError, setAuthError] = useState(null); // New state for authentication errors

  // Ref to store the Firestore unsubscribe function
  const unsubscribeProfileRef = useRef(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // const firebaseConfig = typeof __firebase_config !== 'undefined'
        //   ? JSON.parse(__firebase_config)
        //   : null;

        // In src/hooks/useFirebase.jsx
        // Replace the line:
        // const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
        // With:
        const firebaseConfig = typeof __firebase_config !== 'undefined'
          ? JSON.parse(__firebase_config) // For Canvas environment
          : import.meta.env.VITE_FIREBASE_CONFIG ? JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG) : null; // For external deployment

        if (!firebaseConfig) {
          console.error("Firebase config not found. Cannot initialize Firebase.");
          setLoading(false);
          return;
        }

        const firebaseApp = initializeApp(firebaseConfig);
        setApp(firebaseApp);

        const firebaseAuth = getAuth(firebaseApp);
        const firestoreDb = getFirestore(firebaseApp);
        setAuth(firebaseAuth);
        setDb(firestoreDb);

        // Sign in with custom token or anonymously on initial load
        // This ensures a user session exists for Firestore access even if not explicitly logged in
        const authPromise = typeof __initial_auth_token !== 'undefined' && __initial_auth_token
          ? signInWithCustomToken(firebaseAuth, __initial_auth_token)
          : signInAnonymously(firebaseAuth);

        await authPromise;
        console.log("Firebase Auth initialized.");

        // Listen for auth state changes to set the userId and manage profile listener
        const unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            const currentUserId = user.uid;
            setUserId(currentUserId);
            setAuthError(null); // Clear any previous auth errors on successful login
            console.log("Auth state changed. User ID:", currentUserId);

            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const userDocRef = doc(firestoreDb, `artifacts/${appId}/users/${currentUserId}/profile/data`);

            // Ensure user profile exists
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
              console.log("Creating new user profile for:", currentUserId);
              await setDoc(userDocRef, {
                createdAt: new Date(),
                lastLogin: new Date(),
                completedLessons: [],
                practiceMinutes: 0,
                achievements: []
              });
            } else {
              console.log("User profile exists for:", currentUserId);
              await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });
            }

            // Set up real-time listener for user profile
            if (unsubscribeProfileRef.current) {
              unsubscribeProfileRef.current(); // Unsubscribe previous listener if exists
            }
            unsubscribeProfileRef.current = onSnapshot(userDocRef, (docSnapshot) => {
              if (docSnapshot.exists()) {
                setUserProfile(docSnapshot.data());
                console.log("User profile updated:", docSnapshot.data());
              } else {
                setUserProfile(null);
                console.log("User profile document does not exist.");
              }
            }, (error) => {
              console.error("Error listening to user profile:", error);
              setAuthError("Failed to load user profile in real-time.");
            });

          } else {
            setUserId(null);
            setUserProfile(null);
            if (unsubscribeProfileRef.current) {
              unsubscribeProfileRef.current();
              unsubscribeProfileRef.current = null;
            }
            console.log("User signed out or no user.");
          }
          setLoading(false);
        });

        // Cleanup auth subscription on unmount
        return () => {
          unsubscribeAuth();
          if (unsubscribeProfileRef.current) {
            unsubscribeProfileRef.current();
          }
        };

      } catch (error) {
        console.error("Error initializing Firebase or signing in:", error);
        setAuthError("Failed to initialize Firebase or sign in.");
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  // --- New Authentication Functions ---

  const signupUser = async (email, password) => {
    setAuthError(null);
    try {
      setLoading(true); // Indicate loading during signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user.uid);
      // onAuthStateChanged listener will handle setting userId and profile
      return true;
    } catch (error) {
      console.error("Error signing up:", error);
      setAuthError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setAuthError(null);
    try {
      setLoading(true); // Indicate loading during login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user.uid);
      // onAuthStateChanged listener will handle setting userId and profile
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      setAuthError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setAuthError(null);
    try {
      setLoading(true); // Indicate loading during logout
      await signOut(auth);
      console.log("User logged out.");
      // onAuthStateChanged listener will handle clearing userId and profile
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      setAuthError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- End New Authentication Functions ---

  const markLessonComplete = async (lessonId) => {
    if (!db || !userId || !userProfile) {
      console.warn("Firebase not ready or user not authenticated to mark lesson complete.");
      return false;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);

    try {
      const currentCompletedLessons = userProfile.completedLessons || [];
      if (!currentCompletedLessons.includes(lessonId)) {
        const updatedCompletedLessons = [...currentCompletedLessons, lessonId];
        await updateDoc(userDocRef, {
          completedLessons: updatedCompletedLessons,
          achievements: [...(userProfile.achievements || []), ...(updatedCompletedLessons.length === 1 ? ['first-lesson-complete'] : [])]
        });
        console.log(`Lesson "${lessonId}" marked as complete.`);
        return true;
      } else {
        console.log(`Lesson "${lessonId}" already marked as complete.`);
        return false;
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      return false;
    }
  };

  const addPracticeMinutes = async (minutes) => {
    if (!db || !userId || !userProfile) {
      console.warn("Firebase not ready or user not authenticated to add practice minutes.");
      return false;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);

    try {
      const currentPracticeMinutes = userProfile.practiceMinutes || 0;
      const updatedPracticeMinutes = currentPracticeMinutes + minutes;
      await updateDoc(userDocRef, {
        practiceMinutes: updatedPracticeMinutes,
        achievements: [...(userProfile.achievements || []),
          ...(currentPracticeMinutes < 10 && updatedPracticeMinutes >= 10 ? ['10-minutes-practice'] : []),
          ...(currentPracticeMinutes < 30 && updatedPracticeMinutes >= 30 ? ['30-minutes-practice'] : []),
          ...(currentPracticeMinutes < 60 && updatedPracticeMinutes >= 60 ? ['60-minutes-practice'] : [])
        ]
      });
      console.log(`${minutes} minutes added to practice time. Total: ${updatedPracticeMinutes}`);
      return true;
    } catch (error) {
      console.error("Error adding practice minutes:", error);
      return false;
    }
  };


  // Provide all Firebase instances, user ID, profile data/functions, and auth functions
  const value = {
    app,
    db,
    auth,
    userId,
    userProfile,
    loading,
    authError, // Expose authError
    signupUser,     // New function
    loginUser,      // New function
    logoutUser,     // New function
    markLessonComplete,
    addPracticeMinutes
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
