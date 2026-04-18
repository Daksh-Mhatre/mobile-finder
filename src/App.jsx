import { useState, useCallback, useEffect, useRef } from 'react';

// Components
import Header from './components/Header';
import DemoNotice from './components/DemoNotice';
import FinderCard from './components/FinderCard';
import ListeningVisualizer from './components/ListeningVisualizer';
import TriggerModeSelector from './components/TriggerModeSelector';
import RingControlPanel from './components/RingControlPanel';
import EventLog from './components/EventLog';
import PermissionStatus from './components/PermissionStatus';
import SettingsPanel from './components/SettingsPanel';

// Hooks
import useMicrophoneAccess from './hooks/useMicrophoneAccess';
import useClapDetection from './hooks/useClapDetection';
import useVoiceDetection from './hooks/useVoiceDetection';
import useRingtone from './hooks/useRingtone';
import useEventLogger from './hooks/useEventLogger';

// Constants
import {
  STATES, MODES, MIC_STATUS, LOG_TYPES,
  CLAP_DEFAULTS, RING_DEFAULTS, LANGUAGES, LANGUAGE_LABELS,
} from './utils/constants';

export default function App() {
  // Core state
  const [isListening, setIsListening] = useState(false);
  const [selectedMode, setSelectedMode] = useState(MODES.BOTH);
  const [appState, setAppState] = useState(STATES.IDLE);
  const [lastTrigger, setLastTrigger] = useState(null);

  // Settings state
  const [sensitivity, setSensitivity] = useState(CLAP_DEFAULTS.SENSITIVITY);
  const [cooldown, setCooldown] = useState(CLAP_DEFAULTS.COOLDOWN_MS);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState(LANGUAGES.EN);

  // Refs to avoid stale closures
  const appStateRef = useRef(appState);
  const isListeningRef = useRef(isListening);
  const analyserRef = useRef(null);
  const hasAutoStartedRef = useRef(false);

  useEffect(() => { appStateRef.current = appState; }, [appState]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

  // Hooks
  const { logs, addLog, clearLogs } = useEventLogger();
  const mic = useMicrophoneAccess();
  const ringtone = useRingtone();

  // Snooze timeout ref
  const snoozeTimerRef = useRef(null);



  // Trigger handler — fires the ring
  const handleTrigger = useCallback((source) => {
    if (appStateRef.current === STATES.RINGING) return;

    const now = new Date().toLocaleTimeString();
    const label = source === 'clap' ? 'Double Clap' : source === 'voice' ? 'Voice Phrase' : 'Demo Button';
    setLastTrigger(`${label} at ${now}`);
    setAppState(STATES.TRIGGER_DETECTED);
    addLog(`🎯 Trigger detected: ${label}`, LOG_TYPES.TRIGGER);

    // Brief trigger state then start ringing
    setTimeout(() => {
      setAppState(STATES.RINGING);
      ringtone.startRinging();
      addLog('🔔 Ring started', LOG_TYPES.SUCCESS);
    }, 600);
  }, [addLog, ringtone]);

  // Clap detection
  const shouldListenClap = isListening && (selectedMode === MODES.CLAP || selectedMode === MODES.BOTH) && appState !== STATES.RINGING;

  const clapDetection = useClapDetection({
    analyser: analyserRef.current,
    isActive: shouldListenClap,
    sensitivity,
    cooldownMs: cooldown,
    onDoubleClapDetected: useCallback(() => {
      addLog('👏 Double clap detected!', LOG_TYPES.SUCCESS);
      handleTrigger('clap');
    }, [addLog, handleTrigger]),
  });

  // Voice detection
  const shouldListenVoice = isListening && (selectedMode === MODES.VOICE || selectedMode === MODES.BOTH) && appState !== STATES.RINGING;

  const voiceDetection = useVoiceDetection({
    isActive: shouldListenVoice,
    language: voiceLanguage,
    onPhraseDetected: useCallback((phrase, lang) => {
      const langLabel = lang === 'mr' ? 'मराठी' : 'English';
      addLog(`🗣️ Voice phrase detected (${langLabel}): "${phrase}"`, LOG_TYPES.SUCCESS);
      handleTrigger('voice');
    }, [addLog, handleTrigger]),
  });

  // Update app state based on listening mode
  useEffect(() => {
    if (!isListening || appState === STATES.RINGING || appState === STATES.TRIGGER_DETECTED) return;

    if (selectedMode === MODES.CLAP) setAppState(STATES.LISTENING_CLAP);
    else if (selectedMode === MODES.VOICE) setAppState(STATES.LISTENING_VOICE);
    else setAppState(STATES.LISTENING_BOTH);
  }, [isListening, selectedMode, appState]);

  // Toggle listening
  const handleToggleListening = useCallback(async () => {
    if (ringtone.isRinging) return;

    if (isListeningRef.current) {
      // Stop listening
      setIsListening(false);
      setAppState(STATES.IDLE);
      mic.stopMic();
      analyserRef.current = null;
      clapDetection.resetClaps();
      addLog('Listening stopped', LOG_TYPES.INFO);
      return;
    }

    // Start listening — request mic
    setAppState(STATES.REQUESTING_MIC);
    addLog('Requesting microphone access…', LOG_TYPES.INFO);

    const result = await mic.requestAccess();
    if (!result) {
      setAppState(STATES.IDLE);
      addLog('Microphone access denied', LOG_TYPES.ERROR);
      return;
    }

    analyserRef.current = result.analyser;
    addLog('Microphone access granted', LOG_TYPES.SUCCESS);
    setIsListening(true);
    addLog('Listening started', LOG_TYPES.INFO);
  }, [mic, ringtone.isRinging, clapDetection, addLog]);

  // Stop ringing
  const handleStopRing = useCallback(() => {
    ringtone.stopRinging();
    setAppState(STATES.IDLE);
    setIsListening(false);
    mic.stopMic();
    analyserRef.current = null;
    addLog('Ring stopped', LOG_TYPES.INFO);
  }, [ringtone, mic, addLog]);

  // Snooze
  const handleSnooze = useCallback(() => {
    const snoozeSec = ringtone.snooze();
    setAppState(STATES.IDLE);
    addLog(`Snoozed for ${snoozeSec}s`, LOG_TYPES.WARNING);

    if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
    snoozeTimerRef.current = setTimeout(() => {
      if (!isListeningRef.current) return;
      handleTrigger('snooze');
    }, snoozeSec * 1000);
  }, [ringtone, addLog, handleTrigger]);

  // Demo trigger
  const handleDemoTrigger = useCallback(() => {
    addLog('Demo trigger activated', LOG_TYPES.INFO);
    handleTrigger('demo');
  }, [addLog, handleTrigger]);

  // Mode change
  const handleModeChange = useCallback((mode) => {
    setSelectedMode(mode);
    addLog(`Detection mode changed to: ${mode}`, LOG_TYPES.INFO);
  }, [addLog]);

  // Language change
  const handleLanguageChange = useCallback((lang) => {
    setVoiceLanguage(lang);
    addLog(`Voice language changed to: ${LANGUAGE_LABELS[lang]}`, LOG_TYPES.INFO);
  }, [addLog]);

  // Test ring
  const handleTestRing = useCallback(() => {
    ringtone.testRing();
    addLog('Test ring played', LOG_TYPES.INFO);
  }, [ringtone, addLog]);

  // Sync ringtone volume
  useEffect(() => {
    ringtone.setVolume(ringtone.volume);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-stop ring when ringtone hook stops itself
  useEffect(() => {
    if (!ringtone.isRinging && appState === STATES.RINGING) {
      setAppState(STATES.IDLE);
      setIsListening(false);
      mic.stopMic();
      analyserRef.current = null;
      addLog('Ring auto-stopped', LOG_TYPES.INFO);
    }
  }, [ringtone.isRinging]); // eslint-disable-line react-hooks/exhaustive-deps

  // Log app opened on mount and auto-start listening
  useEffect(() => {
    if (!hasAutoStartedRef.current) {
      addLog('App opened — PhonePulse ready', LOG_TYPES.INFO);
      hasAutoStartedRef.current = true;
      
      // Auto-start listening after a tiny delay to ensure mount is complete
      setTimeout(() => {
        if (!isListeningRef.current) {
          handleToggleListening();
        }
      }, 300);
    }
  }, [addLog, handleToggleListening]);

  return (
    <div className={`app-wrapper ${appState === STATES.RINGING ? 'app-wrapper--ringing' : ''}`}>
      {/* Flash effect overlay */}
      {appState === STATES.RINGING && flashEnabled && (
        <div className="flash-overlay" />
      )}

      <div className="phone-frame">
        <div className="app-container">
          <Header appState={appState} selectedMode={selectedMode} />
          
          <main className="app-main">
            <DemoNotice />

            <FinderCard
              appState={appState}
              isListening={isListening}
              onToggleListening={handleToggleListening}
              clapCount={clapDetection.clapCount}
              liveLevel={clapDetection.liveLevel}
              sensitivity={sensitivity}
              lastTrigger={lastTrigger}
              currentTranscript={voiceDetection.currentTranscript}
              onDemoTrigger={handleDemoTrigger}
            />

            <ListeningVisualizer
              analyser={analyserRef.current}
              isActive={isListening}
              isRinging={appState === STATES.RINGING}
              liveLevel={clapDetection.liveLevel}
            />

            <TriggerModeSelector
              selectedMode={selectedMode}
              onSelectMode={handleModeChange}
              disabled={appState === STATES.RINGING}
            />

            <RingControlPanel
              isRinging={ringtone.isRinging}
              onStopRing={handleStopRing}
              onSnooze={handleSnooze}
              onTestRing={handleTestRing}
              autoplayBlocked={ringtone.autoplayBlocked}
              flashEnabled={flashEnabled}
              vibrationEnabled={vibrationEnabled}
            />

            <PermissionStatus
              micPermission={mic.permission}
              isMicActive={mic.isMicActive}
              voiceSupported={voiceDetection.voiceSupported}
              isMocked={voiceDetection.isMocked}
            />

            {/* Mock voice input for fallback */}
            {voiceDetection.isMocked && isListening && (selectedMode === MODES.VOICE || selectedMode === MODES.BOTH) && (
              <div className="mock-voice-input">
                <h3 className="mock-voice-input__title">🎤 Voice Simulation (Mock Mode)</h3>
                <p className="mock-voice-input__desc">
                  Speech API is not available. Use the buttons below to simulate trigger phrases.
                </p>
                <div className="mock-voice-input__btns">
                  <button
                    className="mock-voice-input__btn"
                    onClick={() => voiceDetection.simulatePhrase("where's my mobile")}
                  >
                    🇬🇧 "Where's my mobile"
                  </button>
                  <button
                    className="mock-voice-input__btn mock-voice-input__btn--mr"
                    onClick={() => voiceDetection.simulatePhrase('माझा मोबाइल कुठे')}
                  >
                    🇮🇳 "माझा मोबाइल कुठे"
                  </button>
                  <button
                    className="mock-voice-input__btn mock-voice-input__btn--mr"
                    onClick={() => voiceDetection.simulatePhrase('maza mobile kuthe')}
                  >
                    🇮🇳 "Maza mobile kuthe"
                  </button>
                </div>
              </div>
            )}

            <SettingsPanel
              sensitivity={sensitivity}
              onSensitivityChange={setSensitivity}
              cooldown={cooldown}
              onCooldownChange={setCooldown}
              ringVolume={ringtone.volume}
              onRingVolumeChange={ringtone.setVolume}
              autoStop={ringtone.autoStopSeconds}
              onAutoStopChange={ringtone.setAutoStopSeconds}
              flashEnabled={flashEnabled}
              onFlashToggle={() => setFlashEnabled(p => !p)}
              vibrationEnabled={vibrationEnabled}
              onVibrationToggle={() => setVibrationEnabled(p => !p)}
              voiceLanguage={voiceLanguage}
              onVoiceLanguageChange={handleLanguageChange}
            />

            <EventLog logs={logs} onClear={clearLogs} />
          </main>

          <footer className="app-footer">
            <span>PhonePulse Prototype</span>
            <span className="app-footer__dot">·</span>
            <span>Browser Demo</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
