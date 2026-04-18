// Clap detection hook — analyzes live microphone audio to detect double-clap patterns

import { useState, useCallback, useRef, useEffect } from 'react';
import { calculatePeak, exponentialSmooth } from '../utils/audioAnalysis';
import { CLAP_DEFAULTS } from '../utils/constants';

export default function useClapDetection({ analyser, isActive, sensitivity, cooldownMs, onDoubleClapDetected }) {
  const [clapCount, setClapCount] = useState(0);
  const [liveLevel, setLiveLevel] = useState(0);
  const [triggered, setTriggered] = useState(false);

  const lastClapTimeRef = useRef(0);
  const singleClapTimeRef = useRef(0);
  const smoothedLevelRef = useRef(0);
  const cooldownUntilRef = useRef(0);
  const animFrameRef = useRef(null);
  const clapCountRef = useRef(0);
  const prevPeakRef = useRef(0);

  const resetClaps = useCallback(() => {
    setClapCount(0);
    clapCountRef.current = 0;
    setTriggered(false);
    lastClapTimeRef.current = 0;
    singleClapTimeRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isActive || !analyser) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    // Calculate threshold from sensitivity
    const threshold = CLAP_DEFAULTS.PEAK_THRESHOLD_BASE * (1 - (sensitivity / 150));
    const effectiveCooldown = cooldownMs || CLAP_DEFAULTS.COOLDOWN_MS;

    const analyze = () => {
      analyser.getByteTimeDomainData(dataArray);
      const peak = calculatePeak(dataArray);
      const smoothed = exponentialSmooth(peak, smoothedLevelRef.current, 0.4);
      smoothedLevelRef.current = smoothed;
      setLiveLevel(smoothed);

      const now = Date.now();

      // Detect clap: sudden spike that exceeds threshold
      // Also check that previous frame was low (it's a spike, not sustained noise)
      const isSpike = peak > threshold && prevPeakRef.current < threshold * 0.7;
      const pastCooldown = now > cooldownUntilRef.current;
      const minInterval = now - lastClapTimeRef.current > CLAP_DEFAULTS.MIN_CLAP_INTERVAL_MS;

      if (isSpike && pastCooldown && minInterval) {
        lastClapTimeRef.current = now;

        if (clapCountRef.current === 0) {
          // First clap
          clapCountRef.current = 1;
          singleClapTimeRef.current = now;
          setClapCount(1);
        } else if (clapCountRef.current === 1) {
          // Check if within double-clap window
          const elapsed = now - singleClapTimeRef.current;
          if (elapsed < CLAP_DEFAULTS.DOUBLE_CLAP_WINDOW_MS) {
            // Double clap detected!
            clapCountRef.current = 2;
            setClapCount(2);
            setTriggered(true);
            cooldownUntilRef.current = now + effectiveCooldown;

            if (onDoubleClapDetected) {
              onDoubleClapDetected();
            }

            // Reset after a short delay
            setTimeout(() => {
              clapCountRef.current = 0;
              setClapCount(0);
            }, 1500);
          } else {
            // Too slow — treat as new first clap
            clapCountRef.current = 1;
            singleClapTimeRef.current = now;
            setClapCount(1);
          }
        }
      }

      // Reset single clap if double-clap window expired
      if (
        clapCountRef.current === 1 &&
        now - singleClapTimeRef.current > CLAP_DEFAULTS.DOUBLE_CLAP_WINDOW_MS
      ) {
        clapCountRef.current = 0;
        setClapCount(0);
      }

      prevPeakRef.current = peak;
      animFrameRef.current = requestAnimationFrame(analyze);
    };

    animFrameRef.current = requestAnimationFrame(analyze);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, analyser, sensitivity, cooldownMs, onDoubleClapDetected]);

  return {
    clapCount,
    liveLevel,
    triggered,
    resetClaps,
  };
}
