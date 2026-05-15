import { memo } from 'react';

const beadData = [
  { color: '#FF6B9D', size: 48, x: '15%', y: '10%', delay: 0, duration: 3 },
  { color: '#FFB347', size: 36, x: '80%', y: '15%', delay: 0.5, duration: 3.5 },
  { color: '#4ADE80', size: 40, x: '70%', y: '65%', delay: 1, duration: 2.8 },
  { color: '#60A5FA', size: 32, x: '20%', y: '70%', delay: 1.5, duration: 3.2 },
  { color: '#F01820', size: 44, x: '88%', y: '40%', delay: 0.8, duration: 3.8 },
  { color: '#ECD800', size: 28, x: '5%', y: '45%', delay: 1.2, duration: 2.5 },
  { color: '#604089', size: 36, x: '55%', y: '5%', delay: 0.3, duration: 3.3 },
  { color: '#F6B3DD', size: 32, x: '92%', y: '80%', delay: 1.8, duration: 3 },
];

const FloatingBeads = memo(function FloatingBeads() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
      {beadData.map((bead, i) => (
        <div
          key={i}
          className="absolute rounded-full shadow-sm"
          style={{
            width: bead.size,
            height: bead.size,
            left: bead.x,
            top: bead.y,
            backgroundColor: bead.color,
            animation: `float ${bead.duration}s ease-in-out ${bead.delay}s infinite alternate`,
            opacity: 0.85,
          }}
        >
          {/* Inner highlight dot */}
          <div
            className="absolute rounded-full bg-white/30"
            style={{
              width: bead.size * 0.25,
              height: bead.size * 0.25,
              top: bead.size * 0.2,
              left: bead.size * 0.25,
            }}
          />
        </div>
      ))}
    </div>
  );
});

export default FloatingBeads;
