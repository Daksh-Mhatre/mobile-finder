import { MODES, MODE_LABELS } from '../utils/constants';

const MODE_ICONS = {
  [MODES.CLAP]: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.5 2C9.64 2 7.21 3.98 6.58 6.63l-.01.04C6.23 8.07 5.05 9.43 3.62 9.93L3 10.18V14c0 4.42 3.58 8 8 8h1c4.42 0 8-3.58 8-8v-3.82l-.63-.25c-1.43-.5-2.61-1.86-2.95-3.27l-.01-.04C15.79 3.98 14.36 2 12.5 2z"/>
    </svg>
  ),
  [MODES.VOICE]: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
    </svg>
  ),
  [MODES.BOTH]: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  ),
};

export default function TriggerModeSelector({ selectedMode, onSelectMode, disabled }) {
  return (
    <div className="mode-selector">
      <h3 className="mode-selector__title">Detection Mode</h3>
      <div className="mode-selector__options">
        {Object.values(MODES).map((mode) => (
          <button
            key={mode}
            className={`mode-selector__btn ${selectedMode === mode ? 'mode-selector__btn--active' : ''}`}
            onClick={() => onSelectMode(mode)}
            disabled={disabled}
            aria-label={`Select ${MODE_LABELS[mode]} mode`}
            aria-pressed={selectedMode === mode}
          >
            <span className="mode-selector__icon">{MODE_ICONS[mode]}</span>
            <span className="mode-selector__label">{MODE_LABELS[mode]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
