export default function RingControlPanel({
  isRinging,
  onStopRing,
  onSnooze,
  onTestRing,
  autoplayBlocked,
  flashEnabled,
  vibrationEnabled,
}) {
  if (!isRinging && !autoplayBlocked) {
    return (
      <div className="ring-panel ring-panel--idle">
        <div className="ring-panel__header">
          <h3 className="ring-panel__title">Ring Controls</h3>
        </div>
        <button className="ring-panel__test-btn" onClick={onTestRing} aria-label="Test Ring Sound">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          Test Ring
        </button>
      </div>
    );
  }

  return (
    <div className={`ring-panel ${isRinging ? 'ring-panel--ringing' : ''}`}>
      {/* Autoplay blocked warning */}
      {autoplayBlocked && (
        <div className="ring-panel__blocked">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          <span>Browser blocked audio autoplay. Click any button to enable sound.</span>
        </div>
      )}

      {isRinging && (
        <>
          {/* Flash simulation */}
          {flashEnabled && <div className="ring-panel__flash" />}
          
          <div className="ring-panel__header">
            <div className="ring-panel__ring-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </div>
            <h3 className="ring-panel__title ring-panel__title--ringing">Phone is Ringing!</h3>
            {vibrationEnabled && (
              <span className="ring-panel__vibration">📳 Vibration Active</span>
            )}
          </div>

          <div className="ring-panel__actions">
            <button className="ring-panel__stop-btn" onClick={onStopRing} aria-label="Stop Ringing">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
              Stop Ringing
            </button>
            <button className="ring-panel__snooze-btn" onClick={onSnooze} aria-label="Snooze">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-3-8h3.63L9 16.15V17h6v-2h-3.63L15 10.85V10H9v2z"/>
              </svg>
              Snooze 10s
            </button>
          </div>
        </>
      )}
    </div>
  );
}
