import createLogger from '../utils/logger';
import { fetchEventList, execEventType } from '../api/api';
import accountStore from './accountStore';

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

// Resolve all parameters at once
function resolveParams(requiredParams, params = {}, varMap = {}) {
  const result = {};
  const missing = [];
  
  // Debug logs to see what's coming in
  console.log('Resolving params:', {
    requiredParams,
    providedParams: params,
    varMap: Object.keys(varMap)
  });
  
  for (const param of requiredParams) {
    // Debug each parameter resolution attempt
    console.log(`Resolving parameter: ${param}`);
    console.log(`Direct params has ${param}?`, param in params);
    console.log(`Direct params keys:`, Object.keys(params));
    
    // Check direct params
    if (param in params) {
      result[param] = params[param];
      console.log(`Found in direct params: ${param} = ${params[param]}`);
      continue;
    }
    
    // Check varMap (same checks as above)
    if (param in varMap) {
      const valueOrFn = varMap[param];
      result[param] = typeof valueOrFn === 'function' ? valueOrFn() : valueOrFn;
      console.log(`Found in varMap: ${param}`);
      continue;
    }
    
    // Check accountStore common params
    if (param === ':acctID') {
      result[param] = accountStore.currentAcctID;
      console.log(`Resolved from accountStore: ${param} = ${accountStore.currentAcctID}`);
      continue;
    }
    if (param === ':userID') {
      result[param] = accountStore.currentUser?.userID;
      console.log(`Resolved from accountStore: ${param} = ${accountStore.currentUser?.userID}`);
      continue;
    }
    if (param === ':userEmail') {
      result[param] = accountStore.currentUser?.userEmail;
      console.log(`Resolved from accountStore: ${param} = ${accountStore.currentUser?.userEmail}`);
      continue;
    }
    if (param === ':firstName') {
      result[param] = accountStore.currentUser?.firstName;
      console.log(`Resolved from accountStore: ${param} = ${accountStore.currentUser?.firstName}`);
      continue;
    }
    if (param === ':lastName') {
      result[param] = accountStore.currentUser?.lastName;
      console.log(`Resolved from accountStore: ${param} = ${accountStore.currentUser?.lastName}`);
      continue;
    }
    if (param === ':roleID') {
      result[param] = accountStore.currentUser?.roleID;
      console.log(`Resolved from accountStore: ${param} = ${accountStore.currentUser?.roleID}`);
      continue;
    }
    
    // Check entity selections
    const key = param.startsWith(':') ? param.substring(1) : param;
    const selectedValue = accountStore.getSelectedEntity(key);
    if (selectedValue !== undefined) {
      result[param] = selectedValue;
      console.log(`Resolved from entity selection: ${param} = ${selectedValue}`);
      continue;
    }
    
    // Parameter not found
    console.log(`Could not resolve parameter: ${param}`);
    missing.push(param);
  }
  
  console.log('Parameter resolution results:', {
    resolved: Object.keys(result),
    missing
  });
  
  return { resolved: result, missing };
}

// Execute event with caller-provided variable map
export const execEvent = async (eventConfig, params = {}, varMap = {}) => {
  // Add debug logging at start of execution
  console.log(`📡 Executing event: ${eventConfig}`, { params });
  
  const cacheKey = JSON.stringify({ event: eventConfig, params });
  
  // Check cache first - no changes needed here
  if (executionCache.has(cacheKey)) {
    log.debug('Using cached execution:', eventConfig);
    return executionCache.get(cacheKey);
  }

  // Create promise for this execution
  const executionPromise = new Promise(async (resolve, reject) => {
    try {
      // Get event config and validate - no changes needed here
      let config;
      try {
        config = getEventTypeConfig(eventConfig);
      } catch (error) {
        // Enhanced error message handling
        const availableEvents = eventTypes.map(e => e.eventType);
        const suggestions = availableEvents
          .filter(e => e.includes(eventConfig.replace('By', '')))
          .slice(0, 3);
          
        const errorMsg = `Event type '${eventConfig}' not found. ${
          suggestions.length ? `Did you mean: ${suggestions.join(', ')}?` : ''
        }`;
        
        log.error(errorMsg);
        console.error(`❌ Event ${eventConfig} failed:`, new Error(errorMsg));
        throw new Error(errorMsg);
      }

      // Resolve all parameters in one step
      const requiredParams = config.params || [];
      const { resolved, missing } = resolveParams(requiredParams, params, varMap);
      
      if (missing.length > 0) {
        log.error('Missing parameters:', { event: eventConfig, missing });
        console.error(`❌ Event ${eventConfig} failed:`, new Error(`Missing required parameters: ${missing.join(', ')}`));
        throw new Error(`Missing required parameters: ${missing.join(', ')}`);
      }
      
      // Single debug log with full execution context
      log.debug('Execute event:', { 
        type: eventConfig,
        params: resolved,
        config: config.name
      });
      
      const response = await execEventType(eventConfig, resolved);
      
      // Add success debug log after execution
      console.log(`✅ Event ${eventConfig} succeeded:`, { 
        resultCount: Array.isArray(response) ? response.length : 'not an array',
        firstItem: Array.isArray(response) && response.length > 0 ? response[0] : null
      });
      
      // Clear cache after debounce
      setTimeout(() => {
        executionCache.delete(cacheKey);
      }, DEBOUNCE_TIME);
      
      resolve(response);
    } catch (error) {
      // Add failure debug log
      console.error(`❌ Event ${eventConfig} failed:`, error);
      
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


