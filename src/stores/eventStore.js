import createLogger from '../utils/logger';
import { fetchEventList, execEventType } from '../api/api';
import { getVar } from '../utils/externalStore';

const log = createLogger('EventStore');

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
export const execEvent = async (eventType, customParams = {}) => {
  if (!isInitialized) {
    log.error('EventTypeService not initialized and no initialization in progress');
    throw new Error('EventTypeService not initialized');
  }

  try {
    // Get the event type configuration
    const config = getEventTypeConfig(eventType);
    
    // Get the required parameters from the event configuration
    let requiredParams = [];
    try {
      if (typeof config.params === 'string') {
        requiredParams = JSON.parse(config.params || '[]');
      } else if (Array.isArray(config.params)) {
        requiredParams = config.params;
      }
    } catch (error) {
      log.error(`Error parsing params for event type ${eventType}:`, error);
      requiredParams = [];
    }
    
    // Resolve parameters - combine custom params with resolved required params
    const resolvedParams = {};
    
    // First, add any custom params provided
    Object.keys(customParams).forEach(key => {
      resolvedParams[key] = customParams[key];
    });
    
    // Then, for each required param that doesn't have a custom value,
    // try to get it from externalStore
    requiredParams.forEach(param => {
      if (param in resolvedParams) return;
      
      const value = getVar(param);
      if (value !== undefined) {
        resolvedParams[param] = value;
      } else {
        resolvedParams[param] = param;
      }
    });
    
    log(`Executing event: ${eventType}`, {
      eventConfig: config,
      resolvedParams
    });
    
    // Use the existing execEventType function from api.js
    const response = await execEventType(eventType, resolvedParams);
    
    log.debug(`Response from ${eventType}:`, response);
    
    return response;
  } catch (error) {
    log.error(`Error executing event ${eventType}:`, error);
    throw error;
  }
};

// Initialize event type service
export const initEventTypeService = async () => {
  // If already initialized, return immediately
  if (isInitialized) {
    log('EventTypeService already initialized');
    return true;
  }
  
  // If initialization is already in progress, return the existing promise
  if (initPromise) {
    log('EventTypeService initialization already in progress');
    return initPromise;
  }
  
  // Create a new initialization promise
  log('Initializing EventTypeService...');
  initPromise = (async () => {
    try {
      // Fetch event types
      log('Fetching event types...');
      const fetchedEventTypes = await fetchEventList();
      
      if (!fetchedEventTypes || fetchedEventTypes.length === 0) {
        log.error('Failed to initialize EventTypeService: No event types fetched');
        isInitialized = false;
        return false;
      }
      
      // Store event types
      eventTypes = fetchedEventTypes;
      isInitialized = true;
      log('EventTypeService initialized successfully', { count: eventTypes.length });
      return true;
    } catch (error) {
      log.error('Failed to initialize EventTypeService:', error);
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
  log('EventTypeService reset');
};
