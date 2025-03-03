import { isProd } from '../environment';

// Log levels with numeric values for filtering
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Default configuration
const DEFAULT_CONFIG = {
  minLevel: isProd ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG,
  enableConsole: !isProd,
  enableMetrics: true,
  metricsBufferSize: 100,
};

class LogService {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metricsBuffer = [];
    this.subscribers = new Set();
  }

  // Core logging method
  log(level, message, context = {}, component = '') {
    if (level < this.config.minLevel) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: Object.keys(LOG_LEVELS)[level],
      component,
      message,
      context,
    };

    // Console output in development
    if (this.config.enableConsole) {
      const consoleMethod = this._getConsoleMethod(level);
      consoleMethod(`[${logEntry.component}] ${message}`, context);
    }

    // Notify subscribers
    this.subscribers.forEach(subscriber => subscriber(logEntry));

    return logEntry;
  }

  // Convenience methods for different log levels
  debug(message, context = {}, component = '') {
    return this.log(LOG_LEVELS.DEBUG, message, context, component);
  }

  info(message, context = {}, component = '') {
    return this.log(LOG_LEVELS.INFO, message, context, component);
  }

  warn(message, context = {}, component = '') {
    return this.log(LOG_LEVELS.WARN, message, context, component);
  }

  error(message, context = {}, component = '') {
    return this.log(LOG_LEVELS.ERROR, message, context, component);
  }

  // Performance metrics tracking
  startPerformanceTimer(label) {
    if (!this.config.enableMetrics) return null;
    const start = performance.now();
    return () => this.recordMetric(label, performance.now() - start);
  }

  recordMetric(label, duration) {
    if (!this.config.enableMetrics) return;

    const metric = {
      label,
      duration,
      timestamp: Date.now(),
    };

    this.metricsBuffer.push(metric);
    if (this.metricsBuffer.length > this.config.metricsBufferSize) {
      this.metricsBuffer.shift();
    }

    this.debug('Performance metric recorded', metric, 'Metrics');
  }

  // API request/response logging
  logApiRequest(method, url, data) {
    this.debug('API Request', { method, url, data }, 'API');
  }

  logApiResponse(method, url, response, duration) {
    this.debug('API Response', { 
      method, 
      url, 
      status: response.status,
      duration,
      data: response.data 
    }, 'API');
  }

  logApiError(method, url, error) {
    this.error('API Error', { 
      method, 
      url, 
      error: error.message,
      stack: error.stack 
    }, 'API');
  }

  // Subscription management
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Helper method to map log levels to console methods
  _getConsoleMethod(level) {
    switch (level) {
      case LOG_LEVELS.ERROR:
        return console.error;
      case LOG_LEVELS.WARN:
        return console.warn;
      case LOG_LEVELS.INFO:
        return console.info;
      default:
        return console.debug;
    }
  }

  // Get performance metrics
  getMetrics() {
    return [...this.metricsBuffer];
  }

  // Create a logger instance for a specific component/module
  createLogger(component = '') {
    return {
      debug: (message, context = {}) => this.debug(message, context, component),
      info: (message, context = {}) => this.info(message, context, component),
      warn: (message, context = {}) => this.warn(message, context, component),
      error: (message, context = {}) => this.error(message, context, component),
      startPerformanceTimer: (label) => this.startPerformanceTimer(`${component}:${label}`),
    };
  }
}

// Create and export singleton instance
export const logger = new LogService();

// Helper function to create a logger for a component/module
export const createLogger = (component) => logger.createLogger(component);

// Export class for testing or custom instances
export default LogService; 
