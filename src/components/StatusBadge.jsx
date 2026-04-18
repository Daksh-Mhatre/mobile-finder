import { STATES, MODES, BADGE_VARIANTS } from '../utils/constants';

function getBadgeInfo(appState, selectedMode) {
  switch (appState) {
    case STATES.RINGING:
      return { ...BADGE_VARIANTS.RINGING, pulse: true };
    case STATES.LISTENING_CLAP:
    case STATES.LISTENING_VOICE:
    case STATES.LISTENING_BOTH:
      return { ...BADGE_VARIANTS.LISTENING, pulse: true };
    case STATES.TRIGGER_DETECTED:
      return { label: 'Triggered!', color: '#f59e0b', pulse: true };
    case STATES.REQUESTING_MIC:
      return { label: 'Requesting Mic', color: '#a78bfa', pulse: true };
    default:
      return { ...BADGE_VARIANTS.IDLE, pulse: false };
  }
}

export default function StatusBadge({ appState, selectedMode, variant, small }) {
  const info = variant
    ? { ...variant, pulse: variant.pulse || false }
    : getBadgeInfo(appState, selectedMode);

  return (
    <span
      className={`status-badge ${info.pulse ? 'status-badge--pulse' : ''} ${small ? 'status-badge--small' : ''}`}
      style={{ '--badge-color': info.color }}
    >
      <span className="status-badge__dot" />
      <span className="status-badge__label">{info.label}</span>
    </span>
  );
}
