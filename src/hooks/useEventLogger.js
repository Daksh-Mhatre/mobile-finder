// Event logger hook for maintaining timestamped activity log

import { useState, useCallback, useRef } from 'react';
import { LOG_TYPES } from '../utils/constants';

let idCounter = 0;

export default function useEventLogger() {
  const [logs, setLogs] = useState([]);
  const maxLogs = useRef(100);

  const addLog = useCallback((message, type = LOG_TYPES.INFO) => {
    const entry = {
      id: ++idCounter,
      message,
      type,
      timestamp: new Date(),
    };

    setLogs(prev => {
      const updated = [entry, ...prev];
      if (updated.length > maxLogs.current) {
        return updated.slice(0, maxLogs.current);
      }
      return updated;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
}
