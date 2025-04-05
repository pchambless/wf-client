export const LOG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

/**
 * Enhanced logger with different log levels and performance tracking
 */
const createLogger = (module) => {
  const prefix = `[${module}]`;
  
  // Base log function that also returns the message for chaining
  const logFn = (level, message, data) => {
    // Future: This object will be used for persistent logging
    // eslint-disable-next-line no-unused-vars
    const _logObject = {
      timestamp: new Date().toISOString(),
      module,
      level,
      message,
      ...(data ? { data } : {})
    };
    
    // Different styling for different log levels
    let consoleFn;
    switch (level) {
      case 'ERROR':
        consoleFn = console.error;
        break;
      case 'WARN':
        consoleFn = console.warn;
        break;
      case 'INFO':
        consoleFn = console.info;
        break;
      case 'DEBUG':
        consoleFn = console.debug;
        break;
      default:
        consoleFn = console.log;
    }
    
    // Log to console with appropriate styling
    consoleFn(`${prefix} ${level}: ${message}`, data || '');
    
    return message; // Return for chaining
  };

  // Timer functionality
  const startPerformanceTimer = (label) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logFn('INFO', `Timer [${label}]: ${duration.toFixed(2)}ms`);
      return duration;
    };
  };

  // Create the logger object with different log levels
  const logger = (message, data) => logFn('INFO', message, data);
  
  // Add specific log level methods
  logger.error = (message, data) => logFn('ERROR', message, data);
  logger.warn = (message, data) => logFn('WARN', message, data);
  logger.info = (message, data) => logFn('INFO', message, data);
  logger.debug = (message, data) => logFn('DEBUG', message, data);
  
  // Add the timer functionality
  logger.startPerformanceTimer = startPerformanceTimer;

  return logger;
};

// Export both as default and named for maximum compatibility
export { createLogger };
export default createLogger;


