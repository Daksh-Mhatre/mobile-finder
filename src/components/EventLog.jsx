import { LOG_TYPES } from '../utils/constants';

const TYPE_COLORS = {
  [LOG_TYPES.INFO]: '#94a3b8',
  [LOG_TYPES.SUCCESS]: '#34d399',
  [LOG_TYPES.WARNING]: '#f59e0b',
  [LOG_TYPES.ERROR]: '#ef4444',
  [LOG_TYPES.TRIGGER]: '#a78bfa',
};

const TYPE_ICONS = {
  [LOG_TYPES.INFO]: 'ℹ',
  [LOG_TYPES.SUCCESS]: '✓',
  [LOG_TYPES.WARNING]: '⚠',
  [LOG_TYPES.ERROR]: '✕',
  [LOG_TYPES.TRIGGER]: '⚡',
};

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function EventLog({ logs, onClear }) {
  return (
    <div className="event-log">
      <div className="event-log__header">
        <h3 className="event-log__title">Activity Log</h3>
        {logs.length > 0 && (
          <button className="event-log__clear" onClick={onClear} aria-label="Clear Log">
            Clear
          </button>
        )}
      </div>

      <div className="event-log__list">
        {logs.length === 0 ? (
          <div className="event-log__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4b5563">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
            <p>No activity yet</p>
            <p className="event-log__empty-hint">Events will appear here when you start listening</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="event-log__entry" style={{ '--log-color': TYPE_COLORS[log.type] }}>
              <span className="event-log__icon" style={{ color: TYPE_COLORS[log.type] }}>
                {TYPE_ICONS[log.type]}
              </span>
              <span className="event-log__message">{log.message}</span>
              <span className="event-log__time">{formatTime(log.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
