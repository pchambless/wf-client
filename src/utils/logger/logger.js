import { LOG_LEVELS } from './types';
import { addToSequence } from './actions';

const LOGGER_METRICS = new Map();
const DEBUG_COMPONENTS = ['API', 'EventStore', 'ExternalStore'];

export const triggerLogUpdate = () => {
  window.dispatchEvent(new Event('logUpdate'));
};

export const createLogger = (componentName) => {
  // Auto-register new components
  if (!LOGGER_METRICS.has(componentName)) {
    LOGGER_METRICS.set(componentName, {
      created: new Date(),
      lastCall: null,
      calls: 0,
      level: DEBUG_COMPONENTS.includes(componentName) ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO
    });
  }

  const metrics = LOGGER_METRICS.get(componentName);
  
  const updateMetrics = (level, args) => {
    metrics.calls++;
    metrics.lastCall = new Date();
    addToSequence({
      time: new Date().toLocaleTimeString(),
      component: componentName,
      level: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level),
      message: args.join(' ')
    });
    triggerLogUpdate();
  };

  // Create base logger function
  const logger = (...args) => {
    if (metrics.level >= LOG_LEVELS.INFO) {
      updateMetrics(LOG_LEVELS.INFO, args);
      console.info(`[${componentName}]`, ...args);
    }
  };

  // Add log level methods
  Object.assign(logger, {
    info: (...args) => logger(...args),
    debug: (...args) => {
      if (metrics.level >= LOG_LEVELS.DEBUG) {
        updateMetrics(LOG_LEVELS.DEBUG, args);
        console.debug(`[${componentName}]`, ...args);
      }
    },
    warn: (...args) => {
      if (metrics.level >= LOG_LEVELS.WARN) {
        updateMetrics(LOG_LEVELS.WARN, args);
        console.warn(`[${componentName}]`, ...args);
      }
    },
    error: (...args) => {
      updateMetrics(LOG_LEVELS.ERROR, args);
      console.error(`[${componentName}]`, ...args);
    }
  });

  return logger;
};

export { LOGGER_METRICS };
