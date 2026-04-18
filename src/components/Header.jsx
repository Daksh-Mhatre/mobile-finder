import { APP_NAME, APP_TAGLINE } from '../utils/constants';
import StatusBadge from './StatusBadge';

export default function Header({ appState, selectedMode }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="2" width="16" height="28" rx="3" stroke="url(#hGrad)" strokeWidth="2" fill="none"/>
              <circle cx="16" cy="26" r="1.5" fill="url(#hGrad)"/>
              <line x1="12" y1="5" x2="20" y2="5" stroke="url(#hGrad)" strokeWidth="1" strokeLinecap="round"/>
              {/* Sound waves */}
              <path d="M25 10 C27 12 27 16 25 18" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
              <path d="M28 8 C31 11 31 17 28 20" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
              <defs>
                <linearGradient id="hGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#818cf8"/>
                  <stop offset="100%" stopColor="#60a5fa"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header-text">
            <h1 className="header-title">{APP_NAME}</h1>
            <p className="header-tagline">{APP_TAGLINE}</p>
          </div>
        </div>
        <div className="header-right">
          <StatusBadge appState={appState} selectedMode={selectedMode} />
        </div>
      </div>
    </header>
  );
}
