// src/components/ProgressDisplay.jsx
import React from 'react';
import { Award, BookOpen, Clock } from 'lucide-react'; // Icons for achievements, lessons, time

/**
 * ProgressDisplay component: Shows user's completed lessons, practice minutes,
 * and unlocked achievements.
 */
function ProgressDisplay({ completedLessons = [], practiceMinutes = 0, achievements = [] }) {
  // Define achievement details for display
  const allAchievements = {
    'first-lesson-complete': {
      name: 'First Step Master',
      description: 'Completed your very first lesson!',
      icon: <BookOpen className="w-6 h-6 text-neon-lime" />,
      color: 'bg-neon-lime'
    },
    '10-minutes-practice': {
      name: '10-Minute Streak',
      description: 'Practiced for 10 minutes!',
      icon: <Clock className="w-6 h-6 text-neon-yellow" />,
      color: 'bg-neon-yellow'
    },
    '30-minutes-practice': {
      name: 'Rhythm Builder',
      description: 'Practiced for 30 minutes!',
      icon: <Clock className="w-6 h-6 text-neon-yellow" />,
      color: 'bg-neon-yellow'
    },
    '60-minutes-practice': {
      name: 'Hour of Harmony',
      description: 'Practiced for 60 minutes!',
      icon: <Clock className="w-6 h-6 text-neon-yellow" />,
      color: 'bg-neon-yellow'
    },
    // Add more achievements here as the app grows
  };

  return (
    <div className="bg-dark-bg p-6 rounded-xl border border-dark-border shadow-inner w-full">
      <h3 className="text-2xl font-bold text-neon-cyan mb-4 text-center">Your Progress</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Completed Lessons */}
        <div className="bg-dark-surface p-4 rounded-lg flex items-center justify-between shadow-md border border-dark-border">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-neon-lime mr-3" />
            <div>
              <p className="text-text-muted text-sm">Lessons Completed</p>
              <p className="text-3xl font-extrabold text-neon-yellow">{completedLessons.length}</p>
            </div>
          </div>
          {/* Progress bar (simple for now) */}
          <div className="w-24 h-2 bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-neon-lime transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, (completedLessons.length / 5) * 100)}%` }} // Example: 5 lessons for 100%
            ></div>
          </div>
        </div>

        {/* Practice Minutes */}
        <div className="bg-dark-surface p-4 rounded-lg flex items-center justify-between shadow-md border border-dark-border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-neon-magenta mr-3" />
            <div>
              <p className="text-text-muted text-sm">Practice Minutes</p>
              <p className="text-3xl font-extrabold text-neon-yellow">{practiceMinutes}</p>
            </div>
          </div>
          {/* Progress bar (simple for now) */}
          <div className="w-24 h-2 bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-neon-magenta transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, (practiceMinutes / 60) * 100)}%` }} // Example: 60 mins for 100%
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <h4 className="text-xl font-bold text-neon-cyan mb-3 text-center">Achievements Unlocked</h4>
      {achievements.length === 0 ? (
        <p className="text-text-muted text-center italic">No achievements yet. Keep learning!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievementId) => {
            const achievement = allAchievements[achievementId];
            if (!achievement) return null; // Handle undefined achievements

            return (
              <div
                key={achievementId}
                className={`flex items-center p-3 rounded-lg shadow-md border border-dark-border ${achievement.color}/20 animate-fade-in`}
              >
                <div className={`p-2 rounded-full ${achievement.color}/40 mr-3`}>
                  {achievement.icon}
                </div>
                <div>
                  <p className="font-semibold text-text-light">{achievement.name}</p>
                  <p className="text-text-muted text-sm">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProgressDisplay;
