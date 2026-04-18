// Ringtone hook — handles playing/stopping looping ring audio with auto-stop

import { useState, useCallback, useRef, useEffect } from 'react';
import { RING_DEFAULTS } from '../utils/constants';

// Generate a ringtone using Web Audio API (oscillator-based)
function createRingtoneOscillator(audioCtx) {
  const gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = 0;

  return { gainNode, audioCtx };
}

export default function useRingtone() {
  const [isRinging, setIsRinging] = useState(false);
  const [volume, setVolume] = useState(RING_DEFAULTS.VOLUME);
  const [autoStopSeconds, setAutoStopSeconds] = useState(RING_DEFAULTS.AUTO_STOP_SECONDS);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainRef = useRef(null);
  const intervalRef = useRef(null);
  const autoStopTimerRef = useRef(null);
  const patternTimeoutRef = useRef([]);

  const cleanup = useCallback(() => {
    // Stop all oscillators
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    oscillatorsRef.current = [];

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
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {
          setAutoplayBlocked(true);
        });
      }

      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      const vol = (volume / 100) * 0.5;

      // Create a phone ring pattern: two-tone alternating
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const toneGain = ctx.createGain();
        toneGain.connect(gainNode);
        
        toneGain.gain.setValueAtTime(0, startTime);
        toneGain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
        toneGain.gain.setValueAtTime(vol, startTime + duration - 0.02);
        toneGain.gain.linearRampToValueAtTime(0, startTime + duration);
        
        osc.connect(toneGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
        oscillatorsRef.current.push(osc);
      };

      const now = ctx.currentTime;
      // Ring pattern: two short bursts, pause, repeat
      // Burst 1
      playTone(880, now, 0.15);
      playTone(698, now + 0.15, 0.15);
      playTone(880, now + 0.30, 0.15);
      playTone(698, now + 0.45, 0.15);
      // Pause 0.3s
      // Burst 2
      playTone(880, now + 0.9, 0.15);
      playTone(698, now + 1.05, 0.15);
      playTone(880, now + 1.20, 0.15);
      playTone(698, now + 1.35, 0.15);

      gainRef.current = gainNode;
      setAutoplayBlocked(false);
    } catch (e) {
      console.error('Ring playback error:', e);
      setAutoplayBlocked(true);
    }
  }, [volume]);

  const startRinging = useCallback(() => {
    setIsRinging(true);
    cleanup();

    // Play immediately
    playRingPattern();

    // Repeat every 2 seconds
    intervalRef.current = setInterval(() => {
      playRingPattern();
    }, 2000);

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
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try { audioCtxRef.current.close(); } catch(e) {}
      audioCtxRef.current = null;
    }
  }, [cleanup]);

  const testRing = useCallback(() => {
    // Play a single ring burst
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      const vol = (volume / 100) * 0.4;

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 880;
      const g1 = ctx.createGain();
      g1.connect(gainNode);
      g1.gain.setValueAtTime(vol, ctx.currentTime);
      g1.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      osc1.connect(g1);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.5);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 698;
      const g2 = ctx.createGain();
      g2.connect(gainNode);
      g2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
      g2.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.2);
      g2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      osc2.connect(g2);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.6);

      setTimeout(() => ctx.close(), 1000);
      setAutoplayBlocked(false);
    } catch(e) {
      setAutoplayBlocked(true);
    }
  }, [volume]);

  const snooze = useCallback((snoozeSec) => {
    stopRinging();
    const seconds = snoozeSec || RING_DEFAULTS.SNOOZE_SECONDS;
    // Return the snooze timeout so caller can handle it
    return seconds;
  }, [stopRinging]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch(e) {}
      }
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
