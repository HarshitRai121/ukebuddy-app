// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import AuthModal from '../components/AuthModal'; // Import the AuthModal
import { PlayCircle, Zap, TrendingUp, Users } from 'lucide-react'; // Icons for features

/**
 * LandingPage component: The public-facing entry point of the UkeBuddy app.
 * Features a visually appealing design with parallax effects, key features,
 * testimonials, and calls to action for login/signup.
 */
function LandingPage({ setActivePage }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // --- BRAND NEW, VERIFIED UNSPLASH IMAGE URLs for Parallax ---
  // Hero background: Person playing ukulele outdoors, slightly blurred, inspiring.
  const heroBg = "https://images.unsplash.com/photo-1596727027375-9c9e68b3f4d6?q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=1080&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  // Testimonials background: Abstract, soft bokeh/lights suggesting growth or clarity.
  const testimonialsBg = "https://images.unsplash.com/photo-1510915364894-399d63f357f8?q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=1080&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDBwYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="min-h-screen bg-dark-bg text-text-light font-inter overflow-x-hidden">
      {/* Hero Section - Jaw-dropping Parallax Background */}
      <section
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Subtle, professional overlay to ensure text readability */}
        <div className="absolute inset-0 bg-dark-bg bg-opacity-70 z-0"></div> 

        <div className="relative z-10 p-8 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight mb-6 animate-fade-in text-white drop-shadow-lg">
            Master the Ukulele. <br />
            <span className="text-sky-400">Your Way.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in-delay-1">
            Unlock your musical potential with adaptive AI guidance, real-time feedback, and a vibrant learning community.
          </p>
          <button
            onClick={openAuthModal}
            className="relative px-12 py-5 text-2xl font-bold rounded-full bg-sky-500 text-white uppercase tracking-wide
                       shadow-lg hover:shadow-sky-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-75"
          >
            <span className="relative z-10">START YOUR FREE JOURNEY</span>
          </button>
        </div>
      </section>

      {/* Features Section - Clean & Professional */}
      <section className="py-20 bg-dark-surface text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-white mb-12 animate-fade-in">
            Engineered for <span className="text-sky-400">Exceptional Progress</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-dark-bg p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-105 transition-transform duration-300 group">
              <PlayCircle className="w-16 h-16 text-gray-400 group-hover:text-sky-400 mx-auto mb-4 transition-colors duration-200" />
              <h3 className="text-2xl font-bold text-white mb-3">Intelligent Lessons</h3>
              <p className="text-gray-400">AI-powered learning paths that adapt to your unique pace and style.</p>
            </div>
            <div className="bg-dark-bg p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-105 transition-transform duration-300 delay-100 group">
              <Zap className="w-16 h-16 text-gray-400 group-hover:text-sky-400 mx-auto mb-4 transition-colors duration-200" />
              <h3 className="text-2xl font-bold text-white mb-3">Real-time Feedback</h3>
              <p className="text-gray-400">Instantaneous audio analysis helps perfect your chords and rhythm.</p>
            </div>
            <div className="bg-dark-bg p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-105 transition-transform duration-300 delay-200 group">
              <TrendingUp className="w-16 h-16 text-gray-400 group-hover:text-sky-400 mx-auto mb-4 transition-colors duration-200" />
              <h3 className="text-2xl font-bold text-white mb-3">Guided Practice</h3>
              <p className="text-gray-400">Structured exercises and progress tracking keep you focused and motivated.</p>
            </div>
            <div className="bg-dark-bg p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-105 transition-transform duration-300 delay-300 group">
              <Users className="w-16 h-16 text-gray-400 group-hover:text-sky-400 mx-auto mb-4 transition-colors duration-200" />
              <h3 className="text-2xl font-bold text-white mb-3">Supportive Community</h3>
              <p className="text-gray-400">Connect with peers and get expert answers from your dedicated AI Assistant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Subtle Parallax Background */}
      <section
        className="relative py-20 h-[60vh] flex items-center justify-center text-center bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${testimonialsBg})` }}
      >
        <div className="absolute inset-0 bg-dark-bg bg-opacity-80 z-0"></div> {/* Increased opacity for more focus on text */}
        <div className="relative z-10 p-8 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-12 animate-fade-in">
            Hear From Our <span className="text-sky-400">Inspired Students</span>
          </h2>
          {/* Simple testimonial card */}
          <div className="bg-dark-surface p-8 rounded-xl shadow-2xl border border-gray-700 animate-fade-in-delay-1">
            <p className="text-xl italic text-gray-300 mb-6">
              "UkeBuddy completely transformed how I learn. From beginner to playing full songs, the journey was incredibly intuitive and fun. This app is a game-changer for ukulele enthusiasts!"
            </p>
            <p className="text-lg font-semibold text-sky-400">- Chris P., Aspiring Musician</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Clean & Direct */}
      <section className="py-20 bg-dark-bg text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-5xl font-bold text-white mb-8 animate-fade-in">
            Ready to <span className="text-sky-400">Elevate Your Playing</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10 animate-fade-in-delay-1">
            Join thousands embracing a smarter way to master the ukulele. Your musical journey awaits.
          </p>
          <button
            onClick={openAuthModal}
            className="relative px-12 py-5 text-2xl font-bold rounded-full bg-sky-500 text-white uppercase tracking-wide
                       shadow-lg hover:shadow-sky-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-75"
          >
            <span className="relative z-10">START YOUR FREE TRIAL</span>
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default LandingPage;