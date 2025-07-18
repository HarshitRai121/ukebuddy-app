// src/pages/Practice/ChordLibrary.jsx
import React, { useState } from 'react';
import ChordDiagram from '../../components/ChordDiagram'; // Import our ChordDiagram component
import { Search } from 'lucide-react'; // For a search icon

/**
 * ChordLibrary component: Displays a comprehensive list of ukulele chords
 * with interactive diagrams. Users can search and filter chords.
 */
function ChordLibrary() {
  // Define a more extensive list of common ukulele chords
  // Each chord object includes:
  // - name: Display name of the chord
  // - frets: Array of fret numbers for G, C, E, A strings (0=open, -1=muted)
  // - fingers: Array of finger numbers (0=none, 1=index, 2=middle, etc.)
  // - barre: Optional object for barre chords { fret: number, strings: [start_string_index, end_string_index] }
  const allUkuleleChords = [
    { name: 'C Major', frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
    { name: 'G Major', frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
    { name: 'Am (A Minor)', frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0] },
    { name: 'F Major', frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
    { name: 'D Major', frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
    { name: 'E Minor', frets: [0, 4, 3, 2], fingers: [0, 3, 2, 1] },
    { name: 'A Major', frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
    { name: 'D Minor', frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
    { name: 'Bb (B Flat) Major', frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1], barre: { fret: 1, strings: [2, 3, 4] } },
    { name: 'B Minor', frets: [4, 2, 2, 2], fingers: [3, 1, 1, 1], barre: { fret: 2, strings: [2, 3, 4] } },
    { name: 'C7 (C Seventh)', frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] },
    { name: 'G7 (G Seventh)', frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },
    { name: 'D7 (D Seventh)', frets: [2, 0, 2, 0], fingers: [2, 0, 3, 0] },
    { name: 'E7 (E Seventh)', frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] }, // Common alternative for E7
    { name: 'A7 (A Seventh)', frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0] },
    { name: 'Dm7 (D Minor Seventh)', frets: [2, 2, 1, 3], fingers: [2, 1, 0, 3] },
    { name: 'Cadd9 (C Add 9)', frets: [0, 2, 0, 3], fingers: [0, 2, 0, 3] },
    { name: 'Gsus4 (G Suspended 4)', frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
    { name: 'Fmaj7 (F Major 7)', frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0] }, // Same as Am, but context matters
    { name: 'Cdim (C Diminished)', frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
    { name: 'C#m (C Sharp Minor)', frets: [1, 1, 0, 4], fingers: [1, 2, 0, 4] },
    { name: 'Db (D Flat) Major', frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barre: { fret: 1, strings: [1, 2, 3, 4] } },
    { name: 'Eb (E Flat) Major', frets: [3, 3, 3, 1], fingers: [3, 2, 1, 1], barre: { fret: 1, strings: [2, 3, 4] } },
    { name: 'Gb (G Flat) Major', frets: [3, 3, 2, 1], fingers: [3, 4, 2, 1] },
    { name: 'Ab (A Flat) Major', frets: [1, 3, 4, 3], fingers: [1, 2, 4, 3] },
    { name: 'B Major', frets: [4, 3, 2, 2], fingers: [4, 3, 1, 2] },
    { name: 'C# (C Sharp) Major', frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barre: { fret: 1, strings: [1, 2, 3, 4] } },
    { name: 'D# (D Sharp) Major', frets: [3, 3, 3, 6], fingers: [1, 1, 1, 4], barre: { fret: 3, strings: [1, 2, 3, 4] } },
    { name: 'F# (F Sharp) Major', frets: [3, 1, 2, 1], fingers: [3, 1, 2, 1] },
    { name: 'G# (G Sharp) Major', frets: [1, 3, 4, 3], fingers: [1, 2, 4, 3] }, // Same as Ab
  ];

  const [searchTerm, setSearchTerm] = useState('');

  // Filter chords based on the search term
  const filteredChords = allUkuleleChords.filter(chord =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8 pt-24 min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 md:p-8 border border-dark-border flex-grow">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-8 text-center animate-fade-in">
          Ukulele Chord Library
        </h2>

        {/* Search Input */}
        <div className="relative mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search chords (e.g., C, G, Minor)"
            className="w-full p-3 pl-10 rounded-lg bg-dark-bg border border-dark-border text-text-light
                       focus:outline-none focus:ring-2 focus:ring-neon-lime focus:border-transparent
                       transition-all duration-300 placeholder-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        </div>

        {filteredChords.length === 0 && (
          <p className="text-center text-text-muted text-lg mt-12">
            No chords found matching "{searchTerm}". Try a different search.
          </p>
        )}

        {/* Chord Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredChords.map((chord, index) => (
            <ChordDiagram key={chord.name + index} chord={chord} width={180} height={220} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChordLibrary;
