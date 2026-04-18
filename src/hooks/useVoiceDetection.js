// Voice detection hook — uses Web Speech API with mocked fallback
// Supports multi-language recognition (English + Marathi)

import { useState, useCallback, useRef, useEffect } from 'react';
import { checkPhraseMatch, normalizeTranscript } from '../utils/mockVoiceParser';
import { LANGUAGES } from '../utils/constants';

export default function useVoiceDetection({ isActive, onPhraseDetected, language }) {
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [detectedPhrase, setDetectedPhrase] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);
  const [isMocked, setIsMocked] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const isActiveRef = useRef(false);
  const langRef = useRef(language || LANGUAGES.EN);

  // Keep langRef in sync
  useEffect(() => {
    langRef.current = language || LANGUAGES.EN;
  }, [language]);

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      setIsMocked(false);
    } else {
      setVoiceSupported(false);
      setIsMocked(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    isActiveRef.current = false;
    setIsListeningVoice(false);
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsMocked(true);
      setIsListeningVoice(true);
      isActiveRef.current = true;
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;

    // Set language — Chrome supports setting lang to recognize specific languages
    // For "both" mode we use the selected language; phrase matching still checks all languages
    recognition.lang = langRef.current;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        // Check all alternatives for a match
        for (let alt = 0; alt < event.results[i].length; alt++) {
          const altTranscript = event.results[i][alt].transcript;
          const result = checkPhraseMatch(altTranscript);
          if (result.matched) {
            setCurrentTranscript(altTranscript);
            setDetectedPhrase(result.phrase);
            setDetectedLang(result.lang);
            if (onPhraseDetected) {
              onPhraseDetected(result.phrase, result.lang);
            }
            return;
          }
        }
        transcript += event.results[i][0].transcript;
      }

      setCurrentTranscript(transcript);

      // Also check the full combined transcript
      const result = checkPhraseMatch(transcript);
      if (result.matched) {
        setDetectedPhrase(result.phrase);
        setDetectedLang(result.lang);
        if (onPhraseDetected) {
          onPhraseDetected(result.phrase, result.lang);
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        stopListening();
        return;
      }
      // Auto-restart on recoverable errors
      if (isActiveRef.current && event.error !== 'aborted') {
        restartTimeoutRef.current = setTimeout(() => {
          if (isActiveRef.current) {
            startListening();
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (isActiveRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isActiveRef.current) {
            startListening();
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;
    isActiveRef.current = true;
    setIsListeningVoice(true);

    try {
      recognition.start();
    } catch (e) {
      console.warn('Failed to start recognition:', e);
    }
  }, [onPhraseDetected, stopListening]);

  // Restart recognition when language changes while active
  useEffect(() => {
    if (isActiveRef.current && voiceSupported) {
      stopListening();
      // Small delay then restart with new language
      const t = setTimeout(() => {
        if (isActive) {
          isActiveRef.current = true;
          startListening();
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start/stop based on isActive prop
  useEffect(() => {
    if (isActive) {
      startListening();
    } else {
      stopListening();
      setCurrentTranscript('');
    }
    return () => {
      stopListening();
    };
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Manual mock trigger for fallback mode
  const simulatePhrase = useCallback((phrase) => {
    const normalized = normalizeTranscript(phrase);
    setCurrentTranscript(normalized);
    const result = checkPhraseMatch(normalized);
    if (result.matched) {
      setDetectedPhrase(result.phrase);
      setDetectedLang(result.lang);
      if (onPhraseDetected) {
        onPhraseDetected(result.phrase, result.lang);
      }
    }
  }, [onPhraseDetected]);

  const clearDetection = useCallback(() => {
    setDetectedPhrase(null);
    setDetectedLang(null);
    setCurrentTranscript('');
  }, []);

  return {
    voiceSupported,
    isMocked,
    isListeningVoice,
    currentTranscript,
    detectedPhrase,
    detectedLang,
    startListening,
    stopListening,
    simulatePhrase,
    clearDetection,
  };
}
