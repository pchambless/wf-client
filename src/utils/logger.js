// Enhanced logger with different log levels and modal integration

// Remove this direct import to break the circular dependency
// import { showError as showModalError } from '../stores/modalStore';

const createLogger = (module) => {
  const prefix = `[${module}]`;
  
  // Base log function that also returns the message for chaining
  const logFn = (level, message, data) => {
    const timestamp = new Date().toISOString();
    // Create log object for potential future storage
    // eslint-disable-next-line no-unused-vars
    const logObject = {
      timestamp,
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
        consoleFn = console.log;
        break;
      default:
        consoleFn = console.log;
    }
    
    // Log to console with appropriate styling
    consoleFn(`${prefix} ${level}: ${message}`, data || '');
    
    // Future enhancement: store logs for retrieval later
    // storeLogEntry(logObject);
    
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
  
  // Add methods to show modals with logging
  logger.showError = (message, data, showModal = true) => {
    const errorMessage = logFn('ERROR', message, data);
    
    // Show error in modal if requested
    if (showModal) {
      try {
        // Format data for display in modal if present
        let detailsText = '';
        if (data) {
          if (data instanceof Error) {
            detailsText = `\n\nDetails: ${data.message}\nStack: ${data.stack || 'No stack trace'}`;
          } else if (typeof data === 'object') {
            detailsText = `\n\nDetails: ${JSON.stringify(data, null, 2)}`;
          } else {
            detailsText = `\n\nDetails: ${data}`;
          }
        }
        
        // Lazy-load the modalStore to avoid circular dependency
        try {
          // Dynamic import to avoid circular dependencies
          setTimeout(() => {
            try {
              const modalStore = require('../stores/modalStore');
              if (modalStore && typeof modalStore.showError === 'function') {
                modalStore.showError(`${message}${detailsText}`);
              }
            } catch (importError) {
              console.error('Failed to import modalStore:', importError);
            }
          }, 0);
        } catch (e) {
          console.error('Failed to show error in modal:', e);
        }
      } catch (e) {
        console.error('Failed to show error in modal:', e);
      }
    }
    
    return errorMessage;
  };

  return logger;
};

export default createLogger;


