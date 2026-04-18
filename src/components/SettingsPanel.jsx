import { useState } from 'react';
import { CLAP_DEFAULTS, RING_DEFAULTS, LANGUAGES, LANGUAGE_LABELS } from '../utils/constants';

export default function SettingsPanel({
  sensitivity,
  onSensitivityChange,
  cooldown,
  onCooldownChange,
  ringVolume,
  onRingVolumeChange,
  autoStop,
  onAutoStopChange,
  flashEnabled,
  onFlashToggle,
  vibrationEnabled,
  onVibrationToggle,
  voiceLanguage,
  onVoiceLanguageChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`settings-panel ${isOpen ? 'settings-panel--open' : ''}`}>
      <button
        className="settings-panel__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
        <span>Settings</span>
        <svg
          className={`settings-panel__chevron ${isOpen ? 'settings-panel__chevron--open' : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="settings-panel__content">
          {/* Clap Sensitivity */}
          <div className="settings-panel__item">
            <div className="settings-panel__item-header">
              <label className="settings-panel__label" htmlFor="sensitivity">
                Clap Sensitivity
              </label>
              <span className="settings-panel__value">{sensitivity}%</span>
            </div>
            <input
              id="sensitivity"
              type="range"
              min="10"
              max="100"
              value={sensitivity}
              onChange={(e) => onSensitivityChange(Number(e.target.value))}
              className="settings-panel__slider"
            />
            <div className="settings-panel__range-labels">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Detection Cooldown */}
          <div className="settings-panel__item">
            <div className="settings-panel__item-header">
              <label className="settings-panel__label" htmlFor="cooldown">
                Detection Cooldown
              </label>
              <span className="settings-panel__value">{(cooldown / 1000).toFixed(1)}s</span>
            </div>
            <input
              id="cooldown"
              type="range"
              min="500"
              max="5000"
              step="250"
              value={cooldown}
              onChange={(e) => onCooldownChange(Number(e.target.value))}
              className="settings-panel__slider"
            />
            <div className="settings-panel__range-labels">
              <span>0.5s</span>
              <span>5s</span>
            </div>
          </div>

          {/* Ring Volume */}
          <div className="settings-panel__item">
            <div className="settings-panel__item-header">
              <label className="settings-panel__label" htmlFor="ringvol">
                Ring Volume
              </label>
              <span className="settings-panel__value">{ringVolume}%</span>
            </div>
            <input
              id="ringvol"
              type="range"
              min="10"
              max="100"
              value={ringVolume}
              onChange={(e) => onRingVolumeChange(Number(e.target.value))}
              className="settings-panel__slider"
            />
            <div className="settings-panel__range-labels">
              <span>Quiet</span>
              <span>Max</span>
            </div>
          </div>

          {/* Auto-stop */}
          <div className="settings-panel__item">
            <div className="settings-panel__item-header">
              <label className="settings-panel__label" htmlFor="autostop">
                Auto-stop After
              </label>
              <span className="settings-panel__value">
                {autoStop === 0 ? 'Never' : `${autoStop}s`}
              </span>
            </div>
            <input
              id="autostop"
              type="range"
              min="0"
              max="120"
              step="5"
              value={autoStop}
              onChange={(e) => onAutoStopChange(Number(e.target.value))}
              className="settings-panel__slider"
            />
            <div className="settings-panel__range-labels">
              <span>Never</span>
              <span>2 min</span>
            </div>
          </div>

          {/* Voice Language */}
          <div className="settings-panel__item">
            <div className="settings-panel__item-header">
              <label className="settings-panel__label">Voice Language</label>
              <span className="settings-panel__value">
                {LANGUAGE_LABELS[voiceLanguage]}
              </span>
            </div>
            <div className="settings-panel__lang-btns">
              {Object.entries(LANGUAGES).map(([key, code]) => (
                <button
                  key={code}
                  className={`settings-panel__lang-btn ${voiceLanguage === code ? 'settings-panel__lang-btn--active' : ''}`}
                  onClick={() => onVoiceLanguageChange(code)}
                >
                  {LANGUAGE_LABELS[code]}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="settings-panel__toggles">
            <div className="settings-panel__toggle-item">
              <label className="settings-panel__label" htmlFor="flash-toggle">
                Flash Simulation
              </label>
              <button
                id="flash-toggle"
                role="switch"
                aria-checked={flashEnabled}
                className={`settings-panel__switch ${flashEnabled ? 'settings-panel__switch--on' : ''}`}
                onClick={onFlashToggle}
              >
                <span className="settings-panel__switch-thumb" />
              </button>
            </div>
            <div className="settings-panel__toggle-item">
              <label className="settings-panel__label" htmlFor="vibration-toggle">
                Vibration Simulation
              </label>
              <button
                id="vibration-toggle"
                role="switch"
                aria-checked={vibrationEnabled}
                className={`settings-panel__switch ${vibrationEnabled ? 'settings-panel__switch--on' : ''}`}
                onClick={onVibrationToggle}
              >
                <span className="settings-panel__switch-thumb" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
