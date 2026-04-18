export default function DemoNotice() {
  return (
    <div className="demo-notice">
      <div className="demo-notice__icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#a78bfa" strokeWidth="1.5" fill="none"/>
          <text x="10" y="14" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">i</text>
        </svg>
      </div>
      <div className="demo-notice__content">
        <h3 className="demo-notice__title">Browser Prototype</h3>
        <ul className="demo-notice__list">
          <li>This is a <strong>browser-based demo</strong> — real background listening is simulated</li>
          <li>Microphone permission is required for clap detection</li>
          <li>Voice detection uses the Web Speech API (Chrome recommended)</li>
          <li>If Speech API is unavailable, a mock fallback mode is used</li>
        </ul>
      </div>
    </div>
  );
}
