// Ringtone hook — handles playing/stopping looping ring audio with auto-stop

import { useState, useCallback, useRef, useEffect } from 'react';
import { RING_DEFAULTS } from '../utils/constants';

export default function useRingtone() {
  const [isRinging, setIsRinging] = useState(false);
  const [volume, setVolume] = useState(RING_DEFAULTS.VOLUME);
  const [autoStopSeconds, setAutoStopSeconds] = useState(RING_DEFAULTS.AUTO_STOP_SECONDS);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const autoStopTimerRef = useRef(null);
  const patternTimeoutRef = useRef([]);

  const cleanup = useCallback(() => {
    // Stop main audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Clear pattern timeouts
    patternTimeoutRef.current.forEach(t => clearTimeout(t));
    patternTimeoutRef.current = [];

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const playRingPattern = useCallback(() => {
    try {
      // Stop any previous audio before starting new one
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio('/ring.mp3');
      audio.volume = volume / 100;
      audio.loop = true; // Loop the audio continuously
      audio.play().catch(() => setAutoplayBlocked(true));

      // Store ref so we can stop it later
      audioRef.current = audio;

      setAutoplayBlocked(false);
    } catch (e) {
      console.error('Ring playback error:', e);
      setAutoplayBlocked(true);
    }
  }, [volume]);

  const startRinging = useCallback(() => {
    setIsRinging(true);
    cleanup();

    // Play immediately (looping is handled inside playRingPattern)
    playRingPattern();

    // Auto-stop timer
    if (autoStopSeconds > 0) {
      autoStopTimerRef.current = setTimeout(() => {
        stopRinging();
      }, autoStopSeconds * 1000);
    }
  }, [playRingPattern, cleanup, autoStopSeconds]);

  const stopRinging = useCallback(() => {
    setIsRinging(false);
    cleanup();
  }, [cleanup]);

  const testRing = useCallback(() => {
    // Play a short preview of the ringtone (no loop, stops after 3 seconds)
    try {
      const audio = new Audio('/ring.mp3');
      audio.volume = (volume / 100) * 0.8;
      audio.loop = false;
      audio.play().catch(() => setAutoplayBlocked(true));

      // Auto stop preview after 3 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3000);

      setAutoplayBlocked(false);
    } catch (e) {
      setAutoplayBlocked(true);
    }
  }, [volume]);

  const snooze = useCallback((snoozeSec) => {
    stopRinging();
    const seconds = snoozeSec || RING_DEFAULTS.SNOOZE_SECONDS;
    return seconds;
  }, [stopRinging]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isRinging,
    volume,
    setVolume,
    autoStopSeconds,
    setAutoStopSeconds,
    autoplayBlocked,
    startRinging,
    stopRinging,
    testRing,
    snooze,
  };
}