// src/pages/Practice/SongLibrary.jsx
import React, { useState } from 'react';

/**
 * SongLibrary component: Displays a list of beginner-friendly ukulele songs
 * and shows lyrics with chords for selected songs.
 */
function SongLibrary() {
  const [selectedSong, setSelectedSong] = useState(null); // State to hold the currently selected song

  // Define a list of beginner-friendly songs with lyrics and chords
  // Chords are embedded directly in the lyrics for simplicity, marked with []
  const songs = [
    {
      id: 'twinkle-twinkle',
      title: 'Twinkle, Twinkle Little Star',
      artist: 'Traditional',
      chords: ['C', 'G', 'Am', 'F'],
      lyrics: `[C]Twinkle, [G]twinkle, [Am]little [G]star,
[C]How I [G]wonder [C]what you [G]are.
[C]Up above the [F]world so [C]high,
[G]Like a [C]diamond [G]in the [C]sky.
[C]Twinkle, [G]twinkle, [Am]little [G]star,
[C]How I [G]wonder [C]what you [G]are.`
    },
    {
      id: 'you-are-my-sunshine',
      title: 'You Are My Sunshine',
      artist: 'Traditional',
      chords: ['C', 'G7', 'F'],
      lyrics: `The other [C]night, dear, as I [G7]lay sleeping
I dreamed I [C]held you in my [F]arms.
When I a[C]woke, dear, I was [G7]mistaken,
So I hung my [C]head and I [G7]cried.

[C]You are my [G7]sunshine, my only [C]sunshine,
You make me [F]happy when skies are [C]gray.
You'll never [G7]know, dear, how much I [C]love you,
Please don't take my [G7]sunshine a[C]way.`
    },
    {
      id: 'row-row-row-your-boat',
      title: 'Row, Row, Row Your Boat',
      artist: 'Traditional',
      chords: ['C', 'G', 'F'],
      lyrics: `[C]Row, row, row your [G]boat,
[G]Gently down the [C]stream.
[C]Merrily, merrily, [F]merrily, [C]merrily,
[G]Life is but a [C]dream.`
    },
    {
      id: 'happy-birthday',
      title: 'Happy Birthday',
      artist: 'Traditional',
      chords: ['C', 'G7', 'F'],
      lyrics: `[C]Happy birthday to [G7]you,
[G7]Happy birthday to [C]you,
[C]Happy birthday, dear [F](Name),
[C]Happy birthday to [G7]you.`
    }
  ];

  // Function to render lyrics with chords using a robust Flexbox inline unit
  const renderLyrics = (lyricsText) => {
    return lyricsText.split('\n').map((line, lineIndex) => {
      // Improved Regex: This regex is designed to capture either a chord token
      // OR a sequence of characters that are NOT part of a chord token.
      // The goal is to get distinct tokens for chords and for lyric text.
      // We use a non-capturing group (?:...) for the chord details,
      // but the outer () makes the whole chord pattern a capturing group,
      // so it's included in the split result.
      const tokens = line.split(/(\[[A-G][b#]?(?:maj|min|m|M|sus|add|dim|aug|7|9|11|13)?\d*\])/g)
                          .filter(token => token !== null && token !== undefined); // Remove null/undefined from split results

      let renderedLineContent = [];
      let currentLyricText = ''; // Accumulate plain text
      
      tokens.forEach((token, i) => {
        const isChordMarker = token.startsWith('[') && token.endsWith(']');

        if (isChordMarker) {
          // If there was accumulated plain text before this chord, render it
          if (currentLyricText.length > 0) {
            renderedLineContent.push(
              <span key={`${lineIndex}-text-${i}-before-chord`} className="text-text-light text-xl px-0.5 py-1">
                {currentLyricText}
              </span>
            );
            currentLyricText = ''; // Reset accumulated text
          }

          const chord = token.substring(1, token.length - 1); // Extract chord name

          // The *next* token in the array (if it exists and is not another chord) is its associated lyric.
          // This is the crucial part: we peek ahead for the lyric part.
          let lyricSegment = '';
          if (i + 1 < tokens.length && !tokens[i + 1].startsWith('[')) {
              lyricSegment = tokens[i + 1];
              tokens[i + 1] = ''; // "Consume" the lyric segment by nullifying it in the original array
                                  // This prevents it from being processed again as plain text.
          } else {
              // If there's no immediate lyric segment, or the next is another chord,
              // we can put an invisible space to ensure minimum width and proper spacing.
              lyricSegment = '\u00A0'; // Non-breaking space
          }
          
          // Trim only leading spaces from the lyric segment to preserve internal spaces
          lyricSegment = lyricSegment.replace(/^\s+/, ''); 

          renderedLineContent.push(
            <span
              key={`${lineIndex}-segment-${i}`}
              className="inline-flex flex-col items-center justify-end px-1 py-1 group" // px-1, py-1 for spacing around the unit
            >
              {/* Chord */}
              <span className="text-neon-yellow font-bold text-sm whitespace-nowrap glow-text-cyan
                                group-hover:scale-105 transition-transform duration-200 cursor-help"
              >
                {chord}
              </span>
              {/* Lyric word - the width of this determines the column width */}
              <span className="text-text-light text-xl mt-0.5 group-hover:text-neon-lime transition-colors duration-200">
                {lyricSegment}
              </span>
            </span>
          );
        } else {
          // This part is plain text or an empty string from splitting.
          // Accumulate it. We will render accumulated text when a chord is found or at line end.
          currentLyricText += token;
        }
      });

      // Render any accumulated plain text at the end of the line
      if (currentLyricText.length > 0) {
        renderedLineContent.push(
          <span key={`${lineIndex}-text-final`} className="text-text-light text-xl px-0.5 py-1">
            {currentLyricText}
          </span>
        );
      }

      return (
        <p key={lineIndex} className="mb-4 flex flex-wrap justify-center items-end leading-normal">
          {renderedLineContent}
        </p>
      );
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-12rem)] flex flex-col items-center">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border w-full max-w-4xl flex-grow">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-8 text-center animate-fade-in">
          Ukulele Song Library 🎶
        </h2>

        {!selectedSong ? (
          // Song List View - Cool Card UI
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <button
                key={song.id}
                onClick={() => setSelectedSong(song)}
                className="group bg-gradient-to-br from-dark-bg to-dark-surface p-6 rounded-xl border border-dark-border shadow-lg
                           flex flex-col items-center text-center transition-all duration-300 transform
                           hover:scale-105 hover:border-neon-lime hover:shadow-neon-lime/50
                           active:scale-98 focus:outline-none focus:ring-4 focus:ring-neon-lime/70
                           overflow-hidden relative
                           "
              >
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-neon-lime opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                <h3 className="text-2xl font-bold text-neon-yellow mb-2 group-hover:text-white transition-colors duration-300">
                  {song.title}
                </h3>
                <p className="text-text-muted text-sm mb-3 group-hover:text-text-light transition-colors duration-300">
                  {song.artist}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {song.chords.map((chord, index) => (
                    <span
                      key={index}
                      className="bg-dark-border text-text-light text-xs px-3 py-1 rounded-full
                                 group-hover:bg-neon-lime group-hover:text-dark-bg transition-all duration-300"
                    >
                      {chord}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Selected Song View - Enhanced Display
          <div className="flex flex-col items-center w-full animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-neon-yellow mb-2 text-center">{selectedSong.title}</h3>
            <p className="text-lg text-text-muted mb-6 text-center">{selectedSong.artist}</p>

            <div className="bg-dark-bg p-6 rounded-xl border border-dark-border shadow-inner max-w-2xl w-full text-left leading-relaxed text-lg overflow-y-auto custom-scrollbar h-[50vh] scroll-smooth">
              {renderLyrics(selectedSong.lyrics)}
            </div>

            <button
              onClick={() => setSelectedSong(null)}
              className="mt-8 px-8 py-3 text-lg font-bold rounded-full bg-neon-magenta text-dark-bg uppercase tracking-wide
                               shadow-lg hover:shadow-neon-magenta transition-all duration-300 transform hover:scale-105 active:scale-95
                               focus:outline-none focus:ring-4 focus:ring-neon-magenta focus:ring-opacity-75"
            >
              Back to Song List 🎸
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongLibrary;