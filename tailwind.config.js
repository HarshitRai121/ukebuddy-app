// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ... existing fontFamily and colors ...
      colors: {
        'dark-bg': 'var(--color-dark-bg)',
        'dark-surface': 'var(--color-dark-surface)',
        'dark-border': 'var(--color-dark-border)',
        'neon-cyan': 'var(--color-neon-cyan)',
        'neon-magenta': 'var(--color-neon-magenta)',
        'neon-lime': 'var(--color-neon-lime)',
        'neon-yellow': 'var(--color-neon-yellow)',
        'neon-purple': '#A020F0', // Ensure this is defined
        'text-light': 'var(--color-text-light)',
        'text-muted': 'var(--color-text-muted)',
      },
      keyframes: {
        // ... existing keyframes ...
        'fade-in-delay-1': { // NEW: for delayed fade in
          '0%': { opacity: '0' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-delay-2': { // NEW: for delayed fade in
          '0%': { opacity: '0' },
          '70%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-delay-3': { // NEW: for delayed fade in
          '0%': { opacity: '0' },
          '85%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-delay-4': { // NEW: for delayed fade in
          '0%': { opacity: '0' },
          '90%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-fast': { // NEW: for the Zap icon
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        // ... all your other existing keyframes ...
        'fade-in': { /* ... */ },
        'pulse-subtle': { /* ... */ },
        'glitch-text': { /* ... */ },
        'cta-pulse': { /* ... */ },
        'bg-flicker': { /* ... */ },
        'spin-slow': { /* ... */ },
        'bg-pulse': { /* ... */ },
      },
      animation: {
        // ... existing animations ...
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-delay-1': 'fade-in-delay-1 2s ease-out forwards', // Apply different durations for staggered effect
        'fade-in-delay-2': 'fade-in-delay-2 2.5s ease-out forwards',
        'fade-in-delay-3': 'fade-in-delay-3 3s ease-out forwards',
        'fade-in-delay-4': 'fade-in-delay-4 3.5s ease-out forwards',
        'pulse-fast': 'pulse-fast 1s infinite ease-in-out', // NEW: for the Zap icon
        // ... all your other existing animations ...
        'pulse-subtle': 'pulse-subtle 3s infinite ease-in-out',
        'glitch-text': 'glitch-text 0.5s infinite alternate',
        'cta-pulse': 'cta-pulse 2s infinite ease-in-out',
        'bg-flicker': 'bg-flicker 5s infinite alternate',
        'spin-slow': 'spin-slow 10s linear infinite',
        'bg-pulse': 'bg-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}