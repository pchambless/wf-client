const createLogger = (namespace) => {
  // Create base logging function
  const logFn = (...args) => console.log(`[${namespace}]`, ...args);
  
  // Add method variants
  logFn.info = (...args) => console.log(`[${namespace}]`, ...args);
  logFn.error = (...args) => console.error(`[${namespace}]`, ...args);
  logFn.warn = (...args) => console.warn(`[${namespace}]`, ...args);
  logFn.debug = (...args) => console.debug(`[${namespace}]`, ...args);
  
  return logFn;
};

export default createLogger;


