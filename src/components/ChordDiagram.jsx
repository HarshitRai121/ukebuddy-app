// src/components/ChordDiagram.jsx
import React from 'react';

/**
 * ChordDiagram component: Renders an SVG representation of a ukulele chord.
 * It dynamically draws the fretboard, strings, frets, and finger positions.
 *
 * Props:
 * - chord: An object containing chord data.
 * Example: {
 * name: 'C Major',
 * frets: [0, 0, 0, 3], // Fret number for each string (G, C, E, A). 0 for open, -1 for muted.
 * fingers: [0, 0, 0, 3], // Finger number for each string (1=index, 2=middle, etc., 0 for open/muted).
 * barre: { fret: -1, strings: [] }, // For barre chords: { fret: 1, strings: [1, 2, 3, 4] }
 * capo: -1 // Capo fret position, -1 if no capo
 * }
 * - width: Desired width of the SVG (default 200)
 * - height: Desired height of the SVG (default 250)
 */
function ChordDiagram({ chord, width = 200, height = 250 }) {
  if (!chord || !chord.frets || chord.frets.length !== 4) {
    console.error("Invalid chord data provided to ChordDiagram:", chord);
    return (
      <div className="text-red-400 text-center p-4 bg-red-900 bg-opacity-30 rounded-lg">
        Invalid chord data.
      </div>
    );
  }

  const numFrets = 5; // Display 5 frets on the diagram
  const numStrings = 4; // Ukulele has 4 strings (G, C, E, A)

  // Calculate dimensions for drawing
  const fretSpacing = (width * 0.8) / numFrets; // Space between frets
  const stringSpacing = (height * 0.7) / numStrings; // Space between strings

  const startX = width * 0.1; // Starting X position for the fretboard
  const startY = height * 0.1; // Starting Y position for the fretboard

  // Adjust for the nut line thickness
  const nutThickness = 5;

  // Define dotRadius here, making it accessible to both sections
  const dotRadius = fretSpacing * 0.2; // Radius of the finger dot (moved from inside the map)

  return (
    <div className="flex flex-col items-center p-4 bg-dark-surface rounded-xl border border-dark-border shadow-lg">
      {chord.name && (
        <h3 className="text-xl font-bold text-neon-cyan mb-4">{chord.name}</h3>
      )}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Fretboard Background (optional, for visual clarity) */}
        <rect
          x={startX}
          y={startY}
          width={width * 0.8}
          height={fretSpacing * numFrets}
          fill="#333" // Dark wood-like background
          rx="5" ry="5" // Rounded corners for the fretboard
        />

        {/* Strings */}
        {Array.from({ length: numStrings }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={startX}
            y1={startY + i * stringSpacing + stringSpacing / 2}
            x2={startX + width * 0.8}
            y2={startY + i * stringSpacing + stringSpacing / 2}
            stroke="#999" // String color
            strokeWidth="1.5"
          />
        ))}

        {/* Frets */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={startX + i * fretSpacing}
            y1={startY}
            x2={startX + i * fretSpacing}
            y2={startY + stringSpacing * (numStrings - 0.5)} // Adjust height to cover strings
            stroke="#666" // Fret color
            strokeWidth={i === 0 ? nutThickness : 1.5} // Thicker for the nut
            strokeLinecap="round"
          />
        ))}

        {/* Finger Positions (Dots) */}
        {chord.frets.map((fret, stringIndex) => {
          // Calculate dot position based on fret and string
          const dotX = startX + (fret - 0.5) * fretSpacing + fretSpacing / 2;
          const dotY = startY + stringIndex * stringSpacing + stringSpacing / 2;
          // dotRadius is now defined outside this map loop

          if (fret > 0) { // If fret is greater than 0, draw a finger dot
            return (
              <g key={`dot-${stringIndex}`} className="animate-pulse-subtle">
                <circle
                  cx={dotX}
                  cy={dotY}
                  r={dotRadius} // Uses the shared dotRadius
                  fill="var(--color-neon-cyan)" // Neon color for active finger
                  stroke="var(--color-neon-magenta)"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                {chord.fingers && chord.fingers[stringIndex] > 0 && (
                  <text
                    x={dotX}
                    y={dotY + dotRadius / 2} // Adjust text position slightly
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={dotRadius * 0.9}
                    fill="var(--color-dark-bg)" // Dark text on neon dot
                    fontWeight="bold"
                  >
                    {chord.fingers[stringIndex]}
                  </text>
                )}
              </g>
            );
          } else if (fret === 0) { // Open string
            return (
              <circle
                key={`open-${stringIndex}`}
                cx={startX - dotRadius * 0.7} // Position above the nut
                cy={startY + stringIndex * stringSpacing + stringSpacing / 2}
                r={dotRadius * 0.5} // Uses the shared dotRadius
                fill="none"
                stroke="var(--color-neon-lime)" // Neon color for open string indicator
                strokeWidth="2"
              />
            );
          } else if (fret === -1) { // Muted string
            return (
              <text
                key={`muted-${stringIndex}`}
                x={startX - dotRadius * 0.7} // Position above the nut
                y={startY + stringIndex * stringSpacing + stringSpacing / 2 + dotRadius * 0.3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={dotRadius * 1.2}
                fill="var(--color-neon-yellow)" // Neon color for muted string indicator
                fontWeight="bold"
              >
                X
              </text>
            );
          }
          return null;
        })}

        {/* Barre Chord (if applicable) */}
        {chord.barre && chord.barre.fret > 0 && chord.barre.strings && chord.barre.strings.length > 1 && (
          <rect
            x={startX + (chord.barre.fret - 1) * fretSpacing + fretSpacing / 4} // Start slightly before the fret
            y={startY + (chord.barre.strings[0] - 1) * stringSpacing + stringSpacing / 2 - dotRadius * 0.8} // Top string (uses dotRadius)
            width={fretSpacing * 0.5} // Width of the barre
            height={(chord.barre.strings[chord.barre.strings.length - 1] - chord.barre.strings[0] + 1) * stringSpacing + dotRadius * 1.6} // Height covering strings (uses dotRadius)
            fill="var(--color-neon-magenta)"
            rx="5" ry="5" // Rounded corners for barre
            className="animate-pulse-subtle"
          />
        )}
      </svg>
    </div>
  );
}

export default ChordDiagram;