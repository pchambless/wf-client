import { useMemo } from 'react';
import { createLogger } from '../utils/logger/LogService';

const useLogger = (component = '') => {
  return useMemo(() => createLogger(component), [component]);
};

export default useLogger;
