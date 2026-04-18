import { STATES, STATE_LABELS } from '../utils/constants';

export default function FinderCard({
  appState,
  isListening,
  onToggleListening,
  clapCount,
  liveLevel,
  sensitivity,
  lastTrigger,
  currentTranscript,
  onDemoTrigger,
}) {
  const stateLabel = STATE_LABELS[appState] || 'Unknown';
  const isRinging = appState === STATES.RINGING;
  const isTriggered = appState === STATES.TRIGGER_DETECTED;
  const isActive = isListening && !isRinging;

  return (
    <div className={`finder-card ${isRinging ? 'finder-card--ringing' : ''} ${isTriggered ? 'finder-card--triggered' : ''}`}>
      <div className="finder-card__header">
        <h2 className="finder-card__title">Phone Finder</h2>
        <span className={`finder-card__state finder-card__state--${appState}`}>
          {stateLabel}
        </span>
      </div>

      {/* Main toggle button */}
      <div className="finder-card__toggle-wrapper">
        <button
          className={`finder-card__toggle ${isActive ? 'finder-card__toggle--active' : ''} ${isRinging ? 'finder-card__toggle--ringing' : ''}`}
          onClick={onToggleListening}
          disabled={isRinging}
          aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          <div className="finder-card__toggle-inner">
            {isRinging ? (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
            ) : isActive ? (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </div>
          {isActive && (
            <>
              <span className="finder-card__pulse-ring finder-card__pulse-ring--1" />
              <span className="finder-card__pulse-ring finder-card__pulse-ring--2" />
              <span className="finder-card__pulse-ring finder-card__pulse-ring--3" />
            </>
          )}
        </button>
        <p className="finder-card__toggle-label">
          {isRinging ? 'Phone is Ringing' : isActive ? 'Stop Listening' : 'Start Listening'}
        </p>
      </div>

      {/* Live stats */}
      <div className="finder-card__stats">
        <div className="finder-card__stat">
          <span className="finder-card__stat-label">Noise Level</span>
          <div className="finder-card__noise-bar">
            <div
              className="finder-card__noise-fill"
              style={{ width: `${Math.min(liveLevel * 100 * 3, 100)}%` }}
            />
          </div>
        </div>
        <div className="finder-card__stat">
          <span className="finder-card__stat-label">Claps</span>
          <span className="finder-card__stat-value">
            {clapCount}/2
            {clapCount > 0 && <span className="finder-card__clap-dot" />}
          </span>
        </div>
        <div className="finder-card__stat">
          <span className="finder-card__stat-label">Sensitivity</span>
          <span className="finder-card__stat-value">{sensitivity}%</span>
        </div>
      </div>

      {/* Transcript display */}
      {currentTranscript && (
        <div className="finder-card__transcript">
          <span className="finder-card__transcript-label">Last heard:</span>
          <span className="finder-card__transcript-text">"{currentTranscript}"</span>
        </div>
      )}

      {/* Last trigger */}
      {lastTrigger && (
        <div className="finder-card__last-trigger">
          <span className="finder-card__trigger-label">Last trigger:</span>
          <span className="finder-card__trigger-value">{lastTrigger}</span>
        </div>
      )}

      {/* Demo trigger button */}
      <button
        className="finder-card__demo-btn"
        onClick={onDemoTrigger}
        aria-label="Try Demo Trigger"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
        Try Demo Trigger
      </button>
    </div>
  );
}
