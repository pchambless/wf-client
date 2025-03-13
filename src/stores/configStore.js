import createLogger from '../utils/logger';
import { execEvent } from './eventStore';

const log = createLogger('ConfigStore');

// Private state
let eventTypeConfigs = [];
let pageConfigs = [];
let measurementList = [];

/**
 * Set event type configurations
 * @param {Array} configs - List of event type configurations
 */
export const setEventTypeConfigs = (configs) => {
  eventTypeConfigs = configs;
  log('Event type configs updated', { count: configs.length });
};

/**
 * Get event type configuration by name
 * @param {string} eventType - Name of the event type
 * @returns {Object|null} Event type configuration or null if not found
 */
export const getEventTypeConfig = (eventType) => {
  const config = eventTypeConfigs.find(config => config.eventType === eventType);
  if (!config) {
    log.warn('Event type not found', { eventType });
  }
  return config || null;
};

/**
 * Set page configurations
 * @param {Array} configs - List of page configurations
 */
export const setPageConfigs = (configs) => {
  pageConfigs = configs;
  log('Page configs updated', { count: configs.length });
};

/**
 * Get page configuration by name
 * @param {string} pageName - Name of the page
 * @returns {Object|null} Page configuration or null if not found
 */
export const getPageConfig = (pageName) => {
  const config = pageConfigs.find(config => config.pageName === pageName);
  if (!config) {
    log.warn('Page config not found', { pageName });
  }
  return config || null;
};

/**
 * Set measurement list
 * @param {Array} measurements - List of measurement types
 */
export const setMeasurementList = (measurements) => {
  measurementList = measurements;
  log('Measurement list updated', { count: measurements.length });
};

/**
 * Get measurement list
 * @returns {Array} List of measurement types
 */
export const getMeasurementList = () => {
  return [...measurementList];
};

/**
 * Initialize config store with application configuration data
 */
export const initConfigStore = async () => {
  const log = createLogger('ConfigStore');
  try {
    log('Initializing config store');
    
    // Load measurement list
    try {
      log('Loading measurement list');
      const measListResult = await execEvent('measList');
      if (measListResult && measListResult.length > 0) {
        setMeasurementList(measListResult);
        log('Measurement list loaded successfully', { count: measListResult.length });
      }
    } catch (measError) {
      log.warn('Error loading measurement list:', measError);
      // Non-critical, can continue
    }
    
    // Load page configurations
    try {
      log('Loading page configurations');
      const pageConfigs = await execEvent('apiPageConfigList');
      setPageConfigs(pageConfigs);
      log('Page configurations loaded successfully', { count: pageConfigs.length });
    } catch (pageError) {
      log.warn('Error loading page configurations:', pageError);
      // Non-critical, can continue
    }
    
    log('Config store initialized successfully');
    return true;
  } catch (error) {
    log.error('Failed to initialize config store:', error);
    return false;
  }
};

/**
 * React hook for configuration management
 * @returns {Object} Configuration state and methods
 */
export const useConfigStore = () => {
  const { useState, useEffect } = require('react');
  
  const [eventTypes, setEventTypes] = useState(eventTypeConfigs);
  const [pages, setPages] = useState(pageConfigs);
  const [measurements, setMeasurements] = useState(measurementList);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (JSON.stringify(eventTypeConfigs) !== JSON.stringify(eventTypes)) {
        setEventTypes([...eventTypeConfigs]);
      }
      
      if (JSON.stringify(pageConfigs) !== JSON.stringify(pages)) {
        setPages([...pageConfigs]);
      }
      
      if (JSON.stringify(measurementList) !== JSON.stringify(measurements)) {
        setMeasurements([...measurementList]);
      }
    }, 200);
    
    return () => clearInterval(intervalId);
  }, [eventTypes, pages, measurements]);
  
  return {
    eventTypes,
    pages,
    measurements,
    getEventTypeConfig,
    getPageConfig,
    setEventTypeConfigs,
    setPageConfigs,
    setMeasurementList
  };
};
