import { useCallback, useRef } from 'react';

const useLogger = (componentName) => {
  const lastLogTime = useRef({});

  return useCallback((message) => {
    const now = new Date();
    const timeString = now.toISOString();
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    const logKey = `${componentName}-${message}`;

    // Only log if it's been more than 1000ms since the last identical log
    if (!lastLogTime.current[logKey] || (now - lastLogTime.current[logKey]) > 1000) {
      console.log(`[${componentName}] ${timeString.split('T')[1].replace('Z', '')}.${ms} - ${message}`);
      lastLogTime.current[logKey] = now;
    }
  }, [componentName]);
};

export default useLogger;
