import { useEffect, useRef, useState } from 'react';
import { getFrequencyData, generateSimulatedWaveform } from '../utils/audioAnalysis';

export default function ListeningVisualizer({ analyser, isActive, isRinging, liveLevel }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [bars, setBars] = useState(new Array(32).fill(0));

  useEffect(() => {
    if (!isActive && !isRinging) {
      setBars(new Array(32).fill(0));
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      return;
    }

    const animate = () => {
      let newBars;
      if (analyser && isActive) {
        newBars = getFrequencyData(analyser);
      } else if (isRinging) {
        newBars = generateSimulatedWaveform(0.8, 32);
      } else {
        newBars = generateSimulatedWaveform(liveLevel || 0.1, 32);
      }
      setBars(newBars);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [analyser, isActive, isRinging, liveLevel]);

  return (
    <div className={`visualizer ${isActive ? 'visualizer--active' : ''} ${isRinging ? 'visualizer--ringing' : ''}`}>
      <div className="visualizer__label">
        {isRinging ? '🔔 Ringing' : isActive ? '🎤 Audio Feed' : '— Inactive'}
      </div>
      <div className="visualizer__bars">
        {bars.map((h, i) => (
          <div
            key={i}
            className="visualizer__bar"
            style={{
              height: `${Math.max(3, h * 100)}%`,
              animationDelay: `${i * 30}ms`,
              opacity: isActive || isRinging ? 0.5 + h * 0.5 : 0.15,
            }}
          />
        ))}
      </div>
      {/* Radar pulse overlay */}
      {(isActive || isRinging) && (
        <div className="visualizer__radar">
          <div className="visualizer__radar-ring visualizer__radar-ring--1" />
          <div className="visualizer__radar-ring visualizer__radar-ring--2" />
          <div className="visualizer__radar-ring visualizer__radar-ring--3" />
          <div className="visualizer__radar-center" />
        </div>
      )}
    </div>
  );
}
