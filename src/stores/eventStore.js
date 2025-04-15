import createLogger from '../utils/logger';
import { fetchEventList, execEventType } from '../api/api';
import { getVar } from '../utils/externalStore';

const log = createLogger('EventStore');
const executionCache = new Map();
const DEBOUNCE_TIME = 300; // milliseconds

// State
let isInitialized = false;
let eventTypes = [];
let initPromise = null;

// Check if EventTypeService is initialized
export const isEventTypeServiceInitialized = () => {
  return isInitialized;
};

// Get event type configuration
export const getEventTypeConfig = (eventType) => {
  if (!isInitialized) {
    throw new Error('EventTypeService not initialized');
  }

  const config = eventTypes.find(e => e.eventType === eventType);
  if (!config) {
    throw new Error(`Event type '${eventType}' not found`);
  }

  return config;
};

// Execute event with parameter resolution
export const execEvent = async (eventConfig, params = {}) => {
  const cacheKey = JSON.stringify({ event: eventConfig, params });
  
  // Check cache first
  if (executionCache.has(cacheKey)) {
    log.debug('Using cached execution:', eventConfig);
    return executionCache.get(cacheKey);
  }

  // Create promise for this execution
  const executionPromise = new Promise(async (resolve, reject) => {
    try {
      // Get event config and validate
      let config;
      try {
        config = getEventTypeConfig(eventConfig);
      } catch (error) {
        // Enhanced error message for missing event type with suggestions
        const availableEvents = eventTypes.map(e => e.eventType);
        const suggestions = availableEvents
          .filter(e => e.includes(eventConfig.replace('By', '')))
          .slice(0, 3);
          
        const errorMsg = `Event type '${eventConfig}' not found. ${
          suggestions.length ? `Did you mean: ${suggestions.join(', ')}?` : ''
        }`;
        
        log.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Resolve parameters once with full context
      const requiredParams = config.params || [];
      const resolvedParams = {};
      
      for (const param of requiredParams) {
        const value = getVar(param);
        if (value === undefined) {
          log.error('Missing parameter:', { event: eventConfig, param });
          throw new Error(`Missing required parameter: ${param}`);
        }
        resolvedParams[param] = value;
      }

      // Single debug log with full execution context
      log.debug('Execute event:', { 
        type: eventConfig,
        params: resolvedParams,
        config: config.name
      });
      
      const response = await execEventType(eventConfig, resolvedParams);
      
      // Clear cache after debounce
      setTimeout(() => {
        executionCache.delete(cacheKey);
      }, DEBOUNCE_TIME);
      
      resolve(response);
    } catch (error) {
      executionCache.delete(cacheKey);
      reject(error);
    }
  });

  // Store in cache and return
  executionCache.set(cacheKey, executionPromise);
  return executionPromise;
};

/**
 * Stub function for future DML execution implementation
 * Currently just logs that it was called without doing anything
 */
export const execDML = async (formData, columns, formMode) => {
  log.info('execDML stub called:', { 
    mode: formMode, 
    formDataKeys: Object.keys(formData),
    columnCount: columns?.length
  });
  
  // This is just a stub - doesn't do anything yet
  return {
    success: false,
    message: 'DML execution not implemented yet',
    previewOnly: true
  };
};

// Initialize event type service
export const initEventTypeService = async () => {
  // If already initialized, return immediately
  if (isInitialized) {
    log.info('EventTypeService already initialized');
    return true;
  }
  
  // If initialization is already in progress, return the existing promise
  if (initPromise) {
    log.info('EventTypeService initialization already in progress');
    return initPromise;
  }
  
  // Create a new initialization promise
  log.info('Init EventTypeService...');
  initPromise = (async () => {
    try {
      // Fetch event types
      log.info('Fetching event types...');
      const fetchedEventTypes = await fetchEventList();
      
      if (!fetchedEventTypes || fetchedEventTypes.length === 0) {
        log.error('Failed to load EventTypes: None fetched');
        isInitialized = false;
        return false;
      }
      
      // Store event types
      eventTypes = fetchedEventTypes;
      isInitialized = true;
      log.info('EventTypes loaded', { count: eventTypes.length });
      return true;
    } catch (error) {
      log.error('Failed to load EventTypes:', error);
      isInitialized = false;
      // Rethrow to signal initialization failure
      throw error;
    } finally {
      // Clear the promise to allow retrying initialization if it failed
      if (!isInitialized) {
        initPromise = null;
      }
    }
  })();
  
  return initPromise;
};

// Reset for testing
export const resetEventTypeService = () => {
  isInitialized = false;
  eventTypes = [];
  initPromise = null;
  log.info('EventTypeService reset');
};
