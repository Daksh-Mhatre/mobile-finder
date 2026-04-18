import { MIC_STATUS } from '../utils/constants';

export default function PermissionStatus({ micPermission, isMicActive, voiceSupported, isMocked }) {
  const items = [
    {
      label: 'Microphone',
      status: micPermission === MIC_STATUS.GRANTED ? 'Granted' : micPermission === MIC_STATUS.DENIED ? 'Denied' : 'Pending',
      color: micPermission === MIC_STATUS.GRANTED ? '#34d399' : micPermission === MIC_STATUS.DENIED ? '#ef4444' : '#a78bfa',
      icon: micPermission === MIC_STATUS.GRANTED ? '✓' : micPermission === MIC_STATUS.DENIED ? '✕' : '?',
    },
    {
      label: 'Audio Capture',
      status: isMicActive ? 'Active' : 'Inactive',
      color: isMicActive ? '#34d399' : '#6b7280',
      icon: isMicActive ? '●' : '○',
    },
    {
      label: 'Speech Recognition',
      status: voiceSupported ? 'Available' : 'Unavailable',
      color: voiceSupported ? '#34d399' : '#f59e0b',
      icon: voiceSupported ? '✓' : '✕',
    },
    {
      label: 'Voice Mode',
      status: isMocked ? 'Mocked Fallback' : 'Native API',
      color: isMocked ? '#f59e0b' : '#34d399',
      icon: isMocked ? '⚠' : '✓',
    },
  ];

  return (
    <div className="permission-status">
      <h3 className="permission-status__title">System Status</h3>
      <div className="permission-status__grid">
        {items.map((item) => (
          <div key={item.label} className="permission-status__item">
            <span className="permission-status__icon" style={{ color: item.color }}>
              {item.icon}
            </span>
            <div className="permission-status__info">
              <span className="permission-status__label">{item.label}</span>
              <span className="permission-status__value" style={{ color: item.color }}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {micPermission === MIC_STATUS.DENIED && (
        <div className="permission-status__recovery">
          <p>
            <strong>Mic access denied.</strong> To fix this:
          </p>
          <ol>
            <li>Click the lock/info icon in your browser address bar</li>
            <li>Find "Microphone" and set it to "Allow"</li>
            <li>Reload the page</li>
          </ol>
        </div>
      )}
    </div>
  );
}
