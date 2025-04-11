import axios from 'axios';
import createLogger from './logger';

// CRITICAL FIX: Create logger properly as an object with methods
const log = createLogger('API');

// Configure base API URL from environment if available
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Common API call function with logging and error handling
 */
const callApi = async (endpoint, method = 'POST', data = {}) => {
  // Generate a unique operation ID for this API call to group related logs
  const opId = `api-call-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  try {
    // Start a log group for this API call 
    log.group(opId, `API Call: ${endpoint}`);
    
    // Log the request details
    log.info(`${method} request to ${endpoint}`, { 
      params: data,
      url: `${baseURL}/${endpoint}`
    });
    
    const startTime = performance.now();
    
    const response = await axios({
      url: `${baseURL}/${endpoint}`,
      method,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Calculate time taken
    const timeTaken = Math.round(performance.now() - startTime);
    
    // Log success with response size and time
    const responseSize = JSON.stringify(response.data).length;
    
    log.info(`Request succeeded in ${timeTaken}ms`, {
      status: response.status,
      size: `${(responseSize / 1024).toFixed(1)} KB`,
      items: Array.isArray(response.data) ? response.data.length : 'not an array'
    });
    
    // If we got detailed response info, log it at debug level
    if (response.data && response.data.meta) {
      log.debug('Response metadata:', response.data.meta);
    }
    
    log.groupEnd(opId);
    return response.data;
  } catch (error) {
    // Enhanced error logging
    log.error(`Request to ${endpoint} failed after ${Math.round(performance.now() - startTime)}ms`, {
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    log.groupEnd(opId);
    throw error;
  }
};

// ...existing code for exported functions...
