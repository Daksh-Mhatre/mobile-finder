// Microphone access hook — handles mic permission, audio stream, and analyser

import { useState, useCallback, useRef, useEffect } from 'react';
import { MIC_STATUS } from '../utils/constants';

export default function useMicrophoneAccess() {
  const [permission, setPermission] = useState(MIC_STATUS.PENDING);
  const [isMicActive, setIsMicActive] = useState(false);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  const requestAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.4;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      setPermission(MIC_STATUS.GRANTED);
      setIsMicActive(true);

      return { stream, analyser, audioContext };
    } catch (err) {
      console.error('Microphone access denied:', err);
      setPermission(MIC_STATUS.DENIED);
      setIsMicActive(false);
      return null;
    }
  }, []);

  const stopMic = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsMicActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMic();
    };
  }, [stopMic]);

  return {
    permission,
    isMicActive,
    analyser: analyserRef.current,
    stream: streamRef.current,
    requestAccess,
    stopMic,
  };
}
