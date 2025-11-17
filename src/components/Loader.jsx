import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex gap-1">
        {'SabiGuy'.split('').map((letter, index) => (
          <span
            key={index}
            className="text-5xl font-bold"
            style={{
              animation: `colorWave 2s ease-in-out infinite`,
              animationDelay: `${index * 0.15}s`,
              color: '#005823' // green-500
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes colorWave {
          0%, 100% {
            color: #005823; /* Dark green */
            transform: scale(1);
          }
          50% {
            color: #86efac; /* Light green */
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}