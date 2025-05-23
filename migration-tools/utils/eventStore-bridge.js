/**
 * This file adapts your application's eventStore for use in Node.js scripts
 * It converts ES module imports to CommonJS require statements
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Simple logger replacement
const log = {
  debug: (...args) => console.log('[DEBUG]', ...args),
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.log('[WARN]', ...args),
  error: (...args) => console.log('[ERROR]', ...args)
};

// Load event types
const eventTypesPath = path.resolve(__dirname, '../../../wf-server/server/middleware/eventTypes.js');
const eventTypes = require(eventTypesPath);

// Cache for executions
const executionCache = new Map();

/**
 * Get config for a given event type
 */
function getEventTypeConfig(eventType) {
  const config = eventTypes.find(et => et.eventType === eventType);
  if (!config) {
    throw new Error(`Event type '${eventType}' not found`);
  }
  return config;
}

/**
 * Execute an event with parameters
 */
async function execEvent(eventType, params = {}) {
  console.log(`📡 Executing event: ${eventType}`, { params });
  
  const cacheKey = JSON.stringify({ event: eventType, params });
  
  // Check cache
  if (executionCache.has(cacheKey)) {
    log.debug('Using cached execution:', eventType);
    return executionCache.get(cacheKey);
  }

  try {
    // Get event config
    const config = getEventTypeConfig(eventType);
    
    // Base URL for API (should match your app's config)
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 
    
    // Make the request
    const response = await axios.get(`${API_URL}/api/${eventType}`, { params });
    const result = response.data;
    
    // Cache the result
    executionCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    log.error(`Error executing ${eventType}:`, error.message);
    throw error;
  }
}

module.exports = {
  execEvent,
  getEventTypeConfig
};
