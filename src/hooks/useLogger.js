// src/hooks/useLogger.js
import { useCallback } from 'react';

const useLogger = (fileName) => {
  const logAndTime = useCallback((message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${fileName}] ${timestamp} - ${message}`);
  }, [fileName]);

  return logAndTime;
};

export default useLogger;
