import { useCallback } from 'react';
const useLogger = (fileName) => {
  return useCallback((message, data = null) => {
    const time = new Date().toISOString();
    console.log(`[${fileName}] ${time} - ${message}`);
    if (data) {
      console.log(data);
    }
  }, [fileName]);
};

export default useLogger;
