import createLogger from './logger';

const log = createLogger('PageMapTracker');

/**
 * Configuration options
 */
const CONFIG = {
  // In production, disable all debug logs
  ENABLE_LOGS: process.env.NODE_ENV !== 'production',
  
  // Only log validation failures (not successes)
  LOG_ONLY_FAILURES: true
};

/**
 * Simple tracking for pageMap debugging
 */
export function trackPageMap(source, pageMap) {
  // Skip logging in production or if disabled
  if (!CONFIG.ENABLE_LOGS) return pageMap;
  
  // Skip invalid pageMaps
  if (!pageMap || !Array.isArray(pageMap.columnMap)) return pageMap;
  
  // Minimal logging to help with debugging
  log.debug(`PageMap from ${source}:`, {
    id: pageMap.id,
    table: pageMap.pageConfig?.table
  });
  
  return pageMap;
}

/**
 * Simple validation for pageMap structure
 */
export function verifyPageMap(pageMap, location = 'unknown') {
  // Basic validation
  if (!pageMap) {
    if (CONFIG.ENABLE_LOGS) {
      log.error(`PageMap missing at ${location}`);
    }
    return false;
  }
  
  if (!Array.isArray(pageMap.columnMap)) {
    if (CONFIG.ENABLE_LOGS) {
      log.error(`Invalid columnMap at ${location}`);
    }
    return false;
  }
  
  // Success case - only log if configured to do so
  if (CONFIG.ENABLE_LOGS && !CONFIG.LOG_ONLY_FAILURES) {
    log.debug(`PageMap valid at ${location}`);
  }
  
  return true;
}

// Simple repair function - kept for backward compatibility
export function repairPageMap(pageMap) {
  // This is a no-op in the simplified version
  // The CrudLayout validation will handle most issues
  return pageMap;
}
