const LOG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

// Simple metrics store
const LOGGER_METRICS = new Map();

// Core critical components that need DEBUG level
const DEBUG_COMPONENTS = ['API', 'EventStore', 'ExternalStore'];

const triggerLogUpdate = () => {
  window.dispatchEvent(new Event('logUpdate'));
};

const createLogger = (componentName) => {
  // Auto-register new components with smart defaults
  if (!LOGGER_METRICS.has(componentName)) {
    LOGGER_METRICS.set(componentName, {
      created: new Date(),
      lastCall: null,
      calls: 0,
      level: DEBUG_COMPONENTS.includes(componentName) ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO,
      acctID: window.sessionStore?.getVar(':acctID') || null
    });
  }

  const metrics = LOGGER_METRICS.get(componentName);
  
  const updateMetrics = () => {
    metrics.calls++;
    metrics.lastCall = new Date();
    metrics.lastStack = new Error().stack?.split('\n')[3] || 'Unknown';
    triggerLogUpdate();
  };
  
  // Create base function that handles direct calls
  const logger = (...args) => {
    if (metrics.level >= LOG_LEVELS.INFO) {
      updateMetrics();
      console.info(`[${componentName}]`, ...args);
    }
  };

  // Make the base function callable as log() and add methods
  Object.assign(logger, {
    info: (...args) => logger(...args),
    debug: (...args) => {
      if (metrics.level >= LOG_LEVELS.DEBUG) {
        updateMetrics();
        console.debug(`[${componentName}]`, ...args);
      }
    },
    warn: (...args) => {
      if (metrics.level >= LOG_LEVELS.WARN) {
        updateMetrics();
        console.warn(`[${componentName}]`, ...args);
      }
    },
    error: (...args) => {
      updateMetrics();
      console.error(`[${componentName}]`, ...args);
    }
  });

  return logger;
};

// Sort by calls descending, then by last call time
export const getLoggerTableData = () => {
  return Array.from(LOGGER_METRICS.entries())
    .filter(([_, m]) => m.calls > 0)
    .map(([name, m]) => {
      const lastCallDate = m.lastCall ? new Date(m.lastCall) : null;
      return {
        component: name,
        level: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === m.level) || 'UNKNOWN',
        calls: m.calls,
        lastCallDate: lastCallDate, // Store full date for sorting
        lastCall: lastCallDate 
          ? `${lastCallDate.toISOString().split('T')[0]} ${lastCallDate.toLocaleTimeString()}`
          : 'Never',
        created: m.created ? new Date(m.created).toISOString().split('T')[0] : 'N/A',
        acctID: window.sessionStore?.getVar(':acctID') || 'N/A'
      };
    })
    .sort((a, b) => {
      if (!a.lastCallDate) return 1;
      if (!b.lastCallDate) return -1;
      return b.lastCallDate.getTime() - a.lastCallDate.getTime();
    });
};

export { LOG_LEVELS };
export default createLogger;


